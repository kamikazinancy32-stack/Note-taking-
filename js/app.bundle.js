/* GENERATED from js/*.js by `npm run build` — do not edit. Used only when index.html is opened straight from disk (file://). */
(() => {
  // js/storage.js
  var KEYS = {
    notes: "notes-app:notes-v2",
    // v2 = the 10 notes from the Figma design
    preferences: "notes-app:preferences",
    draft: "notes-app:draft"
  };
  var DEFAULT_PREFERENCES = Object.freeze({
    theme: "system",
    // 'light' | 'dark' | 'system'
    font: "sans"
    // 'sans' | 'serif' | 'mono'
  });
  function getStore(type) {
    try {
      return window[type];
    } catch {
      return null;
    }
  }
  function isQuotaError(error) {
    return error instanceof DOMException && (error.name === "QuotaExceededError" || // most browsers
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" || // older Firefox
    error.code === 22);
  }
  function readJSON(type, key, fallback) {
    const store = getStore(type);
    if (!store) return fallback;
    try {
      const raw = store.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      console.warn(`Could not read "${key}" from ${type}.`, error);
      return fallback;
    }
  }
  function writeJSON(type, key, value) {
    const store = getStore(type);
    if (!store) return { ok: false, reason: "unavailable" };
    try {
      store.setItem(key, JSON.stringify(value));
      return { ok: true };
    } catch (error) {
      return { ok: false, reason: isQuotaError(error) ? "quota" : "unavailable", error };
    }
  }
  var saveNotes = (notes2) => writeJSON("localStorage", KEYS.notes, notes2);
  var loadNotes = () => readJSON("localStorage", KEYS.notes, null);
  var savePreferences = (prefs) => writeJSON("localStorage", KEYS.preferences, prefs);
  var loadPreferences = () => ({
    ...DEFAULT_PREFERENCES,
    ...readJSON("localStorage", KEYS.preferences, {})
  });
  var saveDraft = (draft) => writeJSON("sessionStorage", KEYS.draft, draft);
  var loadDraft = () => readJSON("sessionStorage", KEYS.draft, null);
  var clearDraft = () => {
    getStore("sessionStorage")?.removeItem(KEYS.draft);
  };
  var NOTES_KEY = KEYS.notes;

  // js/sampleNotes.js
  var sampleNotes = [
    {
      id: "figma-react-performance",
      title: "React Performance Optimization",
      tags: ["Dev", "React"],
      archived: false,
      updatedAt: "2024-10-29T10:00:00.000Z",
      content: `Key performance optimization techniques:

1. Code Splitting
- Use React.lazy() for route-based splitting
- Implement dynamic imports for heavy components

2. Memoization
- useMemo for expensive calculations
- useCallback for function props
- React.memo for component optimization

3. Virtual List Implementation
- Use react-window for long lists
- Implement infinite scrolling

TODO: Benchmark current application and identify bottlenecks`
    },
    {
      id: "figma-japan-travel",
      title: "Japan Travel Planning",
      tags: ["Travel", "Personal"],
      archived: false,
      updatedAt: "2024-10-28T10:00:00.000Z",
      content: `Japan Trip Planning - Spring 2025

ITINERARY DRAFT:
Week 1: Tokyo
- Shibuya and Harajuku
- TeamLab Digital Art Museum
- Day trip to Mount Fuji

Week 2: Kyoto & Osaka
- Temple hopping in Kyoto
- Street food tour in Osaka
- Nara deer park day trip

TO-DO:
- Book JR Pass
- Research ryokans
- Make restaurant reservations`
    },
    {
      id: "figma-pasta-recipes",
      title: "Favorite Pasta Recipes",
      tags: ["Cooking", "Recipes"],
      archived: false,
      updatedAt: "2024-10-27T10:00:00.000Z",
      content: `Classic Italian Recipes:

1. Carbonara
- Eggs + pecorino
- Guanciale
- Fresh black pepper

2. Cacio e Pepe
- Pecorino Romano
- Fresh black pepper
- Pasta water

3. Aglio e Olio
- Garlic
- Olive oil
- Red pepper flakes`
    },
    {
      id: "figma-typescript-migration",
      title: "TypeScript Migration Guide",
      tags: ["Dev", "React", "TypeScript"],
      archived: true,
      updatedAt: "2024-10-26T10:00:00.000Z",
      content: `Project migration steps:

1. Initial Setup
- Install TypeScript dependencies
- Configure tsconfig.json
- Set up build pipeline

2. Migration Strategy
- Start with newer modules
- Add type definitions gradually
- Use 'any' temporarily for complex cases

3. Testing Approach
- Update test configuration
- Add type testing
- Validate build process

Deadline: End of Q4 2024`
    },
    {
      id: "figma-workout-plan",
      title: "Weekly Workout Plan",
      tags: ["Dev", "React"],
      archived: false,
      updatedAt: "2024-10-25T10:00:00.000Z",
      content: `Monday: Upper Body
- Bench Press 4x8
- Rows 4x10
- Shoulder Press 3x12

Wednesday: Lower Body
- Squats 4x8
- Romanian Deadlifts 3x10
- Lunges 3x12 each leg

Friday: Full Body
- Deadlifts 3x5
- Pull-ups 3x8
- Push-ups 3x15`
    },
    {
      id: "figma-gift-ideas",
      title: "Gift Ideas",
      tags: ["Personal", "Shopping"],
      archived: true,
      updatedAt: "2024-10-20T10:00:00.000Z",
      content: `Birthday & Holiday Gift List:

Mom:
- Cooking class subscription
- Kindle with gardening books

Dad:
- Golf lessons
- Leather wallet

Sister:
- Art supplies set
- Concert tickets`
    },
    {
      id: "figma-component-library",
      title: "React Component Library",
      tags: ["Dev", "React"],
      archived: true,
      updatedAt: "2024-10-15T10:00:00.000Z",
      content: `Custom Component Library Structure:

1. Basic Components
- Button
- Input
- Card
- Modal

2. Form Components
- FormField
- Checkbox
- RadioGroup
- Select

3. Layout Components
- Container
- Grid
- Flex`
    },
    {
      id: "figma-meal-prep",
      title: "Meal Prep Ideas",
      tags: ["Cooking", "Health", "Recipes"],
      archived: false,
      updatedAt: "2024-10-12T10:00:00.000Z",
      content: `Weekly Meal Prep Plan:

Breakfast Options:
- Overnight oats
- Egg muffins
- Smoothie packs

Lunch Containers:
- Quinoa Buddha bowls
- Chicken wraps
- Lentil soup

Snacks:
- Cut vegetables
- Mixed nuts
- Greek yogurt parfaits`
    },
    {
      id: "figma-reading-list",
      title: "Reading List",
      tags: ["Personal", "Dev"],
      archived: false,
      updatedAt: "2024-10-05T10:00:00.000Z",
      content: `Current Reading Queue:

1. Technical Books
- Clean Code by Robert Martin
- Designing Data-Intensive Applications
- TypeScript Design Patterns

2. Personal Development
- Deep Work by Cal Newport
- Atomic Habits
- The Psychology of Money

Currently Reading: Clean Code`
    },
    {
      id: "figma-fitness-goals",
      title: "Fitness Goals 2025",
      tags: ["Fitness", "Health", "Personal"],
      archived: false,
      updatedAt: "2024-09-22T10:00:00.000Z",
      content: `2025 Fitness Objectives:

1. Strength Goals
- Bench press: 225 lbs
- Squat: 315 lbs
- Deadlift: 405 lbs

2. Cardio Goals
- Run half marathon
- 5k under 25 minutes

3. Habits
- Gym 4x per week
- Daily 10k steps
- Sleep 7+ hours`
    }
  ];

  // js/noteManager.js
  var NoteStorageError = class extends Error {
    constructor(reason) {
      super(reason === "quota" ? "Your browser storage is full. Delete or download some notes, then try again." : "Notes could not be saved because browser storage is unavailable.");
      this.name = "NoteStorageError";
      this.reason = reason;
    }
  };
  var generateId = () => window.crypto?.randomUUID?.() ?? `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  var nowISO = () => (/* @__PURE__ */ new Date()).toISOString();
  var normalizeTag = (tag) => String(tag).trim().replace(/\s+/g, " ");
  function parseTags(text) {
    const seen = /* @__PURE__ */ new Set();
    return String(text).split(",").map(normalizeTag).filter((tag) => {
      const key = tag.toLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  var Note = class _Note {
    /**
     * @param {string}   title
     * @param {string}   content
     * @param {string[]} tags
     * @param {object}   [extra] values restored from storage (id, dates, archived, location)
     */
    constructor(title, content = "", tags = [], extra = {}) {
      this.id = extra.id ?? generateId();
      this.title = String(title).trim();
      this.content = String(content);
      this.tags = [];
      this.archived = Boolean(extra.archived);
      this.createdAt = extra.createdAt ?? nowISO();
      this.updatedAt = extra.updatedAt ?? this.createdAt;
      this.location = extra.location ?? null;
      tags.forEach((tag) => this.addTag(tag));
    }
    /** Rebuilds a real Note (with its methods) from plain JSON. */
    static fromJSON(data) {
      return new _Note(data.title ?? "Untitled Note", data.content ?? "", data.tags ?? [], data);
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
      return this.title.toLowerCase().includes(needle) || this.content.toLowerCase().includes(needle) || this.tags.some((tag) => tag.toLowerCase().includes(needle));
    }
    /** Marks the note as just edited (used for "Last edited" and sorting). */
    touch() {
      this.updatedAt = nowISO();
      return this;
    }
  };
  var notes = [];
  var newestFirst = (a, b) => b.updatedAt.localeCompare(a.updatedAt);
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
  function initNotes() {
    const stored = loadNotes();
    const isFirstVisit = stored === null;
    const source = Array.isArray(stored) ? stored : sampleNotes;
    notes = source.map(Note.fromJSON);
    if (isFirstVisit) saveNotes(notes);
    return { isFirstVisit };
  }
  function getNotes({ archived } = {}) {
    const list = archived === void 0 ? notes : notes.filter((note) => note.archived === archived);
    return [...list].sort(newestFirst);
  }
  var getNoteById = (id) => notes.find((note) => note.id === id) ?? null;
  function getAllTags() {
    const byLowercase = /* @__PURE__ */ new Map();
    notes.flatMap((note) => note.tags).forEach((tag) => {
      if (!byLowercase.has(tag.toLowerCase())) byLowercase.set(tag.toLowerCase(), tag);
    });
    return [...byLowercase.values()].sort((a, b) => a.localeCompare(b));
  }
  var searchNotes = (query) => getNotes().filter((note) => note.matches(query));
  var filterByTag = (tag) => getNotes().filter((note) => note.hasTag(tag));
  function createNote(title, content, tags, extra = {}) {
    return commit(() => {
      const note = new Note(title, content, tags, { location: extra.location });
      notes.push(note);
      return note;
    });
  }
  function updateNote(id, updates) {
    return commit(() => {
      const note = getNoteById(id);
      if (!note) throw new Error(`No note with id ${id}`);
      if ("title" in updates) note.title = updates.title.trim();
      if ("content" in updates) note.content = updates.content;
      if ("location" in updates) note.location = updates.location;
      if ("tags" in updates) {
        note.tags = [];
        updates.tags.forEach((tag) => note.addTag(tag));
      }
      return note.touch();
    });
  }
  function toggleArchive(id) {
    return commit(() => {
      const note = getNoteById(id);
      return note.archived ? note.restore() : note.archive();
    });
  }
  function deleteNote(id) {
    return commit(() => {
      notes = notes.filter((note) => note.id !== id);
    });
  }
  var exportNotes = () => JSON.stringify(notes, null, 2);
  function importNotes(data) {
    if (!Array.isArray(data)) throw new TypeError("The file does not contain a list of notes.");
    const incoming = data.filter((item) => item && typeof item.title === "string").map(Note.fromJSON);
    if (incoming.length === 0) throw new TypeError("No notes were found in that file.");
    return commit(() => {
      const incomingIds = new Set(incoming.map((note) => note.id));
      notes = [...notes.filter((note) => !incomingIds.has(note.id)), ...incoming];
      return incoming.length;
    });
  }
  function resetToSampleNotes() {
    return commit(() => {
      notes = sampleNotes.map(Note.fromJSON);
    });
  }
  function reloadNotes() {
    const stored = loadNotes();
    if (Array.isArray(stored)) notes = stored.map(Note.fromJSON);
  }

  // js/location.js
  var REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
  function requestPosition() {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("unsupported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 1e4,
        maximumAge: 5 * 60 * 1e3
        // reuse a position from the last 5 minutes
      });
    });
  }
  async function lookUpCity(latitude, longitude) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5e3);
    try {
      const url = `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) return null;
      const place = await response.json();
      const city = place.city || place.locality;
      return city ? [city, place.countryName].filter(Boolean).join(", ") : null;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }
  async function getCurrentLocation() {
    const { coords } = await requestPosition();
    const latitude = Number(coords.latitude.toFixed(4));
    const longitude = Number(coords.longitude.toFixed(4));
    const city = await lookUpCity(latitude, longitude);
    return { latitude, longitude, city };
  }
  var describeLocation = (location) => location ? location.city ?? `${location.latitude}, ${location.longitude}` : "";
  function locationErrorMessage(error) {
    if (error?.message === "unsupported") return "This browser can\u2019t share your location.";
    switch (error?.code) {
      case 1:
        return "Location access was blocked. Allow it in your browser\u2019s site settings to add a location.";
      case 2:
        return "Your location couldn\u2019t be found. Check your connection and try again.";
      case 3:
        return "Finding your location took too long. Try again.";
      default:
        return "Your location couldn\u2019t be added. Try again.";
    }
  }

  // js/ui.js
  var byId = (id) => document.getElementById(id);
  var dom = {
    app: byId("app"),
    pageTitle: byId("page-title"),
    notesView: byId("notes-view"),
    settingsView: byId("settings-view"),
    noteList: byId("note-list"),
    emptyState: byId("empty-state"),
    listIntro: byId("list-intro"),
    sidebarTags: byId("sidebar-tags"),
    mobileTags: byId("mobile-tags"),
    editorPane: byId("editor-pane"),
    actionsPane: byId("actions-pane"),
    editorPlaceholder: byId("editor-placeholder"),
    form: byId("note-form"),
    titleInput: byId("note-title"),
    tagsInput: byId("note-tags"),
    contentInput: byId("note-content"),
    editedText: byId("note-edited"),
    statusRow: byId("note-status-row"),
    locationText: byId("note-location"),
    locationButton: byId("location-button"),
    removeLocationButton: byId("remove-location-button"),
    draftStatus: byId("draft-status"),
    dialog: byId("confirm-dialog"),
    dialogTitle: byId("confirm-title"),
    dialogMessage: byId("confirm-message"),
    dialogIcon: byId("confirm-icon"),
    dialogConfirm: byId("confirm-ok"),
    dialogCancel: byId("confirm-cancel"),
    toastRegion: byId("toast-region"),
    announcer: byId("announcer")
  };
  var fields = {
    title: dom.titleInput,
    tags: dom.tagsInput
  };
  var dateFormatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  function formatDate(iso) {
    const parts = Object.fromEntries(
      dateFormatter.formatToParts(new Date(iso)).map(({ type, value }) => [type, value])
    );
    return `${parts.day} ${parts.month} ${parts.year}`;
  }
  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== void 0) element.textContent = text;
    return element;
  }
  function createIcon(name) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(svgNS, "use");
    use.setAttribute("href", `#icon-${name}`);
    svg.append(use);
    return svg;
  }
  var escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function highlightText(text, query) {
    const fragment = document.createDocumentFragment();
    const needle = query?.trim();
    if (!needle) {
      fragment.append(text);
      return fragment;
    }
    text.split(new RegExp(`(${escapeRegExp(needle)})`, "gi")).forEach((part) => {
      if (!part) return;
      fragment.append(part.toLowerCase() === needle.toLowerCase() ? createElement("mark", "", part) : part);
    });
    return fragment;
  }
  function contentSnippet(content, query) {
    const index = content.toLowerCase().indexOf(query.trim().toLowerCase());
    if (index === -1) return "";
    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + 60);
    return `${start > 0 ? "\u2026" : ""}${content.slice(start, end).replace(/\s+/g, " ")}${end < content.length ? "\u2026" : ""}`;
  }
  function renderNote(note, { isSelected = false, query = "", showStatus = true } = {}) {
    const item = createElement("li", "note-card");
    item.classList.toggle("note-card--archived", note.archived);
    const button = createElement("button", "note-card__button");
    button.type = "button";
    button.dataset.noteId = note.id;
    if (isSelected) button.setAttribute("aria-current", "true");
    const title = createElement("span", "note-card__title");
    title.append(highlightText(note.title, query));
    button.append(title);
    const snippet = query ? contentSnippet(note.content, query) : "";
    if (snippet && !note.title.toLowerCase().includes(query.trim().toLowerCase())) {
      const snippetElement = createElement("span", "note-card__snippet");
      snippetElement.append(highlightText(snippet, query));
      button.append(snippetElement);
    }
    const showArchivedChip = note.archived && showStatus;
    if (note.tags.length > 0 || showArchivedChip) {
      const chips = createElement("span", "chip-list");
      note.tags.forEach((tag) => {
        const chip = createElement("span", "chip");
        chip.append(highlightText(tag, query));
        chips.append(chip);
      });
      if (showArchivedChip) chips.append(createElement("span", "chip chip--status", "Archived"));
      button.append(chips);
    }
    const meta = createElement("span", "note-card__meta");
    const time = createElement("time", "", formatDate(note.updatedAt));
    time.dateTime = note.updatedAt;
    meta.append(time);
    if (note.location) {
      const place = createElement("span", "note-card__location");
      place.append(createIcon("pin"), describeLocation(note.location));
      meta.append(place);
    }
    button.append(meta);
    item.append(button);
    return item;
  }
  function renderDraftCard(title) {
    const item = createElement("li", "note-card note-card--draft");
    const button = createElement("button", "note-card__button");
    button.type = "button";
    button.dataset.noteId = "new";
    button.setAttribute("aria-current", "true");
    button.append(createElement("span", "note-card__title", title.trim() || "Untitled Note"));
    item.append(button);
    return item;
  }
  function updateDraftCardTitle(title) {
    const draftTitle = dom.noteList.querySelector(".note-card--draft .note-card__title");
    if (draftTitle) draftTitle.textContent = title.trim() || "Untitled Note";
  }
  function renderAllNotes(notes2, { selectedId = null, query = "", draftTitle = null, emptyMessage = null, showStatus = true } = {}) {
    const fragment = document.createDocumentFragment();
    if (draftTitle !== null) fragment.append(renderDraftCard(draftTitle));
    notes2.forEach((note) => fragment.append(renderNote(note, { isSelected: note.id === selectedId, query, showStatus })));
    dom.noteList.replaceChildren(fragment);
    const isEmpty = notes2.length === 0 && draftTitle === null;
    renderEmptyState(isEmpty ? emptyMessage : null);
  }
  function renderEmptyState(message) {
    dom.emptyState.hidden = !message;
    if (!message) return;
    const paragraph = createElement("p", "", message.text);
    if (message.action) {
      const button = createElement("button", "link-button", message.action);
      button.type = "button";
      button.dataset.action = "new-note";
      paragraph.append(button, message.after ?? "");
    }
    dom.emptyState.replaceChildren(paragraph);
  }
  function focusNoteCard(id) {
    const card = id ? dom.noteList.querySelector(`[data-note-id="${CSS.escape(id)}"]`) : dom.noteList.querySelector("[data-note-id]");
    card?.focus();
    return Boolean(card);
  }
  function updateTagList(tags, activeTag = null) {
    const build = () => {
      const fragment = document.createDocumentFragment();
      tags.forEach((tag) => {
        const item = createElement("li");
        const button = createElement("button", "nav-item");
        button.type = "button";
        button.dataset.tag = tag;
        if (tag === activeTag) button.setAttribute("aria-current", "page");
        const chevron = createIcon("chevron-right");
        chevron.classList.add("nav-item__chevron");
        button.append(createIcon("tag"), createElement("span", "", tag), chevron);
        item.append(button);
        fragment.append(item);
      });
      return fragment;
    };
    dom.sidebarTags.replaceChildren(build());
    dom.mobileTags.replaceChildren(build());
    if (tags.length === 0) {
      dom.mobileTags.replaceChildren(createElement("li", "list-pane__intro", "Tags you add to notes will appear here."));
    }
  }
  var VIEW_TITLES = {
    all: "All Notes",
    archived: "Archived Notes",
    tags: "Tags",
    settings: "Settings"
  };
  function renderHeader({ view, tag, query }) {
    const title = dom.pageTitle;
    const intro = dom.listIntro;
    let introText = "";
    if (view === "tag") {
      title.replaceChildren(createElement("span", "page-title__muted", "Notes Tagged: "), tag);
      introText = `All notes with the \u201C${tag}\u201D tag are shown here.`;
    } else if (view === "search" && query) {
      title.replaceChildren(createElement("span", "page-title__muted", "Showing results for: "), query);
      introText = `All notes matching \u201C${query}\u201D are displayed below.`;
    } else if (view === "search") {
      title.textContent = "Search";
      introText = "Search by title, content, or tags.";
    } else {
      title.textContent = VIEW_TITLES[view];
      if (view === "archived") {
        introText = "All your archived notes are stored here. You can restore or delete them anytime.";
      }
    }
    intro.textContent = introText;
    intro.hidden = !introText;
    document.title = `${title.textContent} \xB7 Notes`;
  }
  function toggleArchiveView(isArchiveView) {
    dom.app.classList.toggle("is-archive-view", isArchiveView);
  }
  function setView(view, activeTag = null) {
    dom.app.dataset.view = view;
    dom.notesView.hidden = view === "settings";
    dom.settingsView.hidden = view !== "settings";
    const isTagsTab = view === "tags";
    dom.mobileTags.hidden = !isTagsTab;
    dom.noteList.hidden = isTagsTab;
    if (isTagsTab) dom.emptyState.hidden = true;
    document.querySelectorAll("[data-nav]").forEach((button) => {
      const isCurrent = button.dataset.nav === view || view === "tag" && button.dataset.nav === "tags";
      if (isCurrent) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    document.querySelectorAll("[data-tag]").forEach((button) => {
      if (view === "tag" && button.dataset.tag === activeTag) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  }
  function setScreen(screen) {
    dom.app.dataset.screen = screen;
    fitTitleHeight();
  }
  var focusPageTitle = () => dom.pageTitle.focus();
  function fillEditor(note, values = {}) {
    const location = "location" in values ? values.location : note?.location ?? null;
    dom.titleInput.value = values.title ?? note?.title ?? "";
    dom.tagsInput.value = values.tags ?? note?.tags.join(", ") ?? "";
    dom.contentInput.value = values.content ?? note?.content ?? "";
    fitTitleHeight();
    dom.editedText.textContent = note ? formatDate(note.updatedAt) : "Not yet saved";
    dom.statusRow.hidden = !note?.archived;
    renderLocation(location);
    const noteId = note?.id ?? "new";
    dom.editorPane.dataset.noteId = noteId;
    dom.actionsPane.dataset.noteId = noteId;
    updateNoteActions(note);
    Object.keys(fields).forEach(clearValidationError);
    setDraftStatus("");
  }
  var readEditor = () => ({
    title: dom.titleInput.value,
    tags: dom.tagsInput.value,
    content: dom.contentInput.value
  });
  function showEditorPlaceholder(isVisible) {
    dom.form.hidden = isVisible;
    dom.editorPlaceholder.hidden = !isVisible;
    dom.actionsPane.hidden = isVisible;
    dom.editorPane.querySelector(".mobile-toolbar__group").hidden = isVisible;
  }
  function updateNoteActions(note) {
    const isArchived = Boolean(note?.archived);
    document.querySelectorAll("[data-requires-note]").forEach((button) => {
      button.hidden = !note;
    });
    document.querySelectorAll("[data-archive-button]").forEach((button) => {
      button.querySelector("use").setAttribute("href", isArchived ? "#icon-restore" : "#icon-archive");
      const label = button.querySelector("[data-archive-label]");
      if (label) label.textContent = isArchived ? "Restore Note" : "Archive Note";
      else button.setAttribute("aria-label", isArchived ? "Restore note" : "Archive note");
    });
  }
  function renderLocation(location) {
    dom.locationText.textContent = location ? describeLocation(location) : "Not added";
    dom.locationButton.textContent = location ? "Update" : "Add my location";
    dom.removeLocationButton.hidden = !location;
  }
  function setLocationBusy(isBusy) {
    dom.locationButton.setAttribute("aria-busy", String(isBusy));
    dom.locationButton.setAttribute("aria-disabled", String(isBusy));
    if (isBusy) dom.locationText.textContent = "Finding your location\u2026";
  }
  var focusTitleInput = () => dom.titleInput.focus();
  var supportsFieldSizing = CSS.supports("field-sizing", "content");
  function fitTitleHeight() {
    if (supportsFieldSizing) return;
    const title = dom.titleInput;
    title.style.height = "";
    if (title.scrollHeight > 0) title.style.height = `${title.scrollHeight}px`;
  }
  var setDraftStatus = (text) => {
    dom.draftStatus.textContent = text;
  };
  function showValidationError(field, message) {
    const input = fields[field];
    const errorElement = byId(`${input.id}-error`);
    errorElement.textContent = message;
    errorElement.hidden = false;
    input.setAttribute("aria-invalid", "true");
  }
  function clearValidationError(field) {
    const input = fields[field];
    const errorElement = byId(`${input.id}-error`);
    errorElement.textContent = "";
    errorElement.hidden = true;
    input.removeAttribute("aria-invalid");
  }
  var focusField = (field) => fields[field].focus();
  function setSaveEnabled(isEnabled) {
    document.querySelectorAll("[data-save-button]").forEach((button) => {
      button.setAttribute("aria-disabled", String(!isEnabled));
    });
  }
  function renderSettings(panel, preferences) {
    document.querySelectorAll("[data-panel]").forEach((section) => {
      section.hidden = section.dataset.panel !== panel;
    });
    document.querySelectorAll("[data-settings-panel]").forEach((button) => {
      if (button.dataset.settingsPanel === panel) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    document.querySelectorAll('input[name="theme"]').forEach((radio) => {
      radio.checked = radio.value === preferences.theme;
    });
    document.querySelectorAll('input[name="font"]').forEach((radio) => {
      radio.checked = radio.value === preferences.font;
    });
  }
  function focusSettingsPanel(panel) {
    document.querySelector(`[data-panel="${panel}"] .settings-panel__title`)?.focus();
  }
  var TOAST_DURATION = 5e3;
  function showToast(message, { type = "success", link } = {}) {
    const toast = createElement("div", `toast toast--${type}`);
    const icon = createIcon(type === "error" ? "status" : "check");
    icon.classList.add("toast__icon");
    toast.append(icon, createElement("p", "toast__message", message));
    if (link) {
      const linkButton = createElement("button", "link-button toast__action", link.label);
      linkButton.type = "button";
      linkButton.dataset.nav = link.nav;
      toast.append(linkButton);
    }
    const close = createElement("button", "icon-button");
    close.type = "button";
    close.setAttribute("aria-label", "Dismiss notification");
    close.append(createIcon("close"));
    close.addEventListener("click", () => toast.remove());
    toast.append(close);
    while (dom.toastRegion.children.length >= 3) dom.toastRegion.firstElementChild.remove();
    dom.toastRegion.append(toast);
    let timer = setTimeout(() => toast.remove(), TOAST_DURATION);
    const pause = () => clearTimeout(timer);
    const resume = () => {
      timer = setTimeout(() => toast.remove(), TOAST_DURATION);
    };
    toast.addEventListener("mouseenter", pause);
    toast.addEventListener("mouseleave", resume);
    toast.addEventListener("focusin", pause);
    toast.addEventListener("focusout", resume);
  }
  function announce(message) {
    dom.announcer.textContent = "";
    setTimeout(() => {
      dom.announcer.textContent = message;
    }, 50);
  }
  function confirmDialog({ title, message, confirmLabel, icon = "trash", tone = "danger" }) {
    const opener = document.activeElement;
    dom.dialogTitle.textContent = title;
    dom.dialogMessage.textContent = message;
    dom.dialogConfirm.textContent = confirmLabel;
    dom.dialogIcon.setAttribute("href", `#icon-${icon}`);
    dom.dialog.classList.toggle("modal--danger", tone === "danger");
    dom.dialogConfirm.classList.toggle("btn--danger", tone === "danger");
    dom.dialogConfirm.classList.toggle("btn--primary", tone !== "danger");
    dom.dialog.returnValue = "";
    dom.dialog.showModal();
    dom.dialogCancel.focus();
    return new Promise((resolve) => {
      dom.dialog.addEventListener("close", () => {
        if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
        resolve(dom.dialog.returnValue === "confirm");
      }, { once: true });
    });
  }
  dom.dialog.addEventListener("click", (event) => {
    if (event.target === dom.dialog) dom.dialog.close("cancel");
  });
  var isDialogOpen = () => dom.dialog.open;

  // js/themes.js
  var THEMES = ["light", "dark", "system"];
  var FONTS = ["sans", "serif", "mono"];
  var root = document.documentElement;
  var systemDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var resolveTheme = (themeName) => themeName === "system" ? systemDarkQuery.matches ? "dark" : "light" : themeName;
  function swapRootClass(prefix, value) {
    [...root.classList].filter((className) => className.startsWith(prefix)).forEach((className) => root.classList.remove(className));
    root.classList.add(prefix + value);
  }
  var applyTheme = (themeName) => {
    const name = THEMES.includes(themeName) ? themeName : "system";
    const resolved = resolveTheme(name);
    swapRootClass("theme-", resolved);
    root.dataset.themePreference = name;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolved === "dark" ? "#0e121b" : "#ffffff");
  };
  var applyFont = (fontName) => {
    swapRootClass("font-", FONTS.includes(fontName) ? fontName : "sans");
  };
  var watchSystemTheme = (getCurrentTheme) => {
    systemDarkQuery.addEventListener("change", () => {
      if (getCurrentTheme() === "system") applyTheme("system");
    });
  };

  // js/validation.js
  var RULES = Object.freeze({
    titleMin: 3,
    titleMax: 80,
    maxTags: 8,
    tagMax: 24
  });
  var TAG_PATTERN = /^[\p{L}\p{N} _-]+$/u;
  function validateTitle(title) {
    const value = title.trim();
    if (!value) return "Give your note a title.";
    if (value.length < RULES.titleMin) return `Use at least ${RULES.titleMin} characters for the title.`;
    if (value.length > RULES.titleMax) return `Keep the title under ${RULES.titleMax} characters.`;
    return "";
  }
  function validateTags(tagText) {
    const tags = parseTags(tagText);
    if (tags.length > RULES.maxTags) return `Use ${RULES.maxTags} tags or fewer.`;
    const tooLong = tags.find((tag) => tag.length > RULES.tagMax);
    if (tooLong) return `\u201C${tooLong}\u201D is too long. Keep each tag under ${RULES.tagMax} characters.`;
    const invalid = tags.find((tag) => !TAG_PATTERN.test(tag));
    if (invalid) return `\u201C${invalid}\u201D can only contain letters, numbers, spaces, - and _.`;
    return "";
  }
  var validateNoteForm = ({ title, tags }) => ({
    title: validateTitle(title),
    tags: validateTags(tags)
  });
  var isFormValid = (errors) => Object.values(errors).every((message) => !message);

  // js/main.js
  var desktopQuery = window.matchMedia("(min-width: 68em)");
  var isDesktop = () => desktopQuery.matches;
  var state = {
    view: "all",
    // 'all' | 'archived' | 'tag' | 'search' | 'tags' | 'settings'
    activeTag: null,
    // set when view === 'tag'
    query: "",
    // set when view === 'search'
    selectedId: null,
    // id of the note open in the editor
    isCreating: false,
    // true while writing a brand-new note
    screen: "list",
    // phones/tablets: 'list' or 'detail'
    settingsPanel: "color",
    preferences: loadPreferences(),
    // What's currently loaded in the editor form
    editor: {
      noteKey: null,
      // note id, or 'new'
      location: null,
      // location attached in the form (saved on "Save Note")
      isDirty: false,
      // unsaved changes?
      touched: /* @__PURE__ */ new Set()
      // fields the user has left at least once (for blur validation)
    }
  };
  var EMPTY_MESSAGES = {
    all: { text: "You don\u2019t have any notes yet. Start a new note to capture your thoughts and ideas." },
    archived: { text: "No notes have been archived yet. Move notes here for safekeeping, or ", action: "create a new note", after: "." },
    tag: { text: "No notes found with this tag. Try another tag or ", action: "create a new note", after: "." },
    search: { text: "No notes match your search. Try a different keyword or ", action: "create a new note", after: "." }
  };
  function getVisibleNotes() {
    switch (state.view) {
      case "archived":
        return getNotes({ archived: true });
      case "tag":
        return filterByTag(state.activeTag);
      case "search":
        return state.query ? searchNotes(state.query) : getNotes({ archived: false });
      default:
        return getNotes({ archived: false });
    }
  }
  function render({ refreshEditor = false } = {}) {
    const notes2 = getVisibleNotes();
    const selectionIsVisible = notes2.some((note) => note.id === state.selectedId);
    if (!state.isCreating && !state.editor.isDirty && !selectionIsVisible) {
      state.selectedId = notes2[0]?.id ?? null;
    }
    setView(state.view, state.activeTag);
    setScreen(state.screen);
    renderHeader({ view: state.view, tag: state.activeTag, query: state.query });
    toggleArchiveView(state.view === "archived");
    updateTagList(getAllTags(), state.activeTag);
    renderEditor(refreshEditor);
    renderAllNotes(notes2, {
      selectedId: state.isCreating ? null : state.selectedId,
      query: state.view === "search" ? state.query : "",
      draftTitle: state.isCreating ? readEditor().title : null,
      emptyMessage: EMPTY_MESSAGES[state.view] ?? EMPTY_MESSAGES.all,
      showStatus: state.view !== "archived"
    });
  }
  function renderEditor(force) {
    const key = state.isCreating ? "new" : state.selectedId;
    if (!key) {
      state.editor.noteKey = null;
      showEditorPlaceholder(true);
      return;
    }
    showEditorPlaceholder(false);
    if (force || key !== state.editor.noteKey) {
      loadIntoEditor(key === "new" ? null : getNoteById(key));
    }
  }
  function loadIntoEditor(note, values = {}, dirty = false) {
    fillEditor(note, values);
    state.editor = {
      noteKey: note?.id ?? "new",
      location: "location" in values ? values.location : note?.location ?? null,
      isDirty: dirty,
      touched: /* @__PURE__ */ new Set()
    };
    refreshSaveButton();
  }
  function refreshSaveButton() {
    const errors = validateNoteForm(readEditor());
    setSaveEnabled(isFormValid(errors));
    return errors;
  }
  function showFieldError(field, message) {
    if (message) showValidationError(field, message);
    else clearValidationError(field);
  }
  var draftTimer;
  function scheduleDraftSave() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      const result = saveDraft({
        noteId: state.isCreating ? null : state.selectedId,
        ...readEditor(),
        location: state.editor.location,
        savedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      setDraftStatus(result.ok ? "Draft saved" : "");
    }, 400);
  }
  function discardDraft() {
    clearTimeout(draftTimer);
    clearDraft();
  }
  function restoreDraft() {
    const draft = loadDraft();
    if (!draft) return;
    const note = draft.noteId ? getNoteById(draft.noteId) : null;
    if (draft.noteId && !note) {
      discardDraft();
      return;
    }
    state.isCreating = !note;
    if (note) {
      state.selectedId = note.id;
      if (note.archived) state.view = "archived";
    }
    state.screen = "detail";
    render();
    loadIntoEditor(note, {
      title: draft.title,
      tags: draft.tags,
      content: draft.content,
      location: draft.location ?? null
    }, true);
    updateDraftCardTitle(draft.title);
    setDraftStatus("Draft restored");
    showToast("Your unsaved draft was restored.");
  }
  async function confirmDiscardChanges() {
    if (!state.editor.isDirty) return true;
    const confirmed = await confirmDialog({
      title: "Discard changes?",
      message: "This note has changes that haven\u2019t been saved. If you continue, they will be lost.",
      confirmLabel: "Discard changes",
      icon: "status"
    });
    if (confirmed) {
      discardDraft();
      state.editor.isDirty = false;
    }
    return confirmed;
  }
  async function startNewNote() {
    if (!await confirmDiscardChanges()) return;
    if (["archived", "settings", "tags"].includes(state.view)) state.view = "all";
    state.isCreating = true;
    state.screen = "detail";
    render({ refreshEditor: true });
    if (state.view === "tag") loadIntoEditor(null, { tags: state.activeTag });
    focusTitleInput();
  }
  async function selectNote(id) {
    if (id === "new") {
      focusTitleInput();
      return;
    }
    const isDifferentNote = id !== state.selectedId || state.isCreating;
    if (isDifferentNote && !await confirmDiscardChanges()) return;
    state.isCreating = false;
    state.selectedId = id;
    state.screen = "detail";
    render();
    if (!isDesktop()) document.getElementById("editor-pane").focus();
  }
  function handleNoteSubmit(event) {
    event.preventDefault();
    const values = readEditor();
    const errors = validateNoteForm(values);
    Object.entries(errors).forEach(([field, message]) => {
      state.editor.touched.add(field);
      showFieldError(field, message);
    });
    if (!isFormValid(errors)) {
      const firstInvalid = Object.keys(errors).find((field) => errors[field]);
      focusField(firstInvalid);
      announce(errors[firstInvalid]);
      return;
    }
    const tags = parseTags(values.tags);
    try {
      if (state.isCreating) {
        const note = createNote(values.title, values.content, tags, { location: state.editor.location });
        state.isCreating = false;
        state.selectedId = note.id;
      } else {
        updateNote(state.selectedId, {
          title: values.title,
          content: values.content,
          tags,
          location: state.editor.location
        });
      }
    } catch (error) {
      reportError(error);
      return;
    }
    state.editor.isDirty = false;
    if (!getVisibleNotes().some((note) => note.id === state.selectedId)) {
      goToView("all");
    }
    discardDraft();
    render({ refreshEditor: true });
    showToast("Note saved successfully!");
  }
  function cancelEdit() {
    discardDraft();
    state.editor.isDirty = false;
    if (state.isCreating) {
      state.isCreating = false;
      state.screen = "list";
      render({ refreshEditor: true });
      if (!focusNoteCard(state.selectedId)) focusPageTitle();
    } else {
      render({ refreshEditor: true });
      announce("Changes discarded.");
    }
  }
  async function handleToggleArchive(noteId) {
    const note = getNoteById(noteId);
    if (!note) return;
    if (!await confirmDiscardChanges()) return;
    if (!note.archived) {
      const confirmed = await confirmDialog({
        title: "Archive Note",
        message: "Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.",
        confirmLabel: "Archive Note",
        icon: "archive",
        tone: "neutral"
      });
      if (!confirmed) return;
    }
    try {
      toggleArchive(noteId);
    } catch (error) {
      reportError(error);
      return;
    }
    afterNoteLeftList(noteId);
    if (note.archived) {
      showToast("Note archived.", { link: { label: "Archived Notes", nav: "archived" } });
    } else {
      showToast("Note restored to active notes.", { link: { label: "All Notes", nav: "all" } });
    }
  }
  async function handleDelete(noteId) {
    const confirmed = await confirmDialog({
      title: "Delete Note",
      message: "Are you sure you want to permanently delete this note? This action cannot be undone.",
      confirmLabel: "Delete Note",
      icon: "trash",
      tone: "danger"
    });
    if (!confirmed) return;
    try {
      deleteNote(noteId);
    } catch (error) {
      reportError(error);
      return;
    }
    afterNoteLeftList(noteId);
    showToast("Note permanently deleted.");
  }
  function afterNoteLeftList(noteId) {
    discardDraft();
    state.editor.isDirty = false;
    render({ refreshEditor: true });
    const stillVisible = getVisibleNotes().some((note) => note.id === noteId);
    if (!stillVisible && state.screen === "detail") {
      state.screen = "list";
      setScreen("list");
    }
    if (!focusNoteCard(state.selectedId)) focusPageTitle();
  }
  async function addLocation(button) {
    if (button.getAttribute("aria-busy") === "true") return;
    setLocationBusy(true);
    try {
      const location = await getCurrentLocation();
      state.editor.location = location;
      renderLocation(location);
      markEditorDirty();
      announce(`Location added: ${describeLocation(location)}. Save the note to keep it.`);
    } catch (error) {
      renderLocation(state.editor.location);
      showToast(locationErrorMessage(error), { type: "error" });
    } finally {
      setLocationBusy(false);
    }
  }
  function removeLocation() {
    state.editor.location = null;
    renderLocation(null);
    markEditorDirty();
    announce("Location removed. Save the note to keep this change.");
  }
  function markEditorDirty() {
    state.editor.isDirty = true;
    refreshSaveButton();
    scheduleDraftSave();
  }
  function goToView(view) {
    state.view = view;
    state.activeTag = null;
    state.screen = "list";
    if (view !== "search") {
      state.query = "";
      document.querySelectorAll("[data-search-input]").forEach((input) => {
        input.value = "";
      });
    }
  }
  async function navigate(view) {
    if (!await confirmDiscardChanges()) return;
    if (state.view === "settings" && view !== "settings") applySavedPreferences();
    state.isCreating = false;
    goToView(view === "tags" && isDesktop() ? "all" : view);
    render();
    if (view === "settings") {
      renderSettings(state.settingsPanel, state.preferences);
    }
    if (view === "search") {
      document.getElementById(isDesktop() ? "search-desktop" : "search-mobile").focus();
    } else {
      focusPageTitle();
    }
  }
  async function selectTag(tag) {
    if (!await confirmDiscardChanges()) return;
    state.isCreating = false;
    goToView("tag");
    state.activeTag = tag;
    render();
    focusPageTitle();
    announce(`${getVisibleNotes().length} notes tagged ${tag}.`);
  }
  function goBack() {
    if (state.view === "settings") {
      state.screen = "list";
      setScreen("list");
      document.querySelector(`[data-settings-panel="${state.settingsPanel}"]`)?.focus();
      return;
    }
    confirmDiscardChanges().then((confirmed) => {
      if (!confirmed) return;
      const openedId = state.selectedId;
      state.isCreating = false;
      state.screen = "list";
      render({ refreshEditor: true });
      if (!focusNoteCard(openedId)) focusPageTitle();
    });
  }
  var announceTimer;
  function handleSearchInput(event) {
    const rawQuery = event.target.value;
    document.querySelectorAll("[data-search-input]").forEach((input) => {
      if (input !== event.target) input.value = rawQuery;
    });
    state.query = rawQuery.trim();
    if (state.query) {
      state.view = "search";
      state.activeTag = null;
    } else if (state.view === "search" && isDesktop()) {
      state.view = "all";
    }
    state.screen = "list";
    render();
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => {
      if (!state.query) return;
      const count = getVisibleNotes().length;
      announce(count === 0 ? "No notes match your search." : `${count} ${count === 1 ? "note" : "notes"} found.`);
    }, 600);
  }
  function applySavedPreferences() {
    applyTheme(state.preferences.theme);
    applyFont(state.preferences.font);
  }
  function openSettingsPanel(panel) {
    state.settingsPanel = panel;
    state.screen = "detail";
    setScreen("detail");
    renderSettings(panel, state.preferences);
    focusSettingsPanel(panel);
  }
  function handlePreferencePreview(event) {
    if (event.target.name === "theme") applyTheme(event.target.value);
    if (event.target.name === "font") applyFont(event.target.value);
  }
  function handlePreferenceSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updated = { ...state.preferences, ...Object.fromEntries(formData) };
    const result = savePreferences(updated);
    if (!result.ok) {
      showToast("Settings couldn\u2019t be saved in this browser.", { type: "error" });
      return;
    }
    state.preferences = updated;
    applySavedPreferences();
    showToast("Settings updated successfully!");
  }
  function exportNotes2() {
    const blob = new Blob([exportNotes()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notes-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    showToast("Notes downloaded.");
  }
  async function importNotes2(event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const count = importNotes(data);
      render({ refreshEditor: !state.editor.isDirty });
      showToast(`${count} ${count === 1 ? "note" : "notes"} loaded from ${file.name}.`);
    } catch (error) {
      const message = error instanceof SyntaxError ? "That file isn\u2019t a valid notes backup (.json)." : error.message;
      showToast(message, { type: "error" });
    } finally {
      input.value = "";
    }
  }
  async function resetNotes() {
    const confirmed = await confirmDialog({
      title: "Reset notes",
      message: "This replaces all your notes with the 10 example notes from the design. Download a backup first if you want to keep them.",
      confirmLabel: "Reset notes",
      icon: "restore"
    });
    if (!confirmed) return;
    try {
      resetToSampleNotes();
    } catch (error) {
      reportError(error);
      return;
    }
    discardDraft();
    state.editor.isDirty = false;
    state.selectedId = null;
    render({ refreshEditor: true });
    showToast("Notes reset to the Figma examples.");
  }
  function reportError(error) {
    if (error instanceof NoteStorageError) {
      showToast(error.message, { type: "error" });
    } else {
      console.error(error);
      showToast("Something went wrong. Your last change wasn\u2019t saved.", { type: "error" });
    }
  }
  var isTypingTarget = (element) => element.closest('input, textarea, [contenteditable="true"]');
  function bindEvents() {
    const noteList = document.getElementById("note-list");
    const form = document.getElementById("note-form");
    const actions = {
      "new-note": () => startNewNote(),
      "toggle-archive": (noteId) => handleToggleArchive(noteId),
      "delete": (noteId) => handleDelete(noteId),
      "cancel-edit": () => cancelEdit(),
      "go-back": () => goBack(),
      "add-location": (_noteId, button) => addLocation(button),
      "remove-location": () => removeLocation(),
      "export-notes": () => exportNotes2(),
      "reset-notes": () => resetNotes()
    };
    document.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action]");
      if (actionButton) {
        const noteId = actionButton.closest("[data-note-id]")?.dataset.noteId;
        actions[actionButton.dataset.action]?.(noteId, actionButton);
        return;
      }
      const navButton = event.target.closest("[data-nav]");
      if (navButton) return navigate(navButton.dataset.nav);
      const tagButton = event.target.closest("[data-tag]");
      if (tagButton) return selectTag(tagButton.dataset.tag);
      const panelButton = event.target.closest("[data-settings-panel]");
      if (panelButton) return openSettingsPanel(panelButton.dataset.settingsPanel);
    });
    noteList.addEventListener("click", (event) => {
      const card = event.target.closest("[data-note-id]");
      if (card) selectNote(card.dataset.noteId);
    });
    noteList.addEventListener("keydown", (event) => {
      const cards = [...noteList.querySelectorAll("[data-note-id]")];
      const index = cards.indexOf(document.activeElement);
      if (index === -1) return;
      const targets = {
        ArrowDown: cards[index + 1],
        ArrowUp: cards[index - 1],
        Home: cards[0],
        End: cards[cards.length - 1]
      };
      if (event.key in targets) {
        event.preventDefault();
        targets[event.key]?.focus();
      }
    });
    form.addEventListener("submit", handleNoteSubmit);
    form.addEventListener("input", (event) => {
      if (event.target.name === "title") {
        const title = event.target;
        if (title.value.includes("\n")) title.value = title.value.replace(/\s*\n+\s*/g, " ");
        fitTitleHeight();
      }
      state.editor.isDirty = true;
      const errors = refreshSaveButton();
      state.editor.touched.forEach((field) => showFieldError(field, errors[field]));
      if (event.target.name === "title" && state.isCreating) updateDraftCardTitle(event.target.value);
      scheduleDraftSave();
    });
    form.addEventListener("focusout", (event) => {
      const field = event.target.name;
      if (field !== "title" && field !== "tags") return;
      state.editor.touched.add(field);
      showFieldError(field, validateNoteForm(readEditor())[field]);
    });
    form.addEventListener("keydown", (event) => {
      const isTitleEnter = event.key === "Enter" && event.target.name === "title" && !event.shiftKey;
      if (isTitleEnter || event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        form.requestSubmit();
      }
      if (event.key === "Escape" && !isDialogOpen()) {
        event.stopPropagation();
        cancelEdit();
      }
    });
    document.querySelectorAll("[data-search-input]").forEach((input) => {
      input.addEventListener("input", handleSearchInput);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && input.value) {
          event.stopPropagation();
          input.value = "";
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    });
    ["color-form", "font-form"].forEach((id) => {
      const settingsForm = document.getElementById(id);
      settingsForm.addEventListener("change", handlePreferencePreview);
      settingsForm.addEventListener("submit", handlePreferenceSubmit);
    });
    document.getElementById("import-file").addEventListener("change", importNotes2);
    document.addEventListener("keydown", (event) => {
      if (isDialogOpen()) return;
      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        if (isDesktop()) document.getElementById("search-desktop").focus();
        else navigate("search");
      }
      if (event.key === "Escape" && !isDesktop() && state.screen === "detail") {
        goBack();
      }
    });
    window.addEventListener("storage", (event) => {
      if (event.key !== NOTES_KEY) return;
      reloadNotes();
      render();
    });
    desktopQuery.addEventListener("change", () => {
      if (isDesktop() && state.view === "tags") goToView("all");
      render();
    });
    watchSystemTheme(() => state.preferences.theme);
  }
  function init() {
    applySavedPreferences();
    initNotes();
    bindEvents();
    render();
    restoreDraft();
  }
  init();
})();
