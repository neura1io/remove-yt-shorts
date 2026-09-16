# Remove YouTube Shorts

A small Chrome extension that hides Shorts shelves, individual Shorts cards,
sidebar links, and channel Shorts tabs on YouTube. Direct Shorts video links
open in the regular video player; the Shorts feed redirects to the home page.

## Install

First, download this repository using **Code → Download ZIP** and extract it,
or clone it with Git.

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked** and select this folder (`remove-yt-shorts`).
4. Refresh any YouTube tabs that were already open.

The extension stays active until you disable or remove it on the extensions page.
After editing its files, click **Reload** on that page and refresh YouTube.

## Privacy

Runs only on `youtube.com`, `www.youtube.com`, and `m.youtube.com` over HTTPS.
No analytics, remote code, network requests, account access, or stored data.
No background service or additional API permissions are required.

## How it works

Chrome injects `hide-shorts.css` and `content.js` at document start.
CSS hides Shorts, including content added while scrolling and cards reused by
YouTube. The script handles direct links, YouTube navigation, and browser history.
The extension uses Chrome's Manifest V3 and requires Chrome 105 or later.

YouTube changes its markup regularly. If a new layout exposes Shorts, update
the selectors in `hide-shorts.css`. Videos presented solely as regular `/watch`
links cannot be identified as Shorts by this extension.

## Check

Run `node --test tests/redirect.test.cjs` for routing checks.
For a manual smoke test, check the home page, search results, subscriptions,
a channel, and video recommendations. Scroll to load more results, navigate
between pages, and confirm normal videos remain visible. Open a `/shorts/VIDEO_ID`
link directly and confirm it becomes `/watch?v=VIDEO_ID`.
