/**
 * validation.js
 * ----------------------------------------------------------------------------
 * Pure functions: they take the form values and return error messages.
 * An empty string means "this field is fine". No DOM code in here, which
 * makes the rules easy to read (and easy to test).
 */

import { parseTags } from './noteManager.js';

export const RULES = Object.freeze({
  titleMin: 3,
  titleMax: 80,
  maxTags: 8,
  tagMax: 24,
});

const TAG_PATTERN = /^[\p{L}\p{N} _-]+$/u; // letters (any language), numbers, space, _ and -

export function validateTitle(title) {
  const value = title.trim();
  if (!value) return 'Give your note a title.';
  if (value.length < RULES.titleMin) return `Use at least ${RULES.titleMin} characters for the title.`;
  if (value.length > RULES.titleMax) return `Keep the title under ${RULES.titleMax} characters.`;
  return '';
}

export function validateTags(tagText) {
  const tags = parseTags(tagText);

  if (tags.length > RULES.maxTags) return `Use ${RULES.maxTags} tags or fewer.`;

  const tooLong = tags.find((tag) => tag.length > RULES.tagMax);
  if (tooLong) return `“${tooLong}” is too long. Keep each tag under ${RULES.tagMax} characters.`;

  const invalid = tags.find((tag) => !TAG_PATTERN.test(tag));
  if (invalid) return `“${invalid}” can only contain letters, numbers, spaces, - and _.`;

  return '';
}

/**
 * Validates the whole note form.
 * @returns {{ title: string, tags: string }} one message per field ('' = valid)
 */
export const validateNoteForm = ({ title, tags }) => ({
  title: validateTitle(title),
  tags: validateTags(tags),
});

export const isFormValid = (errors) => Object.values(errors).every((message) => !message);
