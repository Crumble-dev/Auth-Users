import 'dotenv/config'; 
import * as joi from 'joi';
interface EnvironmentsVariables {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  //FIREBASE_FILE_PATH: string;
  JWT_SECRET: string;
  DB_TYPE: string; 
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
}

const envsScheme = joi
  .object({
    PORT: joi.number().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
    //FIREBASE_FILE_PATH: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    
  
    DB_TYPE: joi.string().valid('mysql', 'mariadb', 'postgres', 'sqlite').required(), // Puedes añadir más tipos si los usas
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
  })
  .unknown(); // Permite variables de entorno que no están definidas en el esquema

const { error, value } = envsScheme.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const env: EnvironmentsVariables = value;

export const envs = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV || 'development',
  //firebaseFilePath: env.FIREBASE_FILE_PATH,
  jwt: { secret: env.JWT_SECRET },
  

  database: {
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  },
};

console.log(envs);