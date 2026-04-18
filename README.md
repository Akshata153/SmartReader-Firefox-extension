# Smart Reading Tracker

Firefox extension that highlights reading content on hover and supports popup ON/OFF toggle.

Repository: https://github.com/Akshata153/SmartReader-Firefox-extension

## Features

- Persistent heading highlight (wine background, whitish-grey heading text)
- Persistent paragraph and span highlight (lavender background)
- Link text temporarily styled to black on hover
- Popup toggle to enable/disable extension behavior

## Permissions

- `storage`: saves ON/OFF state from popup

## Development

1. Install dependencies: `npm install`
2. Build content script: `npm run build`
3. Load [manifest.json](manifest.json) in Firefox via `about:debugging#/runtime/this-firefox`

## Project structure

- [src](src): TypeScript source
- [dist](dist): compiled content script output
- [icons](icons): extension icon assets (48/96/128)
- [popup.html](popup.html), [popup.css](popup.css), [popup.js](popup.js): popup UI

