/**
 * ui.js
 * ----------------------------------------------------------------------------
 * Everything that reads or changes the page lives here. Functions receive
 * plain data (notes, tags, messages) and update the DOM — they never decide
 * WHAT should happen; main.js does that.
 *
 * Elements are built with document.createElement + textContent (never
 * innerHTML with user text), so a note titled "<img onerror=…>" is shown as
 * text instead of being run as HTML.
 */

import { describeLocation } from './location.js';

/* ---------------------------------------------------------------------------
   Element lookups (done once; modules run after the HTML is parsed)
--------------------------------------------------------------------------- */

const byId = (id) => document.getElementById(id);

const dom = {
  app: byId('app'),
  pageTitle: byId('page-title'),
  notesView: byId('notes-view'),
  settingsView: byId('settings-view'),

  noteList: byId('note-list'),
  emptyState: byId('empty-state'),
  listIntro: byId('list-intro'),
  sidebarTags: byId('sidebar-tags'),
  mobileTags: byId('mobile-tags'),

  editorPane: byId('editor-pane'),
  actionsPane: byId('actions-pane'),
  editorPlaceholder: byId('editor-placeholder'),
  form: byId('note-form'),
  titleInput: byId('note-title'),
  tagsInput: byId('note-tags'),
  contentInput: byId('note-content'),
  editedText: byId('note-edited'),
  statusRow: byId('note-status-row'),
  locationText: byId('note-location'),
  locationButton: byId('location-button'),
  removeLocationButton: byId('remove-location-button'),
  draftStatus: byId('draft-status'),

  dialog: byId('confirm-dialog'),
  dialogTitle: byId('confirm-title'),
  dialogMessage: byId('confirm-message'),
  dialogIcon: byId('confirm-icon'),
  dialogConfirm: byId('confirm-ok'),
  dialogCancel: byId('confirm-cancel'),

  toastRegion: byId('toast-region'),
  announcer: byId('announcer'),
};

/** Form fields that can show a validation error. */
const fields = {
  title: dom.titleInput,
  tags: dom.tagsInput,
};

/* ---------------------------------------------------------------------------
   Small helpers
--------------------------------------------------------------------------- */

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/**
 * "2024-10-29T10:12:00Z" → "29 Oct 2024" (day-month-year, like the design).
 * formatToParts lets us pick the pieces and put them in our own order.
 */
export function formatDate(iso) {
  const parts = Object.fromEntries(
    dateFormatter.formatToParts(new Date(iso)).map(({ type, value }) => [type, value]),
  );
  return `${parts.day} ${parts.month} ${parts.year}`;
}

/** createElement with a class and text in one line. */
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

/** Builds <svg class="icon"><use href="#icon-name"></use></svg>. */
function createIcon(name) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(svgNS, 'use');
  use.setAttribute('href', `#icon-${name}`);
  svg.append(use);
  return svg;
}

/** Escapes characters that have special meaning in a regular expression. */
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Wraps every match of `query` in <mark>, using text nodes only (safe).
 * highlightText("React hooks", "hook") → "React " <mark>hook</mark> "s"
 */
export function highlightText(text, query) {
  const fragment = document.createDocumentFragment();
  const needle = query?.trim();

  if (!needle) {
    fragment.append(text);
    return fragment;
  }

  // Splitting with a capture group keeps the matches in the result array.
  text.split(new RegExp(`(${escapeRegExp(needle)})`, 'gi')).forEach((part) => {
    if (!part) return;
    fragment.append(part.toLowerCase() === needle.toLowerCase() ? createElement('mark', '', part) : part);
  });
  return fragment;
}

/** ~90 characters around the first match, so search results show WHY they matched. */
function contentSnippet(content, query) {
  const index = content.toLowerCase().indexOf(query.trim().toLowerCase());
  if (index === -1) return '';
  const start = Math.max(0, index - 30);
  const end = Math.min(content.length, index + 60);
  return `${start > 0 ? '…' : ''}${content.slice(start, end).replace(/\s+/g, ' ')}${end < content.length ? '…' : ''}`;
}

/* ---------------------------------------------------------------------------
   Note list
--------------------------------------------------------------------------- */

