import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { CreatePsicologoDto } from './dto/create-psicologo.dto';
import { UpdatePsicologoDto } from './dto/update-psicologo.dto';
import { Psicologo } from './entities/psicologo.entity';

const invalidatedTokens = new Set<string>();

// Función para normalizar strings: mayúsculas, sin tildes, sin espacios extras
function normalizeString(str: string): string {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita tildes
    .replace(/\s+/g, ' ') // Espacios múltiples a uno
    .trim();
}

async function validarCedulaSEP(nombre: string, paterno: string, materno: string, cedula: string): Promise<boolean> {
  const json = {
    maxResult: "1000",
    nombre: nombre.toUpperCase(),
    paterno: paterno.toUpperCase(),
    materno: materno.toUpperCase(),
    idCedula: ""
  };

  const response = await axios.post(
    'https://www.cedulaprofesional.sep.gob.mx/cedula/buscaCedulaJson.action',
    `json=${JSON.stringify(json)}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://www.cedulaprofesional.sep.gob.mx',
        'Referer': 'https://www.cedulaprofesional.sep.gob.mx/cedula/presidencia/indexAvanzada.action',
        'User-Agent': 'insomnia/11.2.0',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
  );

  const resultados = response.data.items;
  console.log('Resultados SEP:', resultados); // Para depuración
  if (!resultados) return false;
  let match = false;
  resultados.forEach((item: any) => {
    const nCedula = normalizeString(item.idCedula);
    const nNombre = normalizeString(item.nombre);
    const nPaterno = normalizeString(item.paterno);
    const nMaterno = normalizeString(item.materno);
    const nCedulaInput = normalizeString(cedula);
    const nNombreInput = normalizeString(nombre);
    const nPaternoInput = normalizeString(paterno);
    const nMaternoInput = normalizeString(materno);
    console.log('Comparando:');
    console.log('  idCedula:', nCedula, 'vs', nCedulaInput);
    console.log('  nombre:  ', nNombre, 'vs', nNombreInput);
    console.log('  paterno: ', nPaterno, 'vs', nPaternoInput);
    console.log('  materno: ', nMaterno, 'vs', nMaternoInput);
    if (
      nCedula === nCedulaInput &&
      nNombre === nNombreInput &&
      nPaterno === nPaternoInput &&
      nMaterno === nMaternoInput
    ) {
      match = true;
    }
  });
  return match;
}

@Injectable()
export class PsicologoService {
  constructor(
    @InjectRepository(Psicologo)
    private readonly psicologoRepository: Repository<Psicologo>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createPsicologoDto: CreatePsicologoDto) {
    const exists = await this.psicologoRepository.findOne({ where: { correo: createPsicologoDto.correo } });
    if (exists) throw new BadRequestException('Correo ya registrado');

    // Separar apellidos
    const apellidos = createPsicologoDto.apellido.trim().split(/\s+/);
    const paterno = apellidos[0] || '';
    const materno = apellidos[1] || '';

    // Validar cédula con la SEP antes de guardar
    const cedulaValida = await validarCedulaSEP(
      createPsicologoDto.nombre,
      paterno,
      materno,
      createPsicologoDto.cedulaProfesional
    );
    if (!cedulaValida) {
      throw new BadRequestException('La cédula profesional y el nombre no coinciden con la SEP');
    }

    const hash = await bcrypt.hash(createPsicologoDto.contrasena, 10);
    const psicologo = this.psicologoRepository.create({
      ...createPsicologoDto,
      contrasena: hash,
    });
    return this.psicologoRepository.save(psicologo);
  }

  findAll() {
    return this.psicologoRepository.find();
  }

  async findOne(id: number) {
    const psicologo = await this.psicologoRepository.findOne({ where: { id } });
    if (!psicologo) throw new NotFoundException('Psicologo no encontrado');
    return psicologo;
  }

  async update(id: number, updatePsicologoDto: UpdatePsicologoDto) {
    const psicologo = await this.psicologoRepository.findOne({ where: { id } });
    if (!psicologo) throw new NotFoundException('Psicologo no encontrado');
    if (updatePsicologoDto.contrasena) {
      updatePsicologoDto.contrasena = await bcrypt.hash(updatePsicologoDto.contrasena, 10);
    }
    Object.assign(psicologo, updatePsicologoDto);
    return this.psicologoRepository.save(psicologo);
  }

  async remove(id: number) {
    const psicologo = await this.psicologoRepository.findOne({ where: { id } });
    if (!psicologo) throw new NotFoundException('Psicologo no encontrado');
    await this.psicologoRepository.remove(psicologo);
    return { message: 'Psicologo eliminado' };
  }

  // Login con JWT
  async login(correo: string, contrasena: string) {
    const psicologo = await this.psicologoRepository.findOne({ where: { correo } });
    if (!psicologo) throw new NotFoundException('Correo no registrado');
    const valid = await bcrypt.compare(contrasena, psicologo.contrasena);
    if (!valid) throw new BadRequestException('Contraseña incorrecta');
    const payload = { sub: psicologo.id, correo: psicologo.correo };
    const token = this.jwtService.sign(payload);
    return { psicologo, token };
  }

  // Logout: invalida el token recibido
  async logout(token: string) {
    if (!token) throw new UnauthorizedException('Token requerido');
    invalidatedTokens.add(token);
    return { message: 'Sesión cerrada, token invalidado' };
  }

  // Método para verificar si un token está invalidado
  isTokenInvalidated(token: string): boolean {
    return invalidatedTokens.has(token);
  }
}
