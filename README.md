<p align="center">
  <img src="src/icons/shiftnova_128.png" width="112" alt="ShiftNova" />
</p>

<h1 align="center">ShiftNova</h1>

<p align="center">
  Identidad visual por entorno para los sistemas web de Formosa, con paletas semánticas y modo oscuro dinámico.
</p>

ShiftNova es una extensión para Chrome, Edge, Opera y Firefox que reconoce un entorno por su dominio y prefijo de ruta. Cada perfil puede usar una paleta clara, modo oscuro, el esquema del sistema o un horario. Los sitios sin un perfil habilitado permanecen intactos.

El motor de modo oscuro deriva de Dark Reader 4.9.133. La interfaz, el modelo de perfiles, la capa visual SIARH y el canal de actualizaciones son propios de ShiftNova.

## Funciones principales

- Perfiles por `hostname` y prefijo de ruta; gana la coincidencia más específica.
- Paleta semántica con color base y anulaciones para cabecera, árbol lateral, lienzo, paneles y acento.
- Modos claro, oscuro, sistema y horario por perfil.
- Brillo, contraste, sepia y escala de grises para el motor oscuro dinámico.
- Editor completo dentro del popup, con duplicación, orden, importación y exportación JSON.
- Estilos específicos para cabecera, árbol, pestañas, FlexGrid, FlexForm, filtros, modales y campos de SIARH.
- Comprobación de versiones mediante `danysers.github.io/ShiftNova`.

> [!IMPORTANT]
> ShiftNova aplica estilos sólo cuando encuentra un perfil habilitado. No modifica datos de SIARH ni realiza altas, bajas o cambios de registros.

## Perfiles incluidos

| Entorno | URL | Color base |
| --- | --- | --- |
| SIGAPP Producción | `sigapp.formosa.gob.ar/` | `#F5F5F5` |
| SIARH Prueba | `pruebasiarh.formosa.gob.ar/` | `#C5D6FF` |
| SIARH Prueba v3 | `pruebasiarhv3.formosa.gob.ar/` | `#C5D6FF` |
| IDE | `ide.formosa.gob.ar/` | `#F5F5F5` |
| SIGAPP Desarrollo | `desasigappv2.formosa.gob.ar/` | `#FFFFC5` |

## Desarrollo

Requisitos: Node.js 24 y npm 11 o compatibles.

```bash
npm ci
npm run test:unit -- --runInBand
npm run lint
npm run build:dist
```

Los paquetes sin comprimir quedan en:

- `build/release/chrome-mv3` para Chrome, Edge y Opera.
- `build/release/firefox` para Firefox y Firefox Developer Edition.

Para desarrollo rápido de Chromium:

```bash
npm run debug:watch:mv3
```

Luego se carga `build/debug/chrome-mv3` desde la página de extensiones con el modo desarrollador habilitado.

## Instalación manual

### Chrome, Edge y Opera

1. Descarga el ZIP de Chromium desde la release y descomprímelo.
2. Abre la página de extensiones del navegador y activa el modo desarrollador.
3. Selecciona **Cargar descomprimida** y elige la carpeta extraída.
4. Para actualizar, reemplaza los archivos y pulsa **Recargar**.

### Firefox

Instala el XPI firmado publicado en la release. Firefox normal utiliza el manifiesto de actualización alojado en GitHub Pages; Firefox Developer Edition también puede cargar temporalmente la compilación local desde `about:debugging`.

## Publicación

Cada `push` y pull request ejecuta pruebas, lint y builds. Una etiqueta `vX.Y.Z`:

1. comprueba que la etiqueta coincida con `package.json`;
2. construye Chromium y Firefox;
3. firma el XPI como distribución no listada con `WEB_EXT_API_KEY` y `WEB_EXT_API_SECRET`;
4. publica ZIP, XPI y `SHA256SUMS.txt` en GitHub Releases;
5. despliega `latest.json` y `updates.json` en GitHub Pages.

> [!NOTE]
> Los secretos de AMO se configuran una sola vez en GitHub Actions y nunca se guardan en el repositorio.

## Estructura relevante

```text
src/shiftnova/          Perfiles, validación, paletas, CSS y actualizaciones
src/inject/shiftnova.ts Capa semántica aplicada a cada página
src/ui/popup/           Interfaz completa de ShiftNova
tests/unit/shiftnova/   Pruebas del dominio propio
.github/workflows/      CI, firma y publicación
```

El código original de Dark Reader conserva su aviso MIT en `LICENSE` y su historial de atribución. Las modificaciones de ShiftNova se mantienen en este repositorio.