/**
 * Builds one note card.
 *   <li class="note-card">
 *     <button data-note-id="…" aria-current="true"> title · tags · date </button>
 *   </li>
 * The data-note-id is how the single delegated click listener knows which note was picked.
 */
export function renderNote(note, { isSelected = false, query = '', showStatus = true } = {}) {
  const item = createElement('li', 'note-card');
  item.classList.toggle('note-card--archived', note.archived);

  const button = createElement('button', 'note-card__button');
  button.type = 'button';
  button.dataset.noteId = note.id;
  if (isSelected) button.setAttribute('aria-current', 'true');

  // Only <span>s inside the button: buttons may not contain headings or lists.
  const title = createElement('span', 'note-card__title');
  title.append(highlightText(note.title, query));
  button.append(title);

  // In search results, show the matching sentence when the match is in the body.
  const snippet = query ? contentSnippet(note.content, query) : '';
  if (snippet && !note.title.toLowerCase().includes(query.trim().toLowerCase())) {
    const snippetElement = createElement('span', 'note-card__snippet');
    snippetElement.append(highlightText(snippet, query));
    button.append(snippetElement);
  }

  // "Archived" label: useful in mixed lists (search, tags), redundant on the Archived page.
  const showArchivedChip = note.archived && showStatus;

  if (note.tags.length > 0 || showArchivedChip) {
    const chips = createElement('span', 'chip-list');
    note.tags.forEach((tag) => {
      const chip = createElement('span', 'chip');
      chip.append(highlightText(tag, query));
      chips.append(chip);
    });
    if (showArchivedChip) chips.append(createElement('span', 'chip chip--status', 'Archived'));
    button.append(chips);
  }

  const meta = createElement('span', 'note-card__meta');
  const time = createElement('time', '', formatDate(note.updatedAt));
  time.dateTime = note.updatedAt;
  meta.append(time);

  if (note.location) {
    const place = createElement('span', 'note-card__location');
    place.append(createIcon('pin'), describeLocation(note.location));
    meta.append(place);
  }
  button.append(meta);

  item.append(button);
  return item;
}

/** The temporary "Untitled Note" card shown while a new note is being written. */
function renderDraftCard(title) {
  const item = createElement('li', 'note-card note-card--draft');
  const button = createElement('button', 'note-card__button');
  button.type = 'button';
  button.dataset.noteId = 'new';
  button.setAttribute('aria-current', 'true');
  button.append(createElement('span', 'note-card__title', title.trim() || 'Untitled Note'));
  item.append(button);
  return item;
}

/** Keeps the draft card's title in sync with what is typed in the title field. */
export function updateDraftCardTitle(title) {
  const draftTitle = dom.noteList.querySelector('.note-card--draft .note-card__title');
  if (draftTitle) draftTitle.textContent = title.trim() || 'Untitled Note';
}

/**
 * Replaces the whole list. A DocumentFragment is used so the browser only
 * re-lays out the page once, not once per note.
 */
export function renderAllNotes(notes, { selectedId = null, query = '', draftTitle = null, emptyMessage = null, showStatus = true } = {}) {
  const fragment = document.createDocumentFragment();

  if (draftTitle !== null) fragment.append(renderDraftCard(draftTitle));
  notes.forEach((note) => fragment.append(renderNote(note, { isSelected: note.id === selectedId, query, showStatus })));

  dom.noteList.replaceChildren(fragment);

  const isEmpty = notes.length === 0 && draftTitle === null;
  renderEmptyState(isEmpty ? emptyMessage : null);
}

/**
 * @param {{ text: string, action?: string, after?: string } | null} message
 *        `action` becomes an inline "create a new note" button.
 */
function renderEmptyState(message) {
  dom.emptyState.hidden = !message;
  if (!message) return;

  const paragraph = createElement('p', '', message.text);
  if (message.action) {
    const button = createElement('button', 'link-button', message.action);
    button.type = 'button';
    button.dataset.action = 'new-note';
    paragraph.append(button, message.after ?? '');
  }
  dom.emptyState.replaceChildren(paragraph);
}

/** Moves keyboard focus to a note card (used after arrow keys, delete, etc.). */
export function focusNoteCard(id) {
  const card = id
    ? dom.noteList.querySelector(`[data-note-id="${CSS.escape(id)}"]`)
    : dom.noteList.querySelector('[data-note-id]');
  card?.focus();
  return Boolean(card);
}

