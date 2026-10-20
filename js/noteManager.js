/**
 * noteManager.js
 * ----------------------------------------------------------------------------
 * Owns the list of notes in memory and every rule about them:
 * creating, editing, archiving, deleting, searching and filtering.
 *
 * It never touches the DOM. After each change it saves through storage.js;
 * if saving fails it puts the notes back the way they were and throws a
 * NoteStorageError, so memory and localStorage never disagree.
 */

import { saveNotes, loadNotes } from './storage.js';
import { sampleNotes } from './sampleNotes.js';

export class NoteStorageError extends Error {
  constructor(reason) {
    super(reason === 'quota'
      ? 'Your browser storage is full. Delete or download some notes, then try again.'
      : 'Notes could not be saved because browser storage is unavailable.');
    this.name = 'NoteStorageError';
    this.reason = reason;
  }
}

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */

/** crypto.randomUUID is built in, but needs a secure context (https/localhost). */
const generateId = () =>
  window.crypto?.randomUUID?.() ??
  `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const nowISO = () => new Date().toISOString();

/** "  react   hooks " → "react hooks" */
const normalizeTag = (tag) => String(tag).trim().replace(/\s+/g, ' ');

/** "Dev, React,dev ,," → ["Dev", "React"] (duplicates ignore upper/lower case) */
export function parseTags(text) {
  const seen = new Set();
  return String(text)
    .split(',')
    .map(normalizeTag)
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/* ---------------------------------------------------------------------------
   The Note class
--------------------------------------------------------------------------- */

export class Note {
  /**
   * @param {string}   title
   * @param {string}   content
   * @param {string[]} tags
   * @param {object}   [extra] values restored from storage (id, dates, archived, location)
   */
  constructor(title, content = '', tags = [], extra = {}) {
    this.id = extra.id ?? generateId();
    this.title = String(title).trim();
    this.content = String(content);
    this.tags = [];
    this.archived = Boolean(extra.archived);
    this.createdAt = extra.createdAt ?? nowISO();
    this.updatedAt = extra.updatedAt ?? this.createdAt;
    this.location = extra.location ?? null; // { latitude, longitude, city }

    tags.forEach((tag) => this.addTag(tag));
  }

  /** Rebuilds a real Note (with its methods) from plain JSON. */
  static fromJSON(data) {
    return new Note(data.title ?? 'Untitled Note', data.content ?? '', data.tags ?? [], data);
  }

  archive() {
    this.archived = true;
    return this;
  }

  restore() {
    this.archived = false;
    return this;
  }

  addTag(tag) {
    const clean = normalizeTag(tag);
    if (clean && !this.hasTag(clean)) this.tags.push(clean);
    return this;
  }

  hasTag(tag) {
    const wanted = tag.toLowerCase();
    return this.tags.some((existing) => existing.toLowerCase() === wanted);
  }

  /** Case-insensitive match against the title, the content and every tag. */
  matches(query) {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      this.title.toLowerCase().includes(needle) ||
      this.content.toLowerCase().includes(needle) ||
      this.tags.some((tag) => tag.toLowerCase().includes(needle))
    );
  }

  /** Marks the note as just edited (used for "Last edited" and sorting). */
  touch() {
    this.updatedAt = nowISO();
    return this;
  }
}

/* ---------------------------------------------------------------------------
   The collection (private to this module)
--------------------------------------------------------------------------- */

let notes = [];

const newestFirst = (a, b) => b.updatedAt.localeCompare(a.updatedAt);

/**
 * Runs `change`, then saves. If the save fails, rolls the in-memory list back
 * to its previous state and throws, so the UI can show an error toast.
 */
function commit(change) {
  const backup = JSON.stringify(notes);
  const result = change();
  const saved = saveNotes(notes);

  if (!saved.ok) {
    notes = JSON.parse(backup).map(Note.fromJSON);
    throw new NoteStorageError(saved.reason);
  }
  return result;
}

/**
 * Loads notes from localStorage. On the very first visit we add a few
 * example notes so the app isn't empty.
 * @returns {{ isFirstVisit: boolean }}
 */
export function initNotes() {
  const stored = loadNotes();
  const isFirstVisit = stored === null;
  const source = Array.isArray(stored) ? stored : sampleNotes;

  notes = source.map(Note.fromJSON);
  if (isFirstVisit) saveNotes(notes);

  return { isFirstVisit };
}

/* ---------------------------------------------------------------------------
   Reading
--------------------------------------------------------------------------- */

/** @param {{ archived?: boolean }} [filter] leave out to get every note */
export function getNotes({ archived } = {}) {
  const list = archived === undefined
    ? notes
    : notes.filter((note) => note.archived === archived);
  return [...list].sort(newestFirst);
}

export const getNoteById = (id) => notes.find((note) => note.id === id) ?? null;

/** Every tag used by any note (archived too, as in the Figma sidebar), A → Z, no duplicates. */
export function getAllTags() {
  const byLowercase = new Map();
  notes
    .flatMap((note) => note.tags)
    .forEach((tag) => {
      if (!byLowercase.has(tag.toLowerCase())) byLowercase.set(tag.toLowerCase(), tag);
    });
  return [...byLowercase.values()].sort((a, b) => a.localeCompare(b));
}

/** Searches active AND archived notes (archived results get a label in the UI). */
export const searchNotes = (query) => getNotes().filter((note) => note.matches(query));

/** Every note carrying `tag`, archived ones included (the Figma "Notes Tagged: Dev" screen lists them). */
export const filterByTag = (tag) => getNotes().filter((note) => note.hasTag(tag));

/* ---------------------------------------------------------------------------
   Writing — every function below goes through commit()
--------------------------------------------------------------------------- */

export function createNote(title, content, tags, extra = {}) {
  return commit(() => {
    const note = new Note(title, content, tags, { location: extra.location });
    notes.push(note);
    return note;
  });
}

/**
 * @param {string} id
 * @param {{ title?: string, content?: string, tags?: string[], location?: object|null }} updates
 */
export function updateNote(id, updates) {
  return commit(() => {
    const note = getNoteById(id);
    if (!note) throw new Error(`No note with id ${id}`);

    if ('title' in updates) note.title = updates.title.trim();
    if ('content' in updates) note.content = updates.content;
    if ('location' in updates) note.location = updates.location;
    if ('tags' in updates) {
      note.tags = [];
      updates.tags.forEach((tag) => note.addTag(tag));
    }
    return note.touch();
  });
}

/** Archives an active note or restores an archived one. */
export function toggleArchive(id) {
  return commit(() => {
    const note = getNoteById(id);
    return note.archived ? note.restore() : note.archive();
  });
}

export function deleteNote(id) {
  return commit(() => {
    notes = notes.filter((note) => note.id !== id);
  });
}

/* ---------------------------------------------------------------------------
   Backup (export / import JSON)
--------------------------------------------------------------------------- */

export const exportNotes = () => JSON.stringify(notes, null, 2);

/**
 * Adds notes from a backup file. A note whose id already exists is replaced.
 * @returns {number} how many notes were imported
 */
export function importNotes(data) {
  if (!Array.isArray(data)) throw new TypeError('The file does not contain a list of notes.');

  const incoming = data
    .filter((item) => item && typeof item.title === 'string')
    .map(Note.fromJSON);

  if (incoming.length === 0) throw new TypeError('No notes were found in that file.');

  return commit(() => {
    const incomingIds = new Set(incoming.map((note) => note.id));
    notes = [...notes.filter((note) => !incomingIds.has(note.id)), ...incoming];
    return incoming.length;
  });
}

/** Throws away every saved note and loads the 10 notes from the Figma design again. */
export function resetToSampleNotes() {
  return commit(() => {
    notes = sampleNotes.map(Note.fromJSON);
  });
}

/** Re-reads localStorage (used when another tab changed the notes). */
export function reloadNotes() {
  const stored = loadNotes();
  if (Array.isArray(stored)) notes = stored.map(Note.fromJSON);
}
