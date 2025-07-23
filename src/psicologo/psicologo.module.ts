import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PsicologoService } from './psicologo.service';
import { PsicologoController } from './psicologo.controller';
import { Psicologo } from './entities/psicologo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Psicologo, Usuario]),
    JwtModule.register({
      secret: 'supersecreto', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [PsicologoController],
  providers: [PsicologoService],
})
export class PsicologoModule {}
