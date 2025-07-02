import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { PsicologoService } from './psicologo.service';
import { CreatePsicologoDto } from './dto/create-psicologo.dto';
import { UpdatePsicologoDto } from './dto/update-psicologo.dto';

@Controller('psicologo')
export class PsicologoController {
  constructor(private readonly psicologoService: PsicologoService) {}

  @Post()
  create(@Body() createPsicologoDto: CreatePsicologoDto) {
    return this.psicologoService.create(createPsicologoDto);
  }

  @Get()
  findAll() {
    return this.psicologoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psicologoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePsicologoDto: UpdatePsicologoDto) {
    return this.psicologoService.update(+id, updatePsicologoDto);
  }

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
    // El token debe venir como 'Bearer <token>'
    const token = authHeader?.split(' ')[1];
    return this.psicologoService.logout(token);
  }
}
