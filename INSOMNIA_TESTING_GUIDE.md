# Guía de Pruebas en Insomnia - Autenticación de Psicólogo

## Configuración Inicial

### 1. Configurar el entorno en Insomnia
- Crea un nuevo **Environment** llamado "Auth Users API"
- Añade las siguientes variables:
  ```
  BASE_URL: http://localhost:3000
  FIREBASE_TOKEN: (se llenará después)
  ```

## Endpoints Disponibles

### 1. Login con Firebase Token
**POST** `{{BASE_URL}}/auth/login`

### 2. Registrar Psicólogo (Protegido)
**POST** `{{BASE_URL}}/psicologos`

**Body (JSON):**
```json
{
  "cedula_profesional": "PSI123456789",
  "cedula_documento_url": "https://ejemplo.com/cedula.pdf",
  "estado_licencia": "activa",
  "especialidad": "Psicología Clínica"
}
```

### 3. Obtener Perfil de Psicólogo (Protegido)
**GET** `{{BASE_URL}}/psicologos/perfil`

### 4. Obtener Todos los Psicólogos (Protegido)
**GET** `{{BASE_URL}}/psicologos`

### 5. Obtener Psicólogo por ID (Protegido)
**GET** `{{BASE_URL}}/psicologos/1`

### 6. Actualizar Psicólogo (Protegido)
**PATCH** `{{BASE_URL}}/psicologos/1`

### 7. Eliminar Psicólogo (Protegido)
**DELETE** `{{BASE_URL}}/psicologos/1`

## Pasos para Probar

### Paso 1: Login
1. **Method:** POST
2. **URL:** `{{BASE_URL}}/auth/login`
3. **Body:** `{"token": "{{FIREBASE_TOKEN}}"}`

### Paso 2: Registrar Psicólogo
1. **Method:** POST
2. **URL:** `{{BASE_URL}}/psicologos`
3. **Headers:** `Authorization: Bearer {{FIREBASE_TOKEN}}`
4. **Body:**
```json
{
  "cedula_profesional": "PSI123456789",
  "cedula_documento_url": "https://ejemplo.com/cedula.pdf",
  "estado_licencia": "activa",
  "especialidad": "Psicología Clínica"
}
```

### Paso 3: Obtener Perfil
1. **Method:** GET
2. **URL:** `{{BASE_URL}}/psicologos/perfil`
3. **Headers:** `Authorization: Bearer {{FIREBASE_TOKEN}}`

## Casos de Prueba

### Caso 1: Registro Exitoso
- ✅ Login exitoso
- ✅ Registro de psicólogo exitoso
- ✅ Perfil creado correctamente

### Caso 2: Registro Duplicado
- ❌ Error 409 Conflict
- ❌ Mensaje: "El usuario ya tiene un perfil de psicólogo"

### Caso 3: Cédula Duplicada
- ❌ Error 409 Conflict
- ❌ Mensaje: "La cédula profesional ya está registrada"

### Caso 4: Token Inválido
- ❌ Error 401 Unauthorized
- ❌ Mensaje: "Token inválido o expirado"

### Caso 5: Sin Token
- ❌ Error 401 Unauthorized
- ❌ Mensaje: "Token no proporcionado"

### Caso 6: Validación de Datos
- ❌ Error 400 Bad Request
- ❌ Mensaje de validación específico

## Colección de Insomnia

1. **Login Psicólogo** (POST)
2. **Registrar Psicólogo** (POST)
3. **Obtener Perfil** (GET)
4. **Obtener Todos** (GET)
5. **Actualizar Psicólogo** (PATCH)
6. **Eliminar Psicólogo** (DELETE)

## Troubleshooting

### Error: "Cannot connect to server"
- Verifica que tu aplicación NestJS esté corriendo en `http://localhost:3000`
- Ejecuta: `npm run start:dev`

### Error: "Token inválido"
- Verifica que el token de Firebase sea válido
- Asegúrate de que el token no haya expirado
- Verifica que el proyecto de Firebase esté configurado correctamente

### Error: "Database connection failed"
- Verifica que MySQL esté corriendo (Docker Compose)
- Ejecuta: `docker-compose ps`
- Si no está corriendo: `docker-compose up -d`

### Error: "Usuario no encontrado"
- Asegúrate de haber hecho login primero
- Verifica que el usuario se haya creado en la base de datos

## Variables de Entorno para Testing

En tu `.env`:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=auth_user
DB_PASSWORD=auth123
DB_DATABASE=auth_users_db
``` 