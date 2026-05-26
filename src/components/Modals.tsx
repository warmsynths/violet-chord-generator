import { useEffect, useState } from 'react';
import {
  CONTROL_BINDING_ITEMS,
  MODIFIER_BINDING_ROWS,
  PIANO_BLACK_BINDINGS,
  PIANO_WHITE_BINDINGS,
  formatKeyLabel,
  normalizeKeyboardKey,
} from '../constants/keyboard';
import type { KeyboardAction } from '../types';
import './Modals.css';

interface StartOverlayProps {
  visible: boolean;
  isReopened: boolean;
  keyBindings: Record<KeyboardAction, string>;
  onKeyBindingChange: (action: KeyboardAction, key: string) => void;
  onStart: () => void;
  onClose: () => void;
}

export function StartOverlay({ visible, isReopened, keyBindings, onKeyBindingChange, onStart, onClose }: StartOverlayProps) {
  const [listeningAction, setListeningAction] = useState<KeyboardAction | null>(null);

  useEffect(() => {
    if (!visible) {
      setListeningAction(null);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || !listeningAction) return;

    const handleRebind = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        setListeningAction(null);
        return;
      }

      onKeyBindingChange(listeningAction, normalizeKeyboardKey(e.key));
      setListeningAction(null);
    };

    window.addEventListener('keydown', handleRebind, true);
    return () => window.removeEventListener('keydown', handleRebind, true);
  }, [visible, listeningAction, onKeyBindingChange]);

  if (!visible) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className={`start-overlay ${isReopened ? 'reopened' : ''}`} onClick={isReopened ? handleClose : undefined}>
      <div className="tutorial-card" onClick={e => e.stopPropagation()}>
        {isReopened && (
          <button className="tutorial-close" onClick={handleClose}>×</button>
        )}
        <h1>Violet</h1>
        <div className="tutorial-rebind-hint">Click any key cap to remap. Press Esc to cancel capture.</div>
        
        {/* All controls in one compact card */}
        <div className="tutorial-content">
          {/* Chord Modifiers */}
          <div className="tutorial-row">
            {MODIFIER_BINDING_ROWS.map((row) => (
              <div key={row.label} className="modifier-group">
                <span className="row-label">{row.label}</span>
                <div className="modifier-row">
                  {row.actions.map(({ action, label }) => (
                    <div key={action} className="mod-key">
                      <button
                        type="button"
                        className={`mod-key-cap rebind-key ${listeningAction === action ? 'is-listening' : ''}`}
                        onClick={() => setListeningAction(action)}
                      >
                        {listeningAction === action ? '...' : formatKeyLabel(keyBindings[action])}
                      </button>
                      <div className="mod-key-label">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Piano Keys */}
          <div className="tutorial-row piano-row">
            <span className="row-label">Notes</span>
            <div className="piano-visual">
              <div className="piano-container">
                {PIANO_WHITE_BINDINGS.map(({ action, note }) => (
                  <div key={action} className="piano-white-key">
                    <button
                      type="button"
                      className={`key-computer rebind-key ${listeningAction === action ? 'is-listening' : ''}`}
                      onClick={() => setListeningAction(action)}
                    >
                      {listeningAction === action ? '...' : formatKeyLabel(keyBindings[action])}
                    </button>
                    <span className="key-note">{note}</span>
                  </div>
                ))}
                {PIANO_BLACK_BINDINGS.map(({ action, note, left }) => (
                  <div key={action} className="piano-black-key" style={{ left: `${left}px` }}>
                    <button
                      type="button"
                      className={`key-computer rebind-key ${listeningAction === action ? 'is-listening' : ''}`}
                      onClick={() => setListeningAction(action)}
                    >
                      {listeningAction === action ? '...' : formatKeyLabel(keyBindings[action])}
                    </button>
                    <span className="key-note">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Other Controls - compact grid */}
          <div className="tutorial-row controls-row">
            {CONTROL_BINDING_ITEMS.map(({ actions, label }) => (
              <div key={label} className="control-item">
                <div className="control-keys">
                  {actions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      className={`ctrl-key rebind-key ${listeningAction === action ? 'is-listening' : ''}`}
                      onClick={() => setListeningAction(action)}
                    >
                      {listeningAction === action ? '...' : formatKeyLabel(keyBindings[action])}
                    </button>
                  ))}
                </div>
                <span className="control-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {!isReopened && (
          <button className="start-btn" onClick={onStart}>Click to Start</button>
        )}
      </div>
    </div>
  );
}

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AboutModal({ visible, onClose }: AboutModalProps) {
  return (
    <div className={`about-modal ${visible ? 'visible' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="about-content">
        <button className="about-close" onClick={onClose}>×</button>
        <h2>About Violet</h2>
        <p>I discovered the incredible <strong><a href="https://telepathicinstruments.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#e8a832', textDecoration: 'none' }}>Telepathic Instruments Orchid</a></strong> and immediately fell in love with its design and concept. Unfortunately, I found out about it too late—they were sold out, and I couldn't get my hands on one.</p>
        <p>Rather than wait idly for the next batch, I decided to build Violet as a web-based tribute. I tried to capture as much of the Orchid's magic as possible: the chord generation, the performance modes, the beautiful interface design, and that special feeling of creative flow.</p>
        <p>This project is a labor of love and deep admiration for what the team at <a href="https://telepathicinstruments.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#e8a832', textDecoration: 'none' }}>Telepathic Instruments</a> has created. I'm a huge fan of their work and would be absolutely thrilled to collaborate or chat about music technology sometime.</p>
        <p><em>(And I really hope you're not mad at me for making this! I'm just trying to spread the joy while I wait for the next sale. 🙏)</em></p>
        <div className="signature">— Built with respect and admiration, <a href="https://natesiggard.com" target="_blank" rel="noopener noreferrer" style={{ color: '#e8a832', textDecoration: 'none' }}>@natesiggard</a></div>
        <div style={{ marginTop: 16, fontSize: '0.75rem', color: '#666' }}>© 2025 <a href="https://getauthentic.com" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>Authentic Creative</a></div>
      </div>
    </div>
  );
}

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
  keyBindings: Record<KeyboardAction, string>;
}

export function HelpModal({ visible, onClose, keyBindings }: HelpModalProps) {
  const keysFor = (actions: KeyboardAction[]) => actions.map((action) => formatKeyLabel(keyBindings[action])).join(' ');

  return (
    <div className={`modal-overlay ${visible ? 'visible' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Keyboard Controls</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-section">
          <h3>Play Notes</h3>
          <ul>
            <li><kbd>{keysFor(['noteC', 'noteD', 'noteE', 'noteF', 'noteG', 'noteA', 'noteB'])}</kbd> White keys (C D E F G A B)</li>
            <li><kbd>{keysFor(['noteCSharp', 'noteDSharp', 'noteFSharp', 'noteGSharp', 'noteASharp'])}</kbd> Black keys</li>
          </ul>
        </div>
        <div className="modal-section">
          <h3>Chord Types (hold)</h3>
          <ul>
            <li><kbd>{formatKeyLabel(keyBindings.chordDim)}</kbd> Dim &nbsp; <kbd>{formatKeyLabel(keyBindings.chordMin)}</kbd> Min &nbsp; <kbd>{formatKeyLabel(keyBindings.chordMaj)}</kbd> Maj &nbsp; <kbd>{formatKeyLabel(keyBindings.chordSus)}</kbd> Aug</li>
          </ul>
        </div>
        <div className="modal-section">
          <h3>Extensions (hold)</h3>
          <ul>
            <li><kbd>{formatKeyLabel(keyBindings.ext6)}</kbd> 6th &nbsp; <kbd>{formatKeyLabel(keyBindings.extm7)}</kbd> m7 &nbsp; <kbd>{formatKeyLabel(keyBindings.extM7)}</kbd> M7 &nbsp; <kbd>{formatKeyLabel(keyBindings.ext9)}</kbd> 9th</li>
          </ul>
        </div>
        <div className="modal-section">
          <h3>Controls</h3>
          <ul>
            <li><kbd>{keysFor(['voicingDown', 'voicingUp'])}</kbd> Voicing (0-60)</li>
            <li><kbd>{keysFor(['octaveDown', 'octaveUp'])}</kbd> Octave</li>
            <li><kbd>{keysFor(['bpmDown', 'bpmUp'])}</kbd> BPM</li>
            <li><kbd>{formatKeyLabel(keyBindings.loopToggle)}</kbd> Toggle Loop</li>
            <li><kbd>{keysFor(['patternPrev', 'patternNext'])}</kbd> Drum Pattern</li>
            <li><kbd>{formatKeyLabel(keyBindings.panic)}</kbd> Panic</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function RotateOverlay() {
  return (
    <div className="rotate-overlay active">
      <div className="rotate-icon">📱</div>
      <h2>Rotate Your Device</h2>
      <p>Violet works best in landscape mode. Please rotate your phone for the full experience.</p>
    </div>
  );
}

