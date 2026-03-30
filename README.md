# Port Matilda Fire Company #15 Site

Static single-page site for GitHub Pages with fundraising-forward navigation, Facebook news integration, and responsive layout.

## Files

- `index.html`: main one-page site
- `css/style.css`: layout, typography, and responsive styles
- `js/main.js`: navigation, reveal effects, feed tabs, sticky donate bar, and fallback behavior

## Content already wired in

- Square donation and event checkout link: `https://square.link/u/k0PR4MgX`
- PayPal / Venmo / Card donation link: `https://www.paypal.com/donate?token=xFt5vBLs72k037fSFbLsDd54Y64MRWp4fBhscU1WorJLRHyMblU_mISb7NKZ-Qm8HNEHfE23y9j4nlmI`
- Facebook page: `https://www.facebook.com/PortMatildaFireCo/`
- Contact info from the live contact page:
  - `101 East Plank Road`
  - `P.O. Box 472`
  - `Port Matilda, PA 16870`
  - `(814) 692-4074`
  - `secretary@portmatildafire15.com`
  - `president@portmatildafire15.com`

## Images

Optional assets expected by the site:

- `images/badge.jpg`: department badge or logo for the header
- `images/station.jpg`: station or apparatus photo for the about section

Imported legacy assets from the old WordPress site are in `images/legacy/`:

- `smoke-detectors.jpg`
- `volunteer_banner-300x150.jpg`
- `FB_IMG_1529306091906-300x209.jpg`
- `imagesPMFC-logo-color.jpg`
- `KIMG0255.jpg`
- `KIMG0258.jpg`
- `KIMG0265.jpg`
- `IMG_20200209_102621304_HDR.jpg`
- `IMG_0593.jpeg`
- `IMG_0589.jpeg`
- `IMG_0626.jpeg`
- `IMG_0622.jpeg`

If either file is missing, the page still works.

## Transfer package

Run `./package-site.sh` from the repository root to create `portmatildafire15-site.zip`.

## Facebook feed setup

The site supports two modes:

1. Embedded Facebook Page Plugin
2. Fallback card linking directly to Facebook

If you do not want to create a Meta developer app yet, leave `YOUR_APP_ID` in place and the fallback card will be shown instead of the embed.

If you do want the embedded feed:

1. Create an app at `https://developers.facebook.com/apps/`
2. Copy the App ID
3. Replace `YOUR_APP_ID` in `index.html`
4. Add `portmatildafire15.com` to the allowed app domains in Meta app settings

## GitHub Pages deployment

1. Push this repository to GitHub.
2. In the repository settings, open Pages.
3. Set the source to the `main` branch and `/` root.
4. If using the custom domain `portmatildafire15.com`, add it in GitHub Pages settings.
5. Update DNS at the registrar to point to GitHub Pages.

## Customization

- Update event titles and dates directly in `index.html`
- Turn on the emergency banner by adding the `active` class to `#emergencyBanner`
- Replace the Google Maps embed when you have the exact preferred pin

