import { useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

interface ToolbarProps {
  nodeCount: number;
  edgeCount: number;
  onRunSimulation: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onClear: () => void;
  onToggleSandbox: () => void;
  onToggleTemplates: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSimulating: boolean;
  showSandbox: boolean;
}

export default function Toolbar({
  nodeCount, edgeCount,
  onRunSimulation, onExport, onImport, onClear,
  onToggleSandbox, onToggleTemplates,
  onUndo, onRedo, canUndo, canRedo,
  isSimulating, showSandbox,
}: ToolbarProps) {
  const { theme, toggleTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <header style={{
      height: 54,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 8,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 4 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h3l2-5 2 10 2-5h3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 13.5, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Workflow Designer
          </div>
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Tredence Studio
          </div>
        </div>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border-subtle)', margin: '0 4px' }} />

      {/* Undo/Redo */}
      <div style={{ display: 'flex', gap: 2 }}>
        <button className="btn btn-ghost btn-sm" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" style={{ padding: '5px 8px' }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 7H11C13.2 7 15 8.8 15 11C15 13.2 13.2 15 11 15H7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M6 4L3 7L6 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)" style={{ padding: '5px 8px' }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M13 7H5C2.8 7 1 8.8 1 11C1 13.2 2.8 15 5 15H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M10 4L13 7L10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
        <span title="Nodes">{nodeCount} nodes</span>
        <span title="Connections">{edgeCount} edges</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Actions */}
      <button className="btn btn-ghost btn-sm" onClick={onToggleTemplates} title="Templates">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        </svg>
        Templates
      </button>

      <button
        className="btn btn-ghost btn-sm"
        onClick={onToggleSandbox}
        style={{ color: showSandbox ? 'var(--accent)' : undefined }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M5 5V3.5a3 3 0 016 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        Sandbox
      </button>

      <button className="btn btn-ghost btn-sm" onClick={onExport} title="Export JSON">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v9M5 8l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 13h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        Export
      </button>

      <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()} title="Import JSON">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M8 11V2M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 13h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        Import
      </button>
      <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) { onImport(f); e.target.value = ''; } }}
      />

      <button className="btn btn-ghost btn-sm" onClick={onClear} title="Clear canvas">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        Clear
      </button>

      <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />

      {/* Theme toggle */}
      <button
        className="btn btn-ghost btn-sm"
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        style={{ padding: '5px 8px' }}
      >
        {theme === 'dark' ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 8.5A6 6 0 117 2a4.5 4.5 0 006.5 6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      <button
        className="btn btn-primary btn-sm"
        onClick={onRunSimulation}
        disabled={isSimulating}
        style={{ minWidth: 120, justifyContent: 'center' }}
      >
        {isSimulating ? (
          <>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" strokeDasharray="20 8"/>
            </svg>
            Running…
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M4 3l10 5-10 5V3z" fill="white"/>
            </svg>
            Run Simulation
          </>
        )}
      </button>
    </header>
  );
}