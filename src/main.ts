import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://dasboardadmincl.netlify.app/',
      'http://localhost:5173',
      'https://tusitio.netlify.app'
    ],
    credentials: true,
  });

  await app.listen(envs.port ?? 3000);
}
bootstrap();
