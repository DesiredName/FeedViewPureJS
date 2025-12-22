## Intro

This app demonstrates the usage of modern (baseline) browser technologies that enable building an `Instagram`-like video feed experience.

The app leverages the following APIs and tools:

- **Proxy Object API** — to track and react to data changes
- **ECMAScript Modules** — to import and organize scripts
- **Media Source API** — to control and manage video playback
- **CSS Layers** and the `@initial-state` rule — for structured and maintainable CSS
- **Intersection Observer API** — to detect visibility and trigger lazy loading
- **Scroll Snap** CSS properties — to guide and enhance the scrolling experience
- **Web Components** — to build reusable, encapsulated UI elements

The app intentionally does **not** use:

- Modern JavaScript frameworks or libraries (0 production dependencies)
- CSS frameworks (though it mimics an atomic, Tailwind-like styling approach)
- Bundlers
- TypeScript types (relies on modern IDE support and intellisence)

## Deploy

> [!CAUTION]
>
> For local development, you are expected to place video files into the [public/videos](/public/videos) directory of this repository.
>
> For manual setup, tweak the [dev.config.js](/app/dev.config.js) file to configure a base CDN path and specify the video file names to be used.
>
> This configuration file is consumed by the [client/local](/app/packages/client/local.js) package to serve data for the video feed at dev-time.

> [!IMPOPRTANT]
>
> For local development, HTTPS is used, hence you need to have certifcates in [/cert](/cert/) folder
>
> To generate the certificate, use this code:
>
> ```bash
> openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
> ```
>
> Then put files to the [/cert](/cert/) folder

## Run

For development purposes, run:

```bash
npm install && npm start
```

This starts a local server powered by the excellent http-server package.

Alternatively, you can deploy the source files directly to any static hosting provider.
