import type { ChordType, Extension, KeyboardAction, KeyboardNoteAction } from '../types';

export const KEYBIND_STORAGE_KEY = 'violet.keybindings.v1';
export const KEYBIND_VERSION_STORAGE_KEY = 'violet.keybindings.version';
export const KEYBIND_VERSION = 2;

export const NOTE_ACTION_TO_SEMITONE: Record<KeyboardNoteAction, number> = {
  noteC: 0,
  noteCSharp: 1,
  noteD: 2,
  noteDSharp: 3,
  noteE: 4,
  noteF: 5,
  noteFSharp: 6,
  noteG: 7,
  noteGSharp: 8,
  noteA: 9,
  noteASharp: 10,
  noteB: 11,
};

export const CHORD_ACTION_TO_TYPE: Record<'chordDim' | 'chordMin' | 'chordMaj' | 'chordSus', ChordType> = {
  chordDim: 0,
  chordMin: 1,
  chordMaj: 2,
  chordSus: 3,
};

export const EXT_ACTION_TO_EXTENSION: Record<'ext6' | 'extm7' | 'extM7' | 'ext9', Extension> = {
  ext6: '6',
  extm7: 'm7',
  extM7: 'M7',
  ext9: '9',
};

export const CHORD_ACTIONS: Array<keyof typeof CHORD_ACTION_TO_TYPE> = ['chordDim', 'chordMin', 'chordMaj', 'chordSus'];
export const EXT_ACTIONS: Array<keyof typeof EXT_ACTION_TO_EXTENSION> = ['ext6', 'extm7', 'extM7', 'ext9'];

export const DEFAULT_KEY_BINDINGS: Record<KeyboardAction, string> = {
  chordDim: '1',
  chordMin: '2',
  chordMaj: '3',
  chordSus: '4',
  ext6: '5',
  extm7: '6',
  extM7: '7',
  ext9: '8',
  noteC: 'a',
  noteD: 's',
  noteE: 'd',
  noteF: 'f',
  noteG: 'g',
  noteA: 'h',
  noteB: 'j',
  noteCSharp: 'w',
  noteDSharp: 'e',
  noteFSharp: 't',
  noteGSharp: 'y',
  noteASharp: 'u',
  voicingDown: 'z',
  voicingUp: 'x',
  octaveDown: '[',
  octaveUp: ']',
  bpmDown: '-',
  bpmUp: '=',
  loopToggle: 'l',
  patternPrev: ',',
  patternNext: '.',
  panic: 'space',
};

const ALL_ACTIONS = Object.keys(DEFAULT_KEY_BINDINGS) as KeyboardAction[];

export function normalizeKeyboardKey(key: string): string {
  if (key === ' ') return 'space';
  return key.toLowerCase();
}

export function formatKeyLabel(key: string): string {
  if (key === 'space') return 'Space';
  if (key.length === 1) return key.toUpperCase();
  return key;
}

export function loadKeyBindings(): Record<KeyboardAction, string> {
  if (typeof window === 'undefined') return DEFAULT_KEY_BINDINGS;

  try {
    const storedVersion = window.localStorage.getItem(KEYBIND_VERSION_STORAGE_KEY);
    if (storedVersion !== String(KEYBIND_VERSION)) {
      saveKeyBindings(DEFAULT_KEY_BINDINGS);
      return DEFAULT_KEY_BINDINGS;
    }

    const rawValue = window.localStorage.getItem(KEYBIND_STORAGE_KEY);
    if (!rawValue) return DEFAULT_KEY_BINDINGS;

    const parsed = JSON.parse(rawValue) as Partial<Record<KeyboardAction, unknown>>;
    const merged = { ...DEFAULT_KEY_BINDINGS };

    for (const action of ALL_ACTIONS) {
      const value = parsed[action];
      if (typeof value === 'string' && value.trim().length > 0) {
        merged[action] = normalizeKeyboardKey(value);
      }
    }

    return merged;
  } catch {
    return DEFAULT_KEY_BINDINGS;
  }
}

export function saveKeyBindings(bindings: Record<KeyboardAction, string>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEYBIND_STORAGE_KEY, JSON.stringify(bindings));
  window.localStorage.setItem(KEYBIND_VERSION_STORAGE_KEY, String(KEYBIND_VERSION));
}

export const MODIFIER_BINDING_ROWS = [
  {
    label: 'Chords',
    actions: [
      { action: 'chordDim', label: 'Dim' },
      { action: 'chordMin', label: 'Min' },
      { action: 'chordMaj', label: 'Maj' },
      { action: 'chordSus', label: 'Aug' },
    ] as const,
  },
  {
    label: 'Ext',
    actions: [
      { action: 'ext6', label: '6th' },
      { action: 'extm7', label: 'm7' },
      { action: 'extM7', label: 'M7' },
      { action: 'ext9', label: '9th' },
    ] as const,
  },
] as const;

export const PIANO_WHITE_BINDINGS = [
  { action: 'noteC', note: 'C' },
  { action: 'noteD', note: 'D' },
  { action: 'noteE', note: 'E' },
  { action: 'noteF', note: 'F' },
  { action: 'noteG', note: 'G' },
  { action: 'noteA', note: 'A' },
  { action: 'noteB', note: 'B' },
] as const;

export const PIANO_BLACK_BINDINGS = [
  { action: 'noteCSharp', note: 'C#', left: 25 },
  { action: 'noteDSharp', note: 'D#', left: 62 },
  { action: 'noteFSharp', note: 'F#', left: 137 },
  { action: 'noteGSharp', note: 'G#', left: 175 },
  { action: 'noteASharp', note: 'A#', left: 212 },
] as const;

export const CONTROL_BINDING_ITEMS = [
  { actions: ['voicingDown', 'voicingUp'], label: 'Voicing' },
  { actions: ['octaveDown', 'octaveUp'], label: 'Octave' },
  { actions: ['bpmDown', 'bpmUp'], label: 'BPM' },
  { actions: ['loopToggle'], label: 'Loop' },
  { actions: ['patternPrev', 'patternNext'], label: 'Patterns' },
  { actions: ['panic'], label: 'Panic' },
] as const satisfies ReadonlyArray<{ actions: KeyboardAction[]; label: string }>;
