# User Service

Microservicio encargado de la gestión de perfiles de usuario, roles y almacenamiento persistente de credenciales.

## 📋 Características
-   👤 **Gestión de Perfiles**: Registro, actualización y consulta de usuarios.
-   🔐 **Seguridad**: Almacenamiento seguro de contraseñas.
-   🗄️ **Persistencia**: Uso de PostgreSQL para datos relacionales.

## 🛠️ Tecnologías
-   NestJS
-   TypeScript
-   PostgreSQL / TypeORM
-   RabbitMQ

## 🚀 Configuración
1.  **Variables de Entorno**:
    ```bash
    cp .env.example .env
    ```
2.  **Base de Datos**: Requiere una instancia de PostgreSQL accesible.
3.  **Ejecución**:
    ```bash
    pnpm run start:dev
    ```

## 📡 Patrones de Mensajería
Este servicio responde a patrones de mensaje como:
-   `validate_user`: Para comprobación de credenciales desde el Gateway.
-   `get_user_by_id`: Para obtener detalles del perfil.