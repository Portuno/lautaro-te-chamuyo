# Guía de Despliegue - Lautaro

## Problemas Resueltos

### ✅ Logo Preload Warning
- **Problema**: `The resource logo.svg was preloaded using link preload but not used`
- **Solución**: Eliminado el `<link rel="preload">` innecesario del `index.html`

### ✅ MIME Type Error  
- **Problema**: `Expected a JavaScript module script but the server responded with a MIME type of "text/html"`
- **Solución**: Mejorada la configuración de Vercel con headers apropiados

## Despliegue a Producción

### Opción 1: Usando Vercel CLI (Recomendado)

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Hacer login
vercel login

# Desplegar
npm run deploy
```

### Opción 2: Usando Git Push (si tienes auto-deploy configurado)

```bash
# Hacer commit de los cambios
git add .
git commit -m "Fix: Logo preload warning and MIME type issues"
git push origin main
```

### Opción 3: Build local y deploy manual

```bash
# Build para producción
npm run build:prod

# Deploy manual
vercel --prod
```

## Verificación Post-Despliegue

1. **Abrir** `https://www.lautaro.xyz`
2. **Verificar** que no hay errores en la consola del navegador
3. **Probar** el botón "ENV" (esquina inferior derecha) en modo desarrollo local
4. **Confirmar** que Supabase funciona correctamente

## Variables de Entorno en Producción

Asegúrate de que las siguientes variables estén configuradas en Vercel:

```
VITE_MABOT_USERNAME=Lautaro.sarni@gmail.com
VITE_MABOT_PASSWORD=Lelouch18349
VITE_API_BASE_URL=https://back.mapeima.space:8443
VITE_SUPABASE_URL=https://ojrpfllxynkklkfkynwv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qcnBmbGx4eW5ra2xrZmt5bnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzQ4MzMsImV4cCI6MjA2NDA1MDgzM30.8303lkGMHnEmvpAYfG0yLmBQSMKw5W2Rn_O7dk1TR5A
NODE_ENV=production
```

## Archivos Modificados

- ✅ `index.html` - Removido preload innecesario
- ✅ `vercel.json` - Agregados headers para MIME types
- ✅ `vite.config.ts` - Mejorada configuración de build
- ✅ `src/lib/supabase.ts` - Auto-limpieza de la clave anónima
- ✅ `src/utils/test-supabase.ts` - Mejor debugging de Supabase
- ✅ `src/components/DevEnvStatus.tsx` - Botón de prueba de Supabase

## Notas Importantes

- El logo ahora es más simple y elegante
- Supabase maneja automáticamente espacios en blanco en la clave anónima
- Los errores que viste eran del sitio en producción, no del desarrollo local
- Después del despliegue, todos los warnings deberían desaparecer 