/* ---------------------------------------------------------------------------
   Tags (sidebar on desktop, "Tags" tab on mobile)
--------------------------------------------------------------------------- */

export function updateTagList(tags, activeTag = null) {
  const build = () => {
    const fragment = document.createDocumentFragment();
    tags.forEach((tag) => {
      const item = createElement('li');
      const button = createElement('button', 'nav-item');
      button.type = 'button';
      button.dataset.tag = tag;
      if (tag === activeTag) button.setAttribute('aria-current', 'page');

      const chevron = createIcon('chevron-right');
      chevron.classList.add('nav-item__chevron');
      button.append(createIcon('tag'), createElement('span', '', tag), chevron);
      item.append(button);
      fragment.append(item);
    });
    return fragment;
  };

  dom.sidebarTags.replaceChildren(build());
  dom.mobileTags.replaceChildren(build());

  if (tags.length === 0) {
    dom.mobileTags.replaceChildren(createElement('li', 'list-pane__intro', 'Tags you add to notes will appear here.'));
  }
}

/* ---------------------------------------------------------------------------
   Page title, intro text, view + screen switching
--------------------------------------------------------------------------- */

const VIEW_TITLES = {
  all: 'All Notes',
  archived: 'Archived Notes',
  tags: 'Tags',
  settings: 'Settings',
};

/** Updates the <h1> and the sentence under the "Create" button for each view. */
export function renderHeader({ view, tag, query }) {
  const title = dom.pageTitle;
  const intro = dom.listIntro;
  let introText = '';

  if (view === 'tag') {
    title.replaceChildren(createElement('span', 'page-title__muted', 'Notes Tagged: '), tag);
    introText = `All notes with the “${tag}” tag are shown here.`;
  } else if (view === 'search' && query) {
    title.replaceChildren(createElement('span', 'page-title__muted', 'Showing results for: '), query);
    introText = `All notes matching “${query}” are displayed below.`;
  } else if (view === 'search') {
    title.textContent = 'Search';
    introText = 'Search by title, content, or tags.';
  } else {
    title.textContent = VIEW_TITLES[view];
    if (view === 'archived') {
      introText = 'All your archived notes are stored here. You can restore or delete them anytime.';
    }
  }

  intro.textContent = introText;
  intro.hidden = !introText;
  document.title = `${title.textContent} · Notes`;
}

/** Adds/removes the archive-view class so CSS and the actions reflect it. */
export function toggleArchiveView(isArchiveView) {
  dom.app.classList.toggle('is-archive-view', isArchiveView);
}

/**
 * Shows the right big region and marks the matching navigation buttons with
 * aria-current, which both styles them and tells screen readers "you are here".
 */
