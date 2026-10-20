/**
 * main.js
 * ----------------------------------------------------------------------------
 * The app's "controller". It holds the current state (which view, which note,
 * what's being searched), listens for user events, asks noteManager to change
 * data, and asks ui to redraw.
 *
 * The flow is always the same:
 *     user event  →  update `state` / call noteManager  →  render()
 */

import * as storage from './storage.js';
import * as noteManager from './noteManager.js';
import * as ui from './ui.js';
import * as themes from './themes.js';
import { validateNoteForm, isFormValid } from './validation.js';
import { getCurrentLocation, describeLocation, locationErrorMessage } from './location.js';

/* ===========================================================================
   State
=========================================================================== */

const desktopQuery = window.matchMedia('(min-width: 68em)');
const isDesktop = () => desktopQuery.matches;

const state = {
  view: 'all',          // 'all' | 'archived' | 'tag' | 'search' | 'tags' | 'settings'
  activeTag: null,      // set when view === 'tag'
  query: '',            // set when view === 'search'
  selectedId: null,     // id of the note open in the editor
  isCreating: false,    // true while writing a brand-new note
  screen: 'list',       // phones/tablets: 'list' or 'detail'
  settingsPanel: 'color',
  preferences: storage.loadPreferences(),

  // What's currently loaded in the editor form
  editor: {
    noteKey: null,      // note id, or 'new'
    location: null,     // location attached in the form (saved on "Save Note")
    isDirty: false,     // unsaved changes?
    touched: new Set(), // fields the user has left at least once (for blur validation)
  },
};

const EMPTY_MESSAGES = {
  all: { text: 'You don’t have any notes yet. Start a new note to capture your thoughts and ideas.' },
  archived: { text: 'No notes have been archived yet. Move notes here for safekeeping, or ', action: 'create a new note', after: '.' },
  tag: { text: 'No notes found with this tag. Try another tag or ', action: 'create a new note', after: '.' },
  search: { text: 'No notes match your search. Try a different keyword or ', action: 'create a new note', after: '.' },
};

/* ===========================================================================
   Rendering
=========================================================================== */

/** The notes that belong in the list for the current view. */
function getVisibleNotes() {
  switch (state.view) {
    case 'archived': return noteManager.getNotes({ archived: true });
    case 'tag':      return noteManager.filterByTag(state.activeTag);
    case 'search':   return state.query ? noteManager.searchNotes(state.query) : noteManager.getNotes({ archived: false });
    default:         return noteManager.getNotes({ archived: false });
  }
}

/**
 * Redraws everything from `state`.
 * @param {{ refreshEditor?: boolean }} options  true = reload the form even if
 *        the same note is still selected (after save / cancel / archive).
 */
function render({ refreshEditor = false } = {}) {
  const notes = getVisibleNotes();

  // Keep a sensible selection: if the open note isn't in this list any more,
  // open the first one — unless the user has unsaved edits in it.
  const selectionIsVisible = notes.some((note) => note.id === state.selectedId);
  if (!state.isCreating && !state.editor.isDirty && !selectionIsVisible) {
    state.selectedId = notes[0]?.id ?? null;
  }

  ui.setView(state.view, state.activeTag);
  ui.setScreen(state.screen);
  ui.renderHeader({ view: state.view, tag: state.activeTag, query: state.query });
  ui.toggleArchiveView(state.view === 'archived');
  ui.updateTagList(noteManager.getAllTags(), state.activeTag);

  renderEditor(refreshEditor);

  ui.renderAllNotes(notes, {
    selectedId: state.isCreating ? null : state.selectedId,
    query: state.view === 'search' ? state.query : '',
    draftTitle: state.isCreating ? ui.readEditor().title : null,
    emptyMessage: EMPTY_MESSAGES[state.view] ?? EMPTY_MESSAGES.all,
    showStatus: state.view !== 'archived',
  });
}

