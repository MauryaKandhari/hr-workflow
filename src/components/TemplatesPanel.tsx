import { useEffect, useState } from 'react';
import { getTemplates } from '../api/mockApi';
import type { WorkflowTemplate } from '../types/workflow';

interface TemplatesPanelProps {
  onLoad: (template: { nodes: any[]; edges: any[] }) => void;
  onClose: () => void;
}

export default function TemplatesPanel({ onLoad, onClose }: TemplatesPanelProps) {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    getTemplates().then(t => { setTemplates(t); setLoading(false); });
  }, []);

  const TEMPLATE_ICONS: Record<string, JSX.Element> = {
    employee_onboarding: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    leave_approval: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 16l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  const TEMPLATE_COLORS: Record<string, string> = {
    employee_onboarding: '#22c55e',
    leave_approval: '#60a5fa',
  };

  const TEMPLATE_TAGS: Record<string, string[]> = {
    employee_onboarding: ['5 nodes', 'HR', 'Onboarding'],
    leave_approval: ['4 nodes', 'HR', 'Approval'],
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 201,
        width: 520,
        maxHeight: '80vh',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeUp 0.2s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-elevated)',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--accent-subtle)',
            border: '1px solid var(--border-default)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="var(--accent)" strokeWidth="1.3"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="var(--accent)" strokeWidth="1.3"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="var(--accent)" strokeWidth="1.3"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="var(--accent)" strokeWidth="1.3"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
              Workflow Templates
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
              Start from a pre-built workflow or build from scratch
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer',
              width: 28, height: 28, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, lineHeight: 1,
              transition: 'background 0.12s, color 0.12s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite', marginBottom: 10, display: 'block', margin: '0 auto 10px' }}>
                <circle cx="8" cy="8" r="6" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="20 8"/>
              </svg>
              <div style={{ fontSize: 13 }}>Loading templates…</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {templates.map(template => {
                const color = TEMPLATE_COLORS[template.id] || 'var(--accent)';
                const tags = TEMPLATE_TAGS[template.id] || [];
                const isHovered = hovered === template.id;
                return (
                  <div
                    key={template.id}
                    onMouseEnter={() => setHovered(template.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      background: isHovered ? 'var(--bg-hover)' : 'var(--bg-surface)',
                      border: `1px solid ${isHovered ? color + '60' : 'var(--border-subtle)'}`,
                      borderRadius: 12,
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      transform: isHovered ? 'translateY(-2px)' : 'none',
                      boxShadow: isHovered ? `0 8px 24px rgba(0,0,0,0.2)` : 'none',
                    }}
                    onClick={() => onLoad(template)}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: color + '15',
                      border: `1.5px solid ${color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color, marginBottom: 12,
                    }}>
                      {TEMPLATE_ICONS[template.id] || (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 5 }}>
                      {template.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 12 }}>
                      {template.description}
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: 10, padding: '2px 7px', borderRadius: 4,
                          background: color + '12', color,
                          fontWeight: 600, letterSpacing: '0.03em',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Blank canvas card */}
              <div
                onMouseEnter={() => setHovered('blank')}
                onMouseLeave={() => setHovered(null)}
                onClick={onClose}
                style={{
                  background: hovered === 'blank' ? 'var(--bg-hover)' : 'var(--bg-surface)',
                  border: `1px dashed ${hovered === 'blank' ? 'var(--border-strong)' : 'var(--border-default)'}`,
                  borderRadius: 12,
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  transform: hovered === 'blank' ? 'translateY(-2px)' : 'none',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
                  minHeight: 160,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--bg-elevated)',
                  border: '1.5px solid var(--border-default)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', marginBottom: 12,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 5 }}>
                  Blank Canvas
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Start from scratch with an empty canvas
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}