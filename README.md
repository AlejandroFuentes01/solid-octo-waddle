# Asistencia Tickets

Asistencia Tickets es una aplicación web diseñada para gestionar tickets de soporte técnico. Incluye un sistema de roles (Administrador y Usuario Normal) con diferentes funcionalidades según el tipo de usuario.

## 🚀 Características

- **Administrador:**
  - Visualizar y gestionar todos los tickets.
  - Filtrar tickets por estado o área.
  - Crear y administrar usuarios.

- **Usuario Normal:**
  - Crear tickets de soporte.
  - Visualizar los tickets creados y su estado.

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - [Next.js](https://nextjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - Componentes personalizados como `HeaderAdmin`, `HeaderUser`, y `Footer`.

- **Backend:**
  - Prisma para la gestión de base de datos.
  - MySQL como base de datos principal.
  - API REST para la comunicación con el frontend.

- **Otros:**
  - Autenticación con NextAuth.js.
  - Deploy planeado con [Vercel](https://vercel.com/).

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   ├── user/
│   │   ├── tickets/
│   │   │   └── page.tsx
│   │   ├── create-ticket/
│   │       └── page.tsx
├── components/
│   ├── HeaderAdmin.tsx
│   ├── HeaderUser.tsx
│   ├── Footer.tsx
├── prisma/
│   ├── schema.prisma
├── styles/
│   └── globals.css
```

## 📦 Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/asistencia-tickets.git
   cd asistencia-tickets
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/asistencia_tickets"
   NEXTAUTH_SECRET="tu_secreto"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Realiza las migraciones de la base de datos:
   ```bash
   npx prisma migrate dev
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🧪 Pruebas

Puedes probar la aplicación usando herramientas como Postman para interactuar con la API o simplemente navegando a `http://localhost:3000`.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un _issue_ o envía un _pull request_ si tienes mejoras o encuentras algún problema.
