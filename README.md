# snacksluckan.se

Marketing site for Snacksluckan – vending machines in southern Sweden (Skåne, Halland, Blekinge). Built with Astro 5 + Tailwind CSS v4, deployed to GitHub Pages.

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
npm run preview
```

## Deployment

Pushing to `main` triggers `.github/workflows/astro.yml`, which builds and deploys to GitHub Pages. Until the custom domain is activated, the site serves at `https://danielgrahn.com/snacksluckan.github.io/`.

Activating snacksluckan.se (one-time):

1. At the DNS registrar, point the apex to GitHub Pages: A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (optionally `www` CNAME → `dangrahn.github.io`).
2. Once DNS resolves, set **Settings → Pages → Custom domain** to `snacksluckan.se` and enable **Enforce HTTPS**. Note: with workflow-based builds the `public/CNAME` file alone does not register the domain — it must be set in the Pages settings (kept in the repo for consistency).

## Lead form backend (Google Apps Script)

The form in `src/components/LeadForm.astro` posts JSON to a Google Apps Script web app. To activate it:

1. Go to [script.google.com](https://script.google.com), create a new project.
2. Paste in `apps-script/router.gs` and `apps-script/lead-form.gs` as two files.
3. Optional: create a Google Sheet for leads and set script property `SHEET_ID` (Project Settings → Script Properties).
4. Deploy → New deployment → **Web app**, execute as **Me**, access **Anyone**. Copy the `/exec` URL.
5. Paste the URL into `appsScriptUrl` in `src/site.config.ts`, commit and push.
6. Test: submit the form on the live site and confirm the e-mail arrives. A submission with the hidden `website` field filled should be silently dropped (spam honeypot).

Until `appsScriptUrl` is set, the form shows a fallback message pointing to `hej@snacksluckan.se`.

## Logo assets

`src/assets/logo.png` is the canonical logo artwork. `node scripts/derive-logo-assets.mjs` regenerates the derived assets from it: `src/assets/logo-lucka.png` (transparent lucka mark for header/footer — the full burst is illegible that small), `public/favicon.png` and `public/apple-touch-icon.png`.

## Images

The page uses exactly two images: the hero banner (`src/assets/hero.png`, full-width in `Hero.astro`) and the secondary product image (`src/assets/machine.png`, shown in Så funkar det via `src/components/MachineImage.astro`). A real photo of a branded machine on location can eventually replace the secondary render — swap the import in `MachineImage.astro`.
