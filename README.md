# Barely Possible

Static landing page for the Barely Possible podcast.

## Local Preview

Run:

```bash
./scripts/serve
```

Then visit `http://localhost:8080`.

If `localhost` does not resolve correctly on your machine, use
`http://127.0.0.1:8080`.

To use another port:

```bash
PORT=8090 ./scripts/serve
```

## GitHub Pages

This repo is designed to work with GitHub Pages without a build step. Serve from
the repository root.

## PostHog

Analytics is wired through [`/posthog.js`](./posthog.js). Set the public PostHog
project key in that file and keep the host pointed at your PostHog region
(`https://us.i.posthog.com` for US cloud, `https://eu.i.posthog.com` for EU
cloud).