/** Loads the selected note into the form, but only when it actually changed. */
function renderEditor(force) {
  const key = state.isCreating ? 'new' : state.selectedId;

  if (!key) {
    state.editor.noteKey = null;
    ui.showEditorPlaceholder(true);
    return;
  }

  ui.showEditorPlaceholder(false);
  if (force || key !== state.editor.noteKey) {
    loadIntoEditor(key === 'new' ? null : noteManager.getNoteById(key));
  }
}

/**
 * @param {Note|null} note
 * @param {object} [values]  draft values to show instead of the saved ones
 * @param {boolean} [dirty]  whether those values count as unsaved changes
 */
function loadIntoEditor(note, values = {}, dirty = false) {
  ui.fillEditor(note, values);
  state.editor = {
    noteKey: note?.id ?? 'new',
    location: 'location' in values ? values.location : note?.location ?? null,
    isDirty: dirty,
    touched: new Set(),
  };
  refreshSaveButton();
}

/* ===========================================================================
   Validation
=========================================================================== */

/** Re-checks the form and enables/disables Save. Returns the errors. */
function refreshSaveButton() {
  const errors = validateNoteForm(ui.readEditor());
  ui.setSaveEnabled(isFormValid(errors));
  return errors;
}

function showFieldError(field, message) {
  if (message) ui.showValidationError(field, message);
  else ui.clearValidationError(field);
}

/* ===========================================================================
   Drafts (sessionStorage)
=========================================================================== */

let draftTimer;

/** Saves the form 400ms after the user stops typing (a "debounce"). */
function scheduleDraftSave() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    const result = storage.saveDraft({
      noteId: state.isCreating ? null : state.selectedId,
      ...ui.readEditor(),
      location: state.editor.location,
      savedAt: new Date().toISOString(),
    });
    ui.setDraftStatus(result.ok ? 'Draft saved' : '');
  }, 400);
}

function discardDraft() {
  clearTimeout(draftTimer); // stop a pending save from bringing the draft back
  storage.clearDraft();
}

/** After a reload, put the unsaved draft back where it was. */
function restoreDraft() {
  const draft = storage.loadDraft();
  if (!draft) return;

  const note = draft.noteId ? noteManager.getNoteById(draft.noteId) : null;
  if (draft.noteId && !note) {
    discardDraft(); // that note was deleted in the meantime
    return;
  }

  state.isCreating = !note;
  if (note) {
    state.selectedId = note.id;
    if (note.archived) state.view = 'archived';
  }
  state.screen = 'detail';
  render();

  loadIntoEditor(note, {
    title: draft.title,
    tags: draft.tags,
    content: draft.content,
    location: draft.location ?? null,
  }, true);
  ui.updateDraftCardTitle(draft.title);
  ui.setDraftStatus('Draft restored');
  ui.showToast('Your unsaved draft was restored.');
}

/** Ask before throwing away unsaved edits. Resolves true if it's OK to continue. */
async function confirmDiscardChanges() {
  if (!state.editor.isDirty) return true;

  const confirmed = await ui.confirmDialog({
    title: 'Discard changes?',
    message: 'This note has changes that haven’t been saved. If you continue, they will be lost.',
    confirmLabel: 'Discard changes',
    icon: 'status',
  });

  if (confirmed) {
    discardDraft();
    state.editor.isDirty = false;
  }
  return confirmed;
}

/* ===========================================================================
   Note actions
=========================================================================== */

async function startNewNote() {
  if (!(await confirmDiscardChanges())) return;

  if (['archived', 'settings', 'tags'].includes(state.view)) state.view = 'all';
  state.isCreating = true;
  state.screen = 'detail';
  render({ refreshEditor: true });

  // Creating from a tag page? Pre-fill that tag.
  if (state.view === 'tag') loadIntoEditor(null, { tags: state.activeTag });

  ui.focusTitleInput();
}

async function selectNote(id) {
  if (id === 'new') {
    ui.focusTitleInput();
    return;
  }

  const isDifferentNote = id !== state.selectedId || state.isCreating;
  if (isDifferentNote && !(await confirmDiscardChanges())) return;

  state.isCreating = false;
  state.selectedId = id;
  state.screen = 'detail';
  render();

  // Desktop: focus stays on the card so arrow keys keep working.
  // Mobile: the list is gone, so move focus into the editor.
  if (!isDesktop()) document.getElementById('editor-pane').focus();
}