export function setView(view, activeTag = null) {
  dom.app.dataset.view = view;
  dom.notesView.hidden = view === 'settings';
  dom.settingsView.hidden = view !== 'settings';

  const isTagsTab = view === 'tags';
  dom.mobileTags.hidden = !isTagsTab;
  dom.noteList.hidden = isTagsTab;
  if (isTagsTab) dom.emptyState.hidden = true;

  document.querySelectorAll('[data-nav]').forEach((button) => {
    // A selected tag still counts as being inside "Tags" on the mobile tab bar.
    const isCurrent = button.dataset.nav === view || (view === 'tag' && button.dataset.nav === 'tags');
    if (isCurrent) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });

  document.querySelectorAll('[data-tag]').forEach((button) => {
    if (view === 'tag' && button.dataset.tag === activeTag) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
}

/** Mobile/tablet only: show the list ('list') or the open note/panel ('detail'). */
export function setScreen(screen) {
  dom.app.dataset.screen = screen;
  fitTitleHeight(); // the editor may have just become visible
}

export const focusPageTitle = () => dom.pageTitle.focus();

/* ---------------------------------------------------------------------------
   Editor
--------------------------------------------------------------------------- */

/**
 * Fills the form with a note (or empties it for a new note).
 * @param {object|null} note   saved note, or null when creating
 * @param {object} [values]    unsaved draft values that override the note's
 */
export function fillEditor(note, values = {}) {
  const location = 'location' in values ? values.location : note?.location ?? null;

  dom.titleInput.value = values.title ?? note?.title ?? '';
  dom.tagsInput.value = values.tags ?? note?.tags.join(', ') ?? '';
  dom.contentInput.value = values.content ?? note?.content ?? '';
  fitTitleHeight();

  dom.editedText.textContent = note ? formatDate(note.updatedAt) : 'Not yet saved';
  dom.statusRow.hidden = !note?.archived;
  renderLocation(location);

  // The panes carry the note id so delegated click handlers can find it.
  const noteId = note?.id ?? 'new';
  dom.editorPane.dataset.noteId = noteId;
  dom.actionsPane.dataset.noteId = noteId;
  updateNoteActions(note);

  Object.keys(fields).forEach(clearValidationError);
  setDraftStatus('');
}

/** Reads the form as plain strings. */
export const readEditor = () => ({
  title: dom.titleInput.value,
  tags: dom.tagsInput.value,
  content: dom.contentInput.value,
});

/** Hides the form when there is nothing to show (e.g. no notes at all). */
export function showEditorPlaceholder(isVisible) {
  dom.form.hidden = isVisible;
  dom.editorPlaceholder.hidden = !isVisible;
  dom.actionsPane.hidden = isVisible;
  dom.editorPane.querySelector('.mobile-toolbar__group').hidden = isVisible;
}

/** Archive ⇄ Restore label, and hide note-only actions while creating. */
function updateNoteActions(note) {
  const isArchived = Boolean(note?.archived);

  document.querySelectorAll('[data-requires-note]').forEach((button) => {
    button.hidden = !note;
  });

  document.querySelectorAll('[data-archive-button]').forEach((button) => {
    button.querySelector('use').setAttribute('href', isArchived ? '#icon-restore' : '#icon-archive');
    const label = button.querySelector('[data-archive-label]');
    if (label) label.textContent = isArchived ? 'Restore Note' : 'Archive Note';
    else button.setAttribute('aria-label', isArchived ? 'Restore note' : 'Archive note');
  });
}

export function renderLocation(location) {
  dom.locationText.textContent = location ? describeLocation(location) : 'Not added';
  dom.locationButton.textContent = location ? 'Update' : 'Add my location';
  dom.removeLocationButton.hidden = !location;
}

export function setLocationBusy(isBusy) {
  dom.locationButton.setAttribute('aria-busy', String(isBusy));
  dom.locationButton.setAttribute('aria-disabled', String(isBusy));
  if (isBusy) dom.locationText.textContent = 'Finding your location…';
}

export const focusTitleInput = () => dom.titleInput.focus();

const supportsFieldSizing = CSS.supports('field-sizing', 'content');

/**
 * Grows the title box to fit its text. Newer browsers do this with CSS
 * (`field-sizing: content`), so this only runs as a fallback elsewhere.
 */
export function fitTitleHeight() {
  if (supportsFieldSizing) return;
  const title = dom.titleInput;
  title.style.height = '';
  // A hidden editor (phone list screen) measures 0 — keep the default one-row height then.
  if (title.scrollHeight > 0) title.style.height = `${title.scrollHeight}px`;
}

export const setDraftStatus = (text) => { dom.draftStatus.textContent = text; };

/* ---------------------------------------------------------------------------
   Validation feedback
--------------------------------------------------------------------------- */

/**
 * Shows `message` under the field and links them with aria-describedby,
 * so a screen reader reads the error when the field is focused.
 */
export function showValidationError(field, message) {
  const input = fields[field];
  const errorElement = byId(`${input.id}-error`);

  errorElement.textContent = message;
  errorElement.hidden = false;
  input.setAttribute('aria-invalid', 'true');
}

export function clearValidationError(field) {
  const input = fields[field];
  const errorElement = byId(`${input.id}-error`);

  errorElement.textContent = '';
  errorElement.hidden = true;
  input.removeAttribute('aria-invalid');
}

export const focusField = (field) => fields[field].focus();

/** Uses aria-disabled (not `disabled`) so the button stays reachable by Tab. */
export function setSaveEnabled(isEnabled) {
  document.querySelectorAll('[data-save-button]').forEach((button) => {
    button.setAttribute('aria-disabled', String(!isEnabled));
  });
}

/* ---------------------------------------------------------------------------
   Settings
--------------------------------------------------------------------------- */

export function renderSettings(panel, preferences) {
  document.querySelectorAll('[data-panel]').forEach((section) => {
    section.hidden = section.dataset.panel !== panel;
  });

  document.querySelectorAll('[data-settings-panel]').forEach((button) => {
    if (button.dataset.settingsPanel === panel) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });

  document.querySelectorAll('input[name="theme"]').forEach((radio) => {
    radio.checked = radio.value === preferences.theme;
  });
  document.querySelectorAll('input[name="font"]').forEach((radio) => {
    radio.checked = radio.value === preferences.font;
  });
}

export function focusSettingsPanel(panel) {
  document.querySelector(`[data-panel="${panel}"] .settings-panel__title`)?.focus();
}

/* ---------------------------------------------------------------------------
   Toasts + screen-reader announcements
--------------------------------------------------------------------------- */

const TOAST_DURATION = 5000;

/**
 * @param {string} message
 * @param {{ type?: 'success'|'error', link?: { label: string, nav: string } }} [options]
 *   `link` renders a button with data-nav, so the global click listener
 *   handles it like any other navigation button.
 */
export function showToast(message, { type = 'success', link } = {}) {
  const toast = createElement('div', `toast toast--${type}`);
  const icon = createIcon(type === 'error' ? 'status' : 'check');
  icon.classList.add('toast__icon');
  toast.append(icon, createElement('p', 'toast__message', message));

  if (link) {
    const linkButton = createElement('button', 'link-button toast__action', link.label);
    linkButton.type = 'button';
    linkButton.dataset.nav = link.nav;
    toast.append(linkButton);
  }

  const close = createElement('button', 'icon-button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Dismiss notification');
  close.append(createIcon('close'));
  close.addEventListener('click', () => toast.remove());
  toast.append(close);

  // Only keep the newest few on screen.
  while (dom.toastRegion.children.length >= 3) dom.toastRegion.firstElementChild.remove();
  dom.toastRegion.append(toast);

  // Don't pull the toast away while someone is hovering or tabbing through it.
  let timer = setTimeout(() => toast.remove(), TOAST_DURATION);
  const pause = () => clearTimeout(timer);
  const resume = () => { timer = setTimeout(() => toast.remove(), TOAST_DURATION); };
  toast.addEventListener('mouseenter', pause);
  toast.addEventListener('mouseleave', resume);
  toast.addEventListener('focusin', pause);
  toast.addEventListener('focusout', resume);
}

/** Tells screen-reader users about changes they can't see (e.g. "3 notes found"). */
export function announce(message) {
  dom.announcer.textContent = '';
  // A short delay makes screen readers treat repeated messages as new.
  setTimeout(() => { dom.announcer.textContent = message; }, 50);
}

/* ---------------------------------------------------------------------------
   Confirmation modal
--------------------------------------------------------------------------- */

/**
 * Opens the <dialog> and resolves to true (confirmed) or false (cancelled,
 * Escape pressed). Focus goes to Cancel first — the safe choice — and goes
 * back to whatever had focus before the dialog opened.
 */
export function confirmDialog({ title, message, confirmLabel, icon = 'trash', tone = 'danger' }) {
  const opener = document.activeElement;

  dom.dialogTitle.textContent = title;
  dom.dialogMessage.textContent = message;
  dom.dialogConfirm.textContent = confirmLabel;
  dom.dialogIcon.setAttribute('href', `#icon-${icon}`);
  dom.dialog.classList.toggle('modal--danger', tone === 'danger');
  dom.dialogConfirm.classList.toggle('btn--danger', tone === 'danger');
  dom.dialogConfirm.classList.toggle('btn--primary', tone !== 'danger');

  dom.dialog.returnValue = '';
  dom.dialog.showModal();
  dom.dialogCancel.focus();

  return new Promise((resolve) => {
    dom.dialog.addEventListener('close', () => {
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
      resolve(dom.dialog.returnValue === 'confirm');
    }, { once: true });
  });
}

/** Lets a click on the dark backdrop close the dialog, like Escape does. */
dom.dialog.addEventListener('click', (event) => {
  if (event.target === dom.dialog) dom.dialog.close('cancel');
});

export const isDialogOpen = () => dom.dialog.open;
