import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { PsicologoService } from './psicologo.service';
import { CreatePsicologoDto } from './dto/create-psicologo.dto';
import { UpdatePsicologoDto } from './dto/update-psicologo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('psicologo')
export class PsicologoController {
  constructor(
    private readonly psicologoService: PsicologoService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  @Post()
  create(@Body() createPsicologoDto: CreatePsicologoDto) {
    return this.psicologoService.create(createPsicologoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.psicologoService.findAll();
  }

    @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psicologoService.findOne(+id);
  }

    @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePsicologoDto: UpdatePsicologoDto) {
    return this.psicologoService.update(+id, updatePsicologoDto);
  }

    @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psicologoService.remove(+id);
  }

  @Post('login')
  login(@Body() body: { correo: string; contrasena: string }) {
    return this.psicologoService.login(body.correo, body.contrasena);
  }

  @Post('logout')
  logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    return this.psicologoService.logout(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/pacientes')
  getPacientes(@Param('id') id: string) {
    return this.psicologoService.getPacientesByPsicologo(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/parejas')
  getParejas(@Param('id') id: string) {
    return this.psicologoService.getParejasByPsicologo(+id);
  }

}
