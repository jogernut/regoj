# Regoj.com

Marketing site for Regoj — tech consulting across AI automation, web/app development, networking & VoIP, and technical consulting.

## Local preview

Open `index.html` in a browser, or from this folder:

```bash
npx --yes serve .
```

## Deploy on Netlify

1. Push this repo to GitHub (or connect the remote Netlify supports).
2. In Netlify: **Add new site → Import an existing project**.
3. Build settings: leave build command empty; publish directory = `.` (or use `netlify.toml`).
4. After deploy, point `regoj.com` at Netlify.

### Cloudflare DNS (name servers already on Cloudflare)

In Cloudflare DNS for `regoj.com`, add records Netlify shows after you add a custom domain, typically:

- `A` or `CNAME` for apex (`@`) → Netlify load balancer / site address
- `CNAME` for `www` → your Netlify site hostname

Use **DNS only** (grey cloud) or follow Netlify’s Cloudflare guide if you proxy through Cloudflare. SSL is handled by Netlify once DNS propagates.

Contact form submissions use [Netlify Forms](https://docs.netlify.com/forms/setup/) (`name="contact"`).