function handleNoteSubmit(event) {
  event.preventDefault();

  const values = ui.readEditor();
  const errors = validateNoteForm(values);

  Object.entries(errors).forEach(([field, message]) => {
    state.editor.touched.add(field);
    showFieldError(field, message);
  });

  if (!isFormValid(errors)) {
    const firstInvalid = Object.keys(errors).find((field) => errors[field]);
    ui.focusField(firstInvalid);
    ui.announce(errors[firstInvalid]);
    return;
  }

  const tags = noteManager.parseTags(values.tags);

  try {
    if (state.isCreating) {
      const note = noteManager.createNote(values.title, values.content, tags, { location: state.editor.location });
      state.isCreating = false;
      state.selectedId = note.id;
    } else {
      noteManager.updateNote(state.selectedId, {
        title: values.title,
        content: values.content,
        tags,
        location: state.editor.location,
      });
    }
  } catch (error) {
    reportError(error);
    return;
  }

  // If the saved note wouldn't show in the current list, jump to All Notes.
  state.editor.isDirty = false;
  if (!getVisibleNotes().some((note) => note.id === state.selectedId)) {
    goToView('all');
  }

  discardDraft();
  render({ refreshEditor: true });
  ui.showToast('Note saved successfully!');
}

function cancelEdit() {
  discardDraft();
  state.editor.isDirty = false;

  if (state.isCreating) {
    state.isCreating = false;
    state.screen = 'list';
    render({ refreshEditor: true });
    if (!ui.focusNoteCard(state.selectedId)) ui.focusPageTitle();
  } else {
    render({ refreshEditor: true });
    ui.announce('Changes discarded.');
  }
}

async function handleToggleArchive(noteId) {
  const note = noteManager.getNoteById(noteId);
  if (!note) return;

  if (!(await confirmDiscardChanges())) return;

  if (!note.archived) {
    const confirmed = await ui.confirmDialog({
      title: 'Archive Note',
      message: 'Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.',
      confirmLabel: 'Archive Note',
      icon: 'archive',
      tone: 'neutral',
    });
    if (!confirmed) return;
  }

  try {
    noteManager.toggleArchive(noteId);
  } catch (error) {
    reportError(error);
    return;
  }

  afterNoteLeftList(noteId);

  if (note.archived) {
    ui.showToast('Note archived.', { link: { label: 'Archived Notes', nav: 'archived' } });
  } else {
    ui.showToast('Note restored to active notes.', { link: { label: 'All Notes', nav: 'all' } });
  }
}

async function handleDelete(noteId) {
  const confirmed = await ui.confirmDialog({
    title: 'Delete Note',
    message: 'Are you sure you want to permanently delete this note? This action cannot be undone.',
    confirmLabel: 'Delete Note',
    icon: 'trash',
    tone: 'danger',
  });
  if (!confirmed) return;

  try {
    noteManager.deleteNote(noteId);
  } catch (error) {
    reportError(error);
    return;
  }

  afterNoteLeftList(noteId);
  ui.showToast('Note permanently deleted.');
}

/** Shared clean-up after a note was archived, restored or deleted. */
function afterNoteLeftList(noteId) {
  discardDraft();
  state.editor.isDirty = false;
  render({ refreshEditor: true });

  // On mobile, go back to the list if the note is no longer in it.
  const stillVisible = getVisibleNotes().some((note) => note.id === noteId);
  if (!stillVisible && state.screen === 'detail') {
    state.screen = 'list';
    ui.setScreen('list');
  }

  // Put focus somewhere meaningful instead of on a button that just vanished.
  if (!ui.focusNoteCard(state.selectedId)) ui.focusPageTitle();
}

