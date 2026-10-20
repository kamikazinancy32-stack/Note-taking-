# Notes

A simple, fast note-taking app that runs entirely in your browser. Write notes, organise them with
tags, archive the ones you're done with, and find anything in seconds with search. No account, no
server, no installation required.

## Features

- **Create, edit and delete notes**, each with a title, tags and content.
- **Tags** to group related notes. Click a tag to see only the notes that use it.
- **Search** across titles, tags and content, with matches highlighted.
- **Archive** notes to keep them out of the way without deleting them, and restore them any time.
- **Auto-saved drafts.** If you accidentally reload the page while editing, your unsaved changes
  are restored.
- **Location (optional).** Attach your current location to a note.
- **Colour themes:** Light, Dark, or System (follows your device's setting).
- **Font themes:** Sans-serif, Serif or Monospace.
- **Backup & restore.** Download your notes as a `.json` file and load them back later, or on
  another browser or computer.
- **Sync between tabs.** Changes made in one tab appear in your other open tabs.
- **Works on any screen size**, from phones to large desktops.
- **Keyboard friendly and accessible.**

## Getting started

1. Download or clone this repository:
   ```
   git clone https://github.com/kamikazinancy32-stack/Note-taking-.git
   ```
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox or Safari).

That's it. The app opens with a few sample notes so you can try it out. To clear them and start
fresh, delete them, or use **Settings → Backup & Restore** to manage your notes.

> **Tip:** If you use VS Code, you can also run the app with the
> [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension:
> right-click `index.html` and choose **Open with Live Server**.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `/` | Jump to search |
| `Ctrl` + `Enter` (`⌘` + `Enter` on Mac) | Save the note you're editing |
| `Enter` | Save (when in the title field) |
| `Esc` | Cancel editing or close a dialog |
| `↑` / `↓` | Move between notes in the list |
| `Home` / `End` | Jump to the first or last note |

## Your data and privacy

Your notes are stored **only in your browser** (using `localStorage`). They are never uploaded
anywhere. This also means:

- Clearing your browser data will delete your notes.
- Notes don't automatically move between browsers or devices.

To keep your notes safe or move them somewhere else, use **Settings → Backup & Restore →
Download notes (.json)**, then **Load notes from file** wherever you want them.

Location is only requested when you click **Add my location** on a note, and your browser will ask
for your permission first.

## For developers

The app is built with plain HTML, CSS and JavaScript (ES modules), with no frameworks.

```
index.html            page markup and icons
css/                  design tokens, base styles, layout and components
js/main.js            app start-up, state and event handling
js/noteManager.js     note logic: create, update, delete, archive, search, filter
js/ui.js              rendering and DOM updates
js/storage.js         saving notes, preferences and drafts
js/themes.js          colour and font themes
js/validation.js      form validation
js/location.js        geolocation
js/sampleNotes.js     the sample notes shown on first launch
js/app.bundle.js      generated bundle, do not edit by hand
```

Browsers don't allow ES modules on pages opened straight from disk (`file://`), so in that case
`index.html` loads `js/app.bundle.js`, which contains all the modules combined into one file. If
you change anything in `js/`, rebuild the bundle:

```
npm install
npm run build
```

With Live Server (or any local web server) the modules load directly and no build is needed.
