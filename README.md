# manifiestoapp-site

Sitio público de [Manifiesto](https://manifiestoapp.com) — landing minimal + Privacy Policy + Terms of Service.

## Stack

- HTML/CSS estático, sin build step.
- Hosting: **Cloudflare Pages** con custom domain `manifiestoapp.com`.
- DNS gestionado en Cloudflare (mismo dashboard que Pages → setup automático).

## Estructura

```
.
├── index.html       # Landing
├── privacy/         # Política de Privacidad
├── terms/           # Términos y Condiciones
├── styles.css       # CSS único (forest-deep theme, mobile-first)
├── _redirects       # Cloudflare Pages → /privacy → /privacy/
├── _headers         # Content-Type para los Universal Link manifests
├── .well-known/     # Universal Links (iOS) + App Links (Android)
│   ├── apple-app-site-association
│   └── assetlinks.json
├── .gitignore
└── README.md
```

## Universal Links / App Links

Los archivos en `.well-known/` permiten que la app móvil intercepte URLs `https://manifiestoapp.com/auth/*` directamente (sin el chooser dialog), cerrando el vector de scheme hijacking en `manifiesto://` documentado en Sprint P · P-1 del repo principal.

- **`apple-app-site-association`** (iOS): bind a `ZKYQF7UNYA.com.manifiesto.mobile.ZKYQF7UNYA`, paths `/auth/*`
- **`assetlinks.json`** (Android): bind a `com.manifiesto.mobile.ZKYQF7UNYA` — actualmente con SHA256 fingerprint PLACEHOLDER. **Antes del Android launch**, reemplazar con el fingerprint real del Play Console (App signing key certificate fingerprints → SHA-256).
- **`_headers`**: fuerza `Content-Type: application/json` (Apple lo exige; los archivos sin extensión confunden el content-sniffing default de Cloudflare).

Para validar el setup en producción:
```bash
# AASA — debe responder application/json sin redirect
curl -I https://manifiestoapp.com/.well-known/apple-app-site-association

# assetlinks (Android) — mismo
curl -I https://manifiestoapp.com/.well-known/assetlinks.json
```

## Deploy

Cada push a `main` dispara un deploy automático en Cloudflare Pages (~30 segundos). No hay CI/CD adicional ni build step.

```bash
git add .
git commit -m "docs(legal): actualizar privacy con XYZ"
git push origin main
```

## Actualizar el contenido legal

1. Editar `privacy.html` o `terms.html`.
2. Bumpear la fecha y la versión en el `<p class="meta">` del header.
3. Commit + push.
4. Si el cambio es **material** (no cosmético):
   - Avisar dentro de la app mobile (in-app notice).
   - Considerar requerir aceptación expresa del user antes de seguir usando.

## Repo de la app

El código de la app móvil vive en [kontosmario/manifiesto](https://github.com/kontosmario/manifiesto) (privado).

Las URLs de este sitio se referencian desde `mobile/lib/legal-urls.ts` en ese repo.
