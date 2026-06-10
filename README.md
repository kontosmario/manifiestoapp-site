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
├── privacy.html     # Política de Privacidad
├── terms.html       # Términos y Condiciones
├── styles.css       # CSS único (forest-deep theme, mobile-first)
├── _redirects       # Cloudflare Pages → /privacy → /privacy.html
├── .gitignore
└── README.md
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