async function addLocation(button) {
  if (button.getAttribute('aria-busy') === 'true') return;
  ui.setLocationBusy(true);

  try {
    const location = await getCurrentLocation();
    state.editor.location = location;
    ui.renderLocation(location);
    markEditorDirty();
    ui.announce(`Location added: ${describeLocation(location)}. Save the note to keep it.`);
  } catch (error) {
    ui.renderLocation(state.editor.location);
    ui.showToast(locationErrorMessage(error), { type: 'error' });
  } finally {
    ui.setLocationBusy(false);
  }
}

function removeLocation() {
  state.editor.location = null;
  ui.renderLocation(null);
  markEditorDirty();
  ui.announce('Location removed. Save the note to keep this change.');
}

function markEditorDirty() {
  state.editor.isDirty = true;
  refreshSaveButton();
  scheduleDraftSave();
}

/* ===========================================================================
   Navigation
=========================================================================== */

/** Sets state for a view without rendering (shared by several handlers). */
function goToView(view) {
  state.view = view;
  state.activeTag = null;
  state.screen = 'list';
  if (view !== 'search') {
    state.query = '';
    document.querySelectorAll('[data-search-input]').forEach((input) => { input.value = ''; });
  }
}

async function navigate(view) {
  if (!(await confirmDiscardChanges())) return;

  // Leaving settings without "Apply Changes" undoes the live preview.
  if (state.view === 'settings' && view !== 'settings') applySavedPreferences();

  state.isCreating = false;
  goToView(view === 'tags' && isDesktop() ? 'all' : view);
  render();

  if (view === 'settings') {
    ui.renderSettings(state.settingsPanel, state.preferences);
  }

  if (view === 'search') {
    document.getElementById(isDesktop() ? 'search-desktop' : 'search-mobile').focus();
  } else {
    ui.focusPageTitle(); // tells screen-reader users the page changed
  }
}

async function selectTag(tag) {
  if (!(await confirmDiscardChanges())) return;

  state.isCreating = false;
  goToView('tag');
  state.activeTag = tag;
  render();
  ui.focusPageTitle();
  ui.announce(`${getVisibleNotes().length} notes tagged ${tag}.`);
}

function goBack() {
  if (state.view === 'settings') {
    state.screen = 'list';
    ui.setScreen('list');
    document.querySelector(`[data-settings-panel="${state.settingsPanel}"]`)?.focus();
    return;
  }

  confirmDiscardChanges().then((confirmed) => {
    if (!confirmed) return;
    const openedId = state.selectedId;
    state.isCreating = false;
    state.screen = 'list';
    render({ refreshEditor: true });
    if (!ui.focusNoteCard(openedId)) ui.focusPageTitle();
  });
}

/* ===========================================================================
   Search
=========================================================================== */

let announceTimer;

function handleSearchInput(event) {
  const rawQuery = event.target.value;

  // Keep the desktop and mobile search boxes showing the same text.
  document.querySelectorAll('[data-search-input]').forEach((input) => {
    if (input !== event.target) input.value = rawQuery;
  });

  state.query = rawQuery.trim();
  if (state.query) {
    state.view = 'search';
    state.activeTag = null;
  } else if (state.view === 'search' && isDesktop()) {
    state.view = 'all';
  }
  state.screen = 'list';
  render();

  // Wait until typing pauses so screen readers aren't flooded.
  clearTimeout(announceTimer);
  announceTimer = setTimeout(() => {
    if (!state.query) return;
    const count = getVisibleNotes().length;
    ui.announce(count === 0 ? 'No notes match your search.' : `${count} ${count === 1 ? 'note' : 'notes'} found.`);
  }, 600);
}

/* ===========================================================================
   Settings
=========================================================================== */

function applySavedPreferences() {
  themes.applyTheme(state.preferences.theme);
  themes.applyFont(state.preferences.font);
}

function openSettingsPanel(panel) {
  state.settingsPanel = panel;
  state.screen = 'detail';
  ui.setScreen('detail');
  ui.renderSettings(panel, state.preferences);
  ui.focusSettingsPanel(panel);
}

