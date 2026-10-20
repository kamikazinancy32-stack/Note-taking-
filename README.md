# Notes — DOM & Browser APIs project

A note-taking app built with plain HTML, CSS and JavaScript (ES6 modules).
No backend: everything is stored in the browser.

## Run it

- **Recommended — VS Code:** install the "Live Server" extension → right-click `index.html` → *Open with Live Server*.
  The real ES modules in `js/` run.
- **Double-clicking `index.html` also works.** Browsers block ES modules on `file://` pages, so in that
  case only, `index.html` loads `js/app.bundle.js` — the same modules combined into one script.

`js/app.bundle.js` is generated. After changing anything in `js/`, run `npm install` once, then
`npm run build` to refresh it. (With Live Server you don't need it at all.)

## Folder structure

```
index.html            semantic markup + SVG icon sprite
css/tokens.css        colours, fonts, sizes from the Figma style guide + light/dark/font themes
css/base.css          reset, focus ring, skip link, visually-hidden helper
css/layout.css        mobile-first layout → desktop 4-column grid at 1088px
css/components.css    buttons, note cards, editor, modal, toast, settings
js/main.js            app state, event listeners, render()
js/storage.js         localStorage (notes, preferences) + sessionStorage (draft)
js/noteManager.js     Note class + create/update/delete/archive/search/filter
js/ui.js              all DOM creation and updates
js/themes.js          applyTheme / applyFont (classes on <html>)
js/validation.js      form rules (pure functions)
js/location.js        Geolocation API (bonus)
js/sampleNotes.js     the 10 notes from the Figma (7 active, 3 archived)
js/app.bundle.js      GENERATED copy of js/ for file:// — don't edit by hand
```

## Where each requirement lives

| Requirement | Where |
|---|---|
| Create / read / update / delete | `noteManager.js` + `handleNoteSubmit`, `handleDelete` in `main.js` |
| Dynamic DOM rendering | `renderNote`, `renderAllNotes`, `updateTagList` in `ui.js` |
| Event delegation | one `click` listener on `document` (`data-action`, `data-nav`, `data-tag`) and one on `#note-list` (`data-note-id`) — `bindEvents()` in `main.js` |
| Archive / tags / search | `toggleArchive`, `filterByTag`, `searchNotes` in `noteManager.js`; search highlight with `<mark>` in `ui.highlightText` |
| localStorage + quota errors | `storage.js` (`isQuotaError`), rollback in `noteManager.commit()` |
| sessionStorage drafts | `scheduleDraftSave`, `restoreDraft`, `discardDraft` in `main.js` |
| Geolocation (bonus) | `location.js` |
| Validation (blur + submit) | `validation.js`, `focusout` + `submit` listeners, `showValidationError` in `ui.js` |
| Themes & fonts | `themes.js`, `.theme-*` / `.font-*` classes in `tokens.css` |
| Keyboard | Enter / Ctrl+Enter save, Escape cancel/close, ↑ ↓ Home End in the list, `/` focuses search |
| Bonus | dark-mode auto-detect ("System"), JSON export/import, cross-tab sync |
