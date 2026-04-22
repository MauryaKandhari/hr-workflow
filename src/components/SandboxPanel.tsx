import type { SimulationResult, SimulationStatus } from '../types/workflow';

const STATUS_CONFIG: Record<SimulationStatus, { bg: string; color: string; label: string }> = {
  success: { bg: 'rgba(16,185,129,0.08)',  color: '#10b981', label: 'Completed' },
  pending: { bg: 'rgba(245,158,11,0.08)',  color: '#f59e0b', label: 'Pending'   },
  error:   { bg: 'rgba(244,63,94,0.08)',   color: '#f43f5e', label: 'Failed'    },
  skipped: { bg: 'rgba(113,113,122,0.08)', color: '#71717a', label: 'Skipped'   },
};

const NODE_TYPE_LABELS: Record<string, string> = {
  start: 'Trigger', task: 'Task', approval: 'Approval', automated: 'Automated', end: 'Complete',
};

interface SandboxPanelProps {
  isSimulating: boolean;
  result: SimulationResult | null;
  onClose: () => void;
  onRun: () => void;
}

export default function SandboxPanel({ isSimulating, result, onClose, onRun }: SandboxPanelProps) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 16, left: '50%',
      transform: 'translateX(-50%)',
      width: 540,
      maxHeight: 400,
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
      zIndex: 100,
      animation: 'fadeIn 0.2s ease',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--bg-card)',
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="5" width="12" height="8" rx="1.5" stroke="var(--text-secondary)" strokeWidth="1.3"/>
          <path d="M5 5V3.5a3 3 0 016 0V5" stroke="var(--text-secondary)" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: '-0.01em' }}>Simulation Sandbox</div>
        </div>
        {result && (
          <div style={{
            fontSize: 11, fontWeight: 600,
            color: result.success ? '#10b981' : '#f43f5e',
            background: result.success ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
            border: '1px solid ' + (result.success ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'),
            borderRadius: 4, padding: '2px 8px',
          }}>
            {result.success ? 'Passed' : 'Failed'}
          </div>
        )}
        <button className="btn btn-secondary btn-sm" onClick={onRun} disabled={isSimulating}>
          {isSimulating ? 'Running…' : 'Re-run'}
        </button>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 4px', lineHeight: 1, fontSize: 16 }}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>

        {isSimulating && (
          <div style={{ padding: '28px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ marginBottom: 10 }}>
              <svg width="28" height="28" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="8" cy="8" r="6" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="20 8"/>
              </svg>
            </div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Simulating workflow</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Validating nodes and connections…</div>
          </div>
        )}

        {!isSimulating && !result && (
          <div style={{ padding: '28px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none" style={{ marginBottom: 10, display: 'block', margin: '0 auto 10px' }}>
              <path d="M4 3l10 5-10 5V3z" stroke="var(--text-tertiary)" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontSize: 13, fontWeight: 500 }}>No simulation run yet</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Click Run Simulation to test your workflow</div>
          </div>
        )}

        {!isSimulating && result && (
          <div className="animate-fade-in">
            {/* Errors */}
            {result.errors.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {result.errors.map((err, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', marginBottom: 6,
                    background: 'rgba(244,63,94,0.06)',
                    border: '1px solid rgba(244,63,94,0.15)',
                    borderRadius: 7, fontSize: 12,
                    color: '#f43f5e',
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="8" cy="8" r="6.5" stroke="#f43f5e" strokeWidth="1.2"/>
                      <path d="M8 5v3.5M8 11v.5" stroke="#f43f5e" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    {err}
                  </div>
                ))}
              </div>
            )}

            {/* Summary row */}
            {result.steps.length > 0 && (
              <div style={{
                display: 'flex', gap: 16, marginBottom: 14, fontSize: 12, color: 'var(--text-muted)',
                padding: '8px 0', borderBottom: '1px solid var(--border)',
              }}>
                <span>{result.totalSteps} steps</span>
                <span style={{ color: '#10b981' }}>{result.completedSteps} completed</span>
                <span>{result.duration}ms</span>
              </div>
            )}

            {/* Steps timeline */}
            {result.steps.map((step, i) => {
              const s = STATUS_CONFIG[step.status];
              return (
                <div key={step.nodeId} style={{ display: 'flex', gap: 12, marginBottom: 2 }}>
                  {/* Line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: s.bg,
                      border: '1px solid ' + s.color + '40',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: s.color,
                      fontFamily: 'Geist Mono, monospace',
                    }}>{i + 1}</div>
                    {i < result.steps.length - 1 && (
                      <div style={{ flex: 1, width: 1, background: 'var(--border)', margin: '3px 0' }} />
                    )}
                  </div>

                  {/* Card */}
                  <div style={{
                    flex: 1,
                    padding: '8px 12px',
                    marginBottom: 6,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {NODE_TYPE_LABELS[step.nodeType] || step.nodeType}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                        {step.title}
                      </span>
                      <span style={{
                        marginLeft: 'auto', fontSize: 10, fontWeight: 600,
                        background: s.bg, color: s.color,
                        borderRadius: 4, padding: '1px 6px',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{step.message}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 4, fontFamily: 'Geist Mono, monospace' }}>
                      {step.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}