/** `change` event: preview the theme/font as soon as a radio is picked. */
function handlePreferencePreview(event) {
  if (event.target.name === 'theme') themes.applyTheme(event.target.value);
  if (event.target.name === 'font') themes.applyFont(event.target.value);
}

/** `submit` event: "Apply Changes" saves the choice. */
function handlePreferenceSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const updated = { ...state.preferences, ...Object.fromEntries(formData) };

  const result = storage.savePreferences(updated);
  if (!result.ok) {
    ui.showToast('Settings couldn’t be saved in this browser.', { type: 'error' });
    return;
  }

  state.preferences = updated;
  applySavedPreferences();
  ui.showToast('Settings updated successfully!');
}

function exportNotes() {
  const blob = new Blob([noteManager.exportNotes()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  ui.showToast('Notes downloaded.');
}

async function importNotes(event) {
  const input = event.target;
  const file = input.files[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());
    const count = noteManager.importNotes(data);
    render({ refreshEditor: !state.editor.isDirty });
    ui.showToast(`${count} ${count === 1 ? 'note' : 'notes'} loaded from ${file.name}.`);
  } catch (error) {
    const message = error instanceof SyntaxError ? 'That file isn’t a valid notes backup (.json).' : error.message;
    ui.showToast(message, { type: 'error' });
  } finally {
    input.value = ''; // allows choosing the same file again
  }
}

async function resetNotes() {
  const confirmed = await ui.confirmDialog({
    title: 'Reset notes',
    message: 'This replaces all your notes with the 10 example notes from the design. Download a backup first if you want to keep them.',
    confirmLabel: 'Reset notes',
    icon: 'restore',
  });
  if (!confirmed) return;

  try {
    noteManager.resetToSampleNotes();
  } catch (error) {
    reportError(error);
    return;
  }
  discardDraft();
  state.editor.isDirty = false;
  state.selectedId = null;
  render({ refreshEditor: true });
  ui.showToast('Notes reset to the Figma examples.');
}

/* ===========================================================================
   Errors
=========================================================================== */

function reportError(error) {
  if (error instanceof noteManager.NoteStorageError) {
    ui.showToast(error.message, { type: 'error' });
  } else {
    console.error(error);
    ui.showToast('Something went wrong. Your last change wasn’t saved.', { type: 'error' });
  }
}

/* ===========================================================================
   Event listeners
=========================================================================== */

/** Elements where a typed "/" means text, not "jump to search". */
const isTypingTarget = (element) => element.closest('input, textarea, [contenteditable="true"]');

function bindEvents() {
  const noteList = document.getElementById('note-list');
  const form = document.getElementById('note-form');

  /*
   * ONE click listener for the whole page (event delegation).
   * Clicks bubble up to `document`; closest() finds which kind of button
   * was hit. New buttons added later (tags, toasts, empty-state links) work
   * automatically without adding listeners to each one.
   */
  const actions = {
    'new-note': () => startNewNote(),
    'toggle-archive': (noteId) => handleToggleArchive(noteId),
    'delete': (noteId) => handleDelete(noteId),
    'cancel-edit': () => cancelEdit(),
    'go-back': () => goBack(),
    'add-location': (_noteId, button) => addLocation(button),
    'remove-location': () => removeLocation(),
    'export-notes': () => exportNotes(),
    'reset-notes': () => resetNotes(),
  };

  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
      // The note an action applies to is stored on the nearest pane: data-note-id="…"
      const noteId = actionButton.closest('[data-note-id]')?.dataset.noteId;
      actions[actionButton.dataset.action]?.(noteId, actionButton);
      return;
    }

    const navButton = event.target.closest('[data-nav]');
    if (navButton) return navigate(navButton.dataset.nav);

    const tagButton = event.target.closest('[data-tag]');
    if (tagButton) return selectTag(tagButton.dataset.tag);

    const panelButton = event.target.closest('[data-settings-panel]');
    if (panelButton) return openSettingsPanel(panelButton.dataset.settingsPanel);
  });

  /* Note list: one listener for every card, using the card's data-note-id. */
  noteList.addEventListener('click', (event) => {
    const card = event.target.closest('[data-note-id]');
    if (card) selectNote(card.dataset.noteId);
  });

  /* Arrow keys move between cards (Enter/Space already "click" a button). */
  noteList.addEventListener('keydown', (event) => {
    const cards = [...noteList.querySelectorAll('[data-note-id]')];
    const index = cards.indexOf(document.activeElement);
    if (index === -1) return;

    const targets = {
      ArrowDown: cards[index + 1],
      ArrowUp: cards[index - 1],
      Home: cards[0],
      End: cards[cards.length - 1],
    };
    if (event.key in targets) {
      event.preventDefault();
      targets[event.key]?.focus();
    }
  });

  /* Note form */
  form.addEventListener('submit', handleNoteSubmit);

  form.addEventListener('input', (event) => {
    if (event.target.name === 'title') {
      // A title is one line: turn pasted line breaks into spaces, then resize the box.
      const title = event.target;
      if (title.value.includes('\n')) title.value = title.value.replace(/\s*\n+\s*/g, ' ');
      ui.fitTitleHeight();
    }

    state.editor.isDirty = true;
    const errors = refreshSaveButton();

    // Live feedback, but only for fields the user has already left once.
    state.editor.touched.forEach((field) => showFieldError(field, errors[field]));

    if (event.target.name === 'title' && state.isCreating) ui.updateDraftCardTitle(event.target.value);
    scheduleDraftSave();
  });

  // `blur` doesn't bubble but `focusout` does, so one listener covers every field.
  form.addEventListener('focusout', (event) => {
    const field = event.target.name;
    if (field !== 'title' && field !== 'tags') return;
    state.editor.touched.add(field);
    showFieldError(field, validateNoteForm(ui.readEditor())[field]);
  });

  form.addEventListener('keydown', (event) => {
    // Enter in the title saves (it's a textarea only so long titles can wrap).
    const isTitleEnter = event.key === 'Enter' && event.target.name === 'title' && !event.shiftKey;
    if (isTitleEnter || (event.key === 'Enter' && (event.ctrlKey || event.metaKey))) {
      event.preventDefault();
      form.requestSubmit(); // goes through the normal submit + validation path
    }
    if (event.key === 'Escape' && !ui.isDialogOpen()) {
      event.stopPropagation();
      cancelEdit();
    }
  });

  /* Search boxes (desktop header + mobile Search tab) */
  document.querySelectorAll('[data-search-input]').forEach((input) => {
    input.addEventListener('input', handleSearchInput);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && input.value) {
        event.stopPropagation();
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });

  /* Settings: `change` previews, `submit` saves */
  ['color-form', 'font-form'].forEach((id) => {
    const settingsForm = document.getElementById(id);
    settingsForm.addEventListener('change', handlePreferencePreview);
    settingsForm.addEventListener('submit', handlePreferenceSubmit);
  });

  document.getElementById('import-file').addEventListener('change', importNotes);

  /* Page-wide keyboard shortcuts */
  document.addEventListener('keydown', (event) => {
    if (ui.isDialogOpen()) return;

    if (event.key === '/' && !isTypingTarget(event.target)) {
      event.preventDefault();
      if (isDesktop()) document.getElementById('search-desktop').focus();
      else navigate('search');
    }

    if (event.key === 'Escape' && !isDesktop() && state.screen === 'detail') {
      goBack();
    }
  });

  /* Another tab changed the notes → show the latest version here too. */
  window.addEventListener('storage', (event) => {
    if (event.key !== storage.NOTES_KEY) return;
    noteManager.reloadNotes();
    render();
  });

  /* Rotating a tablet / resizing the window across the desktop breakpoint. */
  desktopQuery.addEventListener('change', () => {
    if (isDesktop() && state.view === 'tags') goToView('all');
    render();
  });

  themes.watchSystemTheme(() => state.preferences.theme);
}

/* ===========================================================================
   Start
=========================================================================== */

function init() {
  applySavedPreferences();
  noteManager.initNotes();
  bindEvents();
  render();
  restoreDraft();
}

init();
