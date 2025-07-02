import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

const invalidatedTokens = new Set<string>();

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const exists = await this.usuarioRepository.findOne({ where: { correo: createUsuarioDto.correo } });
    if (exists) throw new BadRequestException('Correo ya registrado');
    const hash = await bcrypt.hash(createUsuarioDto.contrasena, 10);
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      contrasena: hash,
    });
    return this.usuarioRepository.save(usuario);
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    if (updateUsuarioDto.contrasena) {
      updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, 10);
    }
    Object.assign(usuario, updateUsuarioDto);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    await this.usuarioRepository.remove(usuario);
    return { message: 'Usuario eliminado' };
  }

  // Login con JWT
  async login(correo: string, contrasena: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { correo } });
    if (!usuario) throw new NotFoundException('Correo no registrado');
    const valid = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!valid) throw new BadRequestException('Contraseña incorrecta');
    const payload = { sub: usuario.id, correo: usuario.correo, rol: usuario.rol };
    const token = this.jwtService.sign(payload);
    return { usuario, token };
  }

  // Logout: invalida el token recibido
  async logout(token: string) {
    if (!token) throw new UnauthorizedException('Token requerido');
    invalidatedTokens.add(token);
    return { message: 'Sesión cerrada, token invalidado' };
  }

  isTokenInvalidated(token: string): boolean {
    return invalidatedTokens.has(token);
  }
}
