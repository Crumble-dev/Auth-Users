import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envs } from './config/envs';

import { PsicologoModule } from './psicologo/psicologo.module';
import { JwtStrategy } from './auth/jwt.strategy';

import { Usuario } from './usuario/entities/usuario.entity';
import { Psicologo } from './psicologo/entities/psicologo.entity';
import { UsuarioModule } from './usuario/usuario.module';
import { Logueo } from './psicologo/entities/logueo.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: envs.database.type as 'mysql',
      host: envs.database.host,
      port: envs.database.port,
      username: envs.database.username,
      password: envs.database.password,
      database: envs.database.database,
      entities: [Usuario, Psicologo, Logueo],
      synchronize: true,
      logging: true,
    }),


    PsicologoModule,
    UsuarioModule, 
    Logueo
  ],
  controllers: [],
  providers: [
    JwtStrategy,
  ],
})
export class AppModule {}