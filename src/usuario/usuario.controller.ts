import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }

  @Post('login')
  login(@Body() body: { correo: string; contrasena: string }) {
    return this.usuarioService.login(body.correo, body.contrasena);
  }

  @Post('logout')
  logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    return this.usuarioService.logout(token);
  }
}
