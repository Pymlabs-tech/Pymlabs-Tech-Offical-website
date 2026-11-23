# Deploying the PYMLABS website to ProFreeHost (`/htdocs`)

The website is a **static site**. The production files are plain HTML, CSS, JavaScript and images, so
the hosting server does **not** need Node.js, PHP or a database.

Every page is pre-rendered to its own folder (`about/index.html`, `services/index.html`, …). Direct
links and page refreshes therefore work on basic shared hosting **without any rewrite rules**.

---

## 1. Get the deployment ZIP

Either use the ready-made file:

```
D:\pymlabs-website\release\pymlabs-website-htdocs.zip
```

or rebuild it after making changes (see section 4):

```powershell
cd D:\pymlabs-website
npm install        # first time only
npm run package    # type-checks, builds, pre-renders and creates the ZIP
```

The ZIP contains the **contents** of `dist/`. `index.html` sits directly at the ZIP root, next to the
`about/`, `services/`, `assets/` and other folders. It contains no source code, `node_modules`,
source maps or `.env` files.

## 2. Upload to `/htdocs` with the VistaPanel File Manager

1. Log in to the ProFreeHost client area and open **Control Panel (VistaPanel)**.
2. Open **Online File Manager** (MonstaFTP).
3. Open the **`htdocs`** folder for `pymlabs.unaux.com`.
4. **Back up what is there now**: select everything inside `htdocs` and download it, or move it into a
   folder named `old-site-YYYY-MM-DD` outside `htdocs`.
5. Delete the old files inside `htdocs`. Keep the folder itself. If there is a default `index2.html`
   or a host placeholder page, remove it too.
6. Click **Upload** and upload `pymlabs-website-htdocs.zip` into `htdocs`.
7. Right-click the ZIP and choose **Extract**. Extract into the **current folder** (`/htdocs`), not into
   a new subfolder.
8. Check that `htdocs` now contains `index.html`, `404.html`, `.htaccess`, `sitemap.xml`,
   `robots.txt`, `site.webmanifest`, the icon files, and the folders `assets`, `brand`,
   `about`, `services`, `solutions`, `portfolio`, `contact`, `privacy-policy` and
   `terms-and-conditions`.
   - If you see a single folder such as `htdocs/pymlabs-website-htdocs/`, the archive was extracted
     into a subfolder. Move its contents up into `htdocs`.
   - `.htaccess` starts with a dot and some file managers hide it. Enable "show hidden files" to check.
9. Delete the ZIP from `htdocs`.

**If the File Manager cannot extract ZIPs**, upload the contents of `D:\pymlabs-website\dist\` with an
FTP client such as FileZilla instead. The FTP details are in VistaPanel under **FTP Accounts**. Upload
everything *inside* `dist` into `/htdocs`, including `.htaccess`.

## 3. Check the live site

Open each of these in a private/incognito window:

- https://pymlabs.unaux.com/
- https://pymlabs.unaux.com/about/
- https://pymlabs.unaux.com/services/  (then press refresh: it must reload the same page)
- https://pymlabs.unaux.com/services/#ai-automation  (should scroll to that service)
- https://pymlabs.unaux.com/solutions/
- https://pymlabs.unaux.com/portfolio/
- https://pymlabs.unaux.com/contact/  (fill in the form: your email app should open with the enquiry)
- https://pymlabs.unaux.com/privacy-policy/ and /terms-and-conditions/
- https://pymlabs.unaux.com/about  (no trailing slash: should redirect to `/about/`)
- https://pymlabs.unaux.com/this-does-not-exist/  (should show the PYMLABS "page does not exist" page)
- https://pymlabs.unaux.com/sitemap.xml and /robots.txt

If the 404 test shows the host's own error page instead of the PYMLABS one, the host is ignoring
`.htaccess` `ErrorDocument`. Nothing else is affected.

If any page looks unstyled, the `assets` folder is missing or in the wrong place. It must be at
`/htdocs/assets/`.

## 4. Changing content and rebuilding

| What | Where |
| --- | --- |
| Domain (canonical URLs, sitemap, Open Graph) | `.env`: `VITE_SITE_URL=https://your-domain` (copy `.env.example` to `.env`) |
| Contact email, founder, social links | `src/config/site.ts` |
| Services text | `src/data/services.ts` |
| Solutions text | `src/data/solutions.ts` |
| Portfolio projects | `src/data/projects.ts` (instructions and an example are at the top of the file) |
| Page titles and meta descriptions | `src/data/routes.ts` |
| Logo files | `public/brand/` (made from `brand-source/pymlabs-logo-original.png`) |

Then run `npm run package` and upload the new ZIP as in section 2.

To preview locally before uploading:

```powershell
npm run dev                  # development server with hot reload: http://localhost:5173
npm run build
node scripts/serve.mjs       # serves dist/ like Apache shared hosting: http://localhost:4173
```

## 5. Moving to a custom domain later

1. Add the domain to the hosting account and point its DNS as the host instructs.
2. Create `.env` with `VITE_SITE_URL=https://www.your-domain.com`.
3. Run `npm run package` and upload the new ZIP to the new domain's `htdocs`.
4. Optionally keep the old site up with a redirect. Add this to the **old** site's `.htaccess`:
   ```
   RewriteEngine On
   RewriteRule ^(.*)$ https://www.your-domain.com/$1 [R=301,L]
   ```
5. Submit the new `sitemap.xml` in Google Search Console.

## 6. Connecting a real form service (optional)

Out of the box the contact form does **not** send anything by itself. It opens the visitor's email app
with the enquiry written out and addressed to info.pymlabs@gmail.com, and it says clearly that the
message is sent only when they press Send.

To receive enquiries directly from the form:

1. Create a form endpoint with a static-site form service (for example Formspree, Getform or
   Web3Forms) that accepts JSON `POST` requests. Your own script also works.
2. Put the endpoint URL in `.env`: `VITE_FORM_ENDPOINT=https://…`
3. Rebuild and upload. The form then shows "Sending…", reports success **only** when the service
   answers with HTTP 2xx, and shows an error with an email fallback otherwise.

Free iFastNet-based hosting usually disables PHP `mail()`, so a PHP mail script on this host is not
recommended.

## Do not upload

`node_modules/`, `src/`, `scripts/`, `tools/`, `brand-source/`, `.env`, `package.json` or any other
project file. Only the contents of `dist/` (the ZIP) belong in `/htdocs`.
