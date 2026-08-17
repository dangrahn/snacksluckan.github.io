# snacksluckan.se

Marketing site for Snacksluckan – vending machines in western Skåne. Built with Astro 5 + Tailwind CSS v4, deployed to GitHub Pages.

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
npm run preview
```

## Deployment

Pushing to `main` triggers `.github/workflows/astro.yml`, which builds and deploys to GitHub Pages. One-time setup:

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Custom domain: `public/CNAME` contains `snacksluckan.se`. At the DNS registrar, point the apex to GitHub Pages (A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; optionally `www` CNAME → `dangrahn.github.io`), then enable **Enforce HTTPS** in the Pages settings. Until DNS is live the site serves at `https://dangrahn.github.io/snacksluckan.github.io/`.

## Lead form backend (Google Apps Script)

The form in `src/components/LeadForm.astro` posts JSON to a Google Apps Script web app. To activate it:

1. Go to [script.google.com](https://script.google.com), create a new project.
2. Paste in `apps-script/router.gs` and `apps-script/lead-form.gs` as two files.
3. Optional: create a Google Sheet for leads and set script property `SHEET_ID` (Project Settings → Script Properties).
4. Deploy → New deployment → **Web app**, execute as **Me**, access **Anyone**. Copy the `/exec` URL.
5. Paste the URL into `appsScriptUrl` in `src/site.config.ts`, commit and push.
6. Test: submit the form on the live site and confirm the e-mail arrives. A submission with the hidden `website` field filled should be silently dropped (spam honeypot).

Until `appsScriptUrl` is set, the form shows a fallback message pointing to `hej@snacksluckan.se`.

## Image placeholders

Real photos of branded machines on location should eventually replace the render — search for `TODO: replace with real photo` (hero, Så funkar det, Passar er?) and swap the image import in `src/components/MachineImage.astro`.
