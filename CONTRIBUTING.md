# Colaborar con ShiftNova

Las contribuciones deben conservar estas garantías:

- un sitio sin perfil permanece intacto;
- hostname y ruta se normalizan antes de comparar;
- los colores funcionales y el contenido gráfico no se reemplazan;
- no se agregan servicios externos distintos de GitHub;
- ninguna prueba visual crea ni modifica registros de SIARH.

## Preparación

```bash
npm ci
npm run test:unit -- --runInBand
npm run lint
npm run build:dist
```

Incluye pruebas unitarias cuando cambies perfiles, validación, paletas, apariencia o actualizaciones. Para cambios visuales, valida al menos la página de inicio y los módulos de Embargos indicados en el README.

Los pull requests deben explicar el entorno afectado, cómo se verificó y si cambia el esquema exportado. No incluyas secretos de AMO, datos reales del sistema ni paquetes generados.
