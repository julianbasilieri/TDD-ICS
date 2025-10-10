# EcoHarmony Park - Sistema de Reservas

Sistema de gestión de reservas y compra de entradas para EcoHarmony Park.

## 🌟 Características

- Reserva de entradas para días específicos
- Dos modalidades de pago: efectivo en boletería y Mercado Pago
- Sistema de notificaciones por email
- Gestión de disponibilidad de entradas
- Interfaz responsive

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta en [EmailJS](https://www.emailjs.com/) para el envío de emails

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd ics-tdd
```

2. Instalar dependencias:
```bash
npm install
```

## ⚙️ Configuración

1. Crear archivo `.env` en la raíz del proyecto:
```env
VITE_EMAILJS_SERVICE_ID="your_service_id"
VITE_EMAILJS_TEMPLATE_ID_BOLETERIA="your_boleteria_template_id"
VITE_EMAILJS_TEMPLATE_ID_MERCADOPAGO="your_mercadopago_template_id"
VITE_EMAILJS_PUBLIC_KEY="your_public_key"
```

2. Configurar EmailJS:
   - Crear una cuenta en [EmailJS](https://www.emailjs.com/)
   - Crear un servicio de email
   - Crear dos templates: uno para reservas en boletería y otro para pagos con Mercado Pago
   - Copiar los IDs correspondientes al archivo .env

## 🏃‍♂️ Ejecución

Desarrollo:
```bash
npm run dev
```

Producción:
```bash
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── pages/           # Páginas de la aplicación
├── services/        # Servicios (tickets, transacciones, emails)
├── assets/          # Recursos estáticos
└── main.tsx         # Punto de entrada
```

## 🔑 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| VITE_EMAILJS_SERVICE_ID | ID del servicio de EmailJS |
| VITE_EMAILJS_TEMPLATE_ID_BOLETERIA | ID del template para reservas en boletería |
| VITE_EMAILJS_TEMPLATE_ID_MERCADOPAGO | ID del template para pagos con Mercado Pago |
| VITE_EMAILJS_PUBLIC_KEY | Clave pública de EmailJS |

## 💻 Tecnologías Utilizadas

- React + TypeScript
- Vite
- Mantine UI
- React Router
- React Hook Form
- EmailJS
