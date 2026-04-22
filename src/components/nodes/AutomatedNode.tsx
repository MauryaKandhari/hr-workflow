import { Handle, Position, type NodeProps } from 'reactflow';
import type { AutomatedNodeData } from '../../types/workflow';

export default function AutomatedNode({ data, selected }: NodeProps<AutomatedNodeData>) {
  const c = 'var(--node-auto)';
  return (
    <div className="wf-node" style={{
      background: 'var(--node-auto-bg)',
      borderColor: selected ? c : 'var(--border-default)',
      padding: '14px 16px',
      minWidth: 220,
      boxShadow: selected ? 'var(--shadow-node-selected)' : 'var(--shadow-node)',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: c, border: '2px solid var(--bg-card)', top: -5 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: data.actionId ? 10 : 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `rgba(192,132,252,0.1)`,
          border: `1.5px solid rgba(192,132,252,0.2)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          position: 'relative',
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="8" cy="8" r="3" stroke={c} strokeWidth="1.3"/>
            <circle cx="8" cy="8" r="1" fill={c}/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontSize: 9, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: c, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Auto</span>
            <div style={{ flex: 1, height: 1, background: `rgba(192,132,252,0.15)` }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.title}</div>
        </div>
      </div>
      {data.actionId && (
        <div style={{ borderTop: '1px solid rgba(192,132,252,0.1)', paddingTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M4 3l10 5-10 5V3z" fill={c} opacity="0.6"/>
            </svg>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: c, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {data.actionId}
            </span>
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: c, border: '2px solid var(--bg-card)', bottom: -5 }} />
    </div>
  );
}