# Configuración de Docker para MySQL

## Requisitos
- Docker
- Docker Compose

## Pasos para ejecutar

### 1. Iniciar los servicios
```bash
docker-compose up -d
```

### 2. Verificar que los servicios estén corriendo
```bash
docker-compose ps
```

### 3. Ver logs de MySQL
```bash
docker-compose logs mysql
```

### 4. Acceder a phpMyAdmin
- Abre tu navegador y ve a: `http://localhost:8080`
- Usuario: `root`
- Contraseña: `root123`

### 5. Detener los servicios
```bash
docker-compose down
```

### 6. Detener y eliminar volúmenes (para resetear completamente)
```bash
docker-compose down -v
```

## Configuración de la base de datos

### Credenciales:
- **Host**: localhost
- **Puerto**: 3306
- **Base de datos**: auth_users_db
- **Usuario**: auth_user
- **Contraseña**: auth123

### Usuario root (para phpMyAdmin):
- **Usuario**: root
- **Contraseña**: root123

## Variables de entorno

El archivo `.env` ya está configurado con las credenciales correctas para conectarse a MySQL.

## Solución de problemas

### Si tienes problemas de conexión:
1. Verifica que Docker esté corriendo
2. Verifica que el puerto 3306 no esté ocupado
3. Ejecuta `docker-compose logs mysql` para ver los logs
4. Asegúrate de que el archivo `.env` tenga las credenciales correctas

### Si necesitas resetear la base de datos:
```bash
docker-compose down -v
docker-compose up -d
``` 