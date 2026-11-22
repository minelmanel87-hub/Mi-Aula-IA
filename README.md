# Mi Aula IA

Plataforma educativa responsive para estudiar con apoyo de inteligencia artificial.

## Primera versión
- Panel de inicio y navegación responsive.
- Perfil de creador/administrador editable.
- Pantallas iniciales para crear exámenes, recibir ayuda con deberes y consultar al asistente.
- Flujo de propuestas de cambios con aprobación del creador.

## Desarrollo
Requiere Node.js y npm.

```bash
npm install
npm run dev
```

## Próximos pasos
1. Conectar autenticación y perfiles con Supabase, incluyendo permisos de creador.
2. Conectar el asistente con un proveedor de IA en el servidor; nunca exponer claves en el navegador.
3. Añadir subida segura de fotos/PDF, lectura de ejercicios y generación real de exámenes.
4. Guardar exámenes, conversaciones y progreso con políticas RLS.
5. Configurar despliegues de preview y preparar la PWA antes de empaquetar para tiendas móviles.

Los cambios de configuración y publicación deben requerir autorización del creador.