# RestaurantSystem

[![Restaurant-System1.jpg](https://i.postimg.cc/Xqrmmhv8/Restaurant-System1.jpg)](https://postimg.cc/tnHBVBWZ)

[![Restaurant-System2.jpg](https://i.postimg.cc/wj8Z4wYX/Restaurant-System2.jpg)](https://postimg.cc/PPySPzxJ)

## 🛠️ Backend - Sistema POS Foodly

Este proyecto representa el desarrollo del **backend de un sistema de punto de venta (POS)** diseñado específicamente para **Foodly**, un restaurante de comida rápida que busca optimizar su operación diaria mediante soluciones tecnológicas eficientes.

El sistema fue construido con el objetivo de **automatizar y centralizar procesos clave**, tales como:

- Registro y gestión de **pedidos** y **ventas**
- Control de **inventario** y **stock de productos**
- Administración de **usuarios y roles** (empleados, cajeros, administradores)
- Generación de **reportes e informes de ventas**
- Procesamiento de **órdenes** (simulación de pagos con generación de boletas)

Desde el enfoque del backend, se han implementado funcionalidades **robustas y seguras** que permiten la comunicación entre la interfaz de usuario y la base de datos, garantizando **integridad, eficiencia y escalabilidad** del sistema. Además, se contemplan principios de **mantenibilidad**, **control de acceso por roles** y **registro detallado de operaciones**, lo que permite al negocio tener mayor trazabilidad de sus actividades.

Este backend forma parte fundamental de una estrategia de digitalización más amplia que incluye el desarrollo de una **aplicación web** para clientes y empleados, con el fin de brindar una experiencia **moderna, rápida y ordenada** en la atención al cliente.

---

## 🧰 Tecnologías y Herramientas Utilizadas

- **Java 17** – Lenguaje principal de desarrollo.
- **Spring Boot** – Framework para la construcción de aplicaciones empresariales.
- **Spring Data JPA** – Persistencia y manejo de datos relacionales.
- **Spring Security** – Seguridad con autenticación y autorización.
- **Spring Test** – Para pruebas unitarias e integradas.
- **Swagger (Springfox)** – Documentación interactiva de la API REST.
- **Modelo MVC** – Arquitectura organizada por capas.
- **Postman** – Para pruebas manuales de endpoints.
- **Git** – Control de versiones.

## ⚙️ Configuración del archivo `application.properties`

> ⚠️ **IMPORTANTE:** Antes de ejecutar el proyecto por primera vez, debes crear manualmente la base de datos en tu gestor (como MySQL o PostgreSQL).  
> Si no lo haces, la aplicación lanzará un error de conexión, ya que **no se encarga de crear la base de datos automáticamente**, solo las tablas.

```properties
# Nombre de la aplicación
spring.application.name=API_V01

# --- Configuración de la base de datos ---
spring.datasource.username=TU_USERNAME_DE_BD
spring.datasource.password=TU_PASSWORD_DE_BD
spring.datasource.url=jdbc:GESTOR_DE_DB://localhost:PUERTO/NOMBRE_BD

# Contexto base para los endpoints
server.servlet.context-path=/api/

# --- JPA / Hibernate ---
spring.jpa.generate-ddl=true
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update

# --- JWT (Autenticación con tokens) ---
jwt-secret-word=SECRET_WORD
jwt-seconds=TIEMPO_EN_SEGUNDOS

# --- CORS (Origen permitido del frontend) ---
port-front=URL_DEL_FRONTEND

# --- Paginación ---
Entity-size=NUM_DE_ENTIDADES_POR_PAGINA

# --- Logging de seguridad (opcional) ---
logging.level.org.springframework.security=DEBUG
```
---

### 📘 Visualización de la API con Swagger

Para facilitar el desarrollo y las pruebas, este proyecto incluye **Swagger UI** como herramienta de documentación y prueba de las APIs REST.

Una vez que la aplicación esté en ejecución, puedes acceder a la interfaz web de Swagger en la siguiente URL:

🔗 **URL de Swagger UI:**  
[http://localhost:8080/api/swagger-ui/index.html#/](http://localhost:8080/api/swagger-ui/index.html#/)

> 🔒 **Nota:** Swagger estará disponible solo si el backend se está ejecutando correctamente y escuchando en el puerto `8080`. Asegúrate también de que el contexto base esté definido como `/api/` en el archivo `application.properties`.

Esta herramienta permite visualizar todos los endpoints disponibles, sus métodos HTTP, parámetros requeridos, respuestas posibles y más. También puedes **probar directamente las peticiones** desde la interfaz de Swagger sin necesidad de Postman u otra herramienta externa.
--

## 💻 ¿Cómo ejecutar el frontend?

Si quieres probar el frontend del sistema:

1. Abre una terminal en la carpeta del frontend.
2. Ejecuta el siguiente comando para instalar las dependencias:
   ```bash
    # 2. Instalar dependencias
        npm install
    # o con yarn
        yarn install
   ```
