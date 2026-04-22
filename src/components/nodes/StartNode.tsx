import { Handle, Position, type NodeProps } from 'reactflow';
import type { StartNodeData } from '../../types/workflow';

export default function StartNode({ data, selected }: NodeProps<StartNodeData>) {
  const c = 'var(--node-start)';
  return (
    <div className="wf-node" style={{
      background: 'var(--node-start-bg)',
      borderColor: selected ? c : 'var(--border-default)',
      padding: '14px 16px',
      minWidth: 210,
      boxShadow: selected ? 'var(--shadow-node-selected)' : 'var(--shadow-node)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `rgba(34,197,94,0.1)`,
          border: `1.5px solid rgba(34,197,94,0.2)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3.5" fill={c}/>
            <circle cx="8" cy="8" r="7" stroke={c} strokeWidth="0.8" strokeOpacity="0.4"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontSize: 9, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: c, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trigger</span>
            <div style={{ flex: 1, height: 1, background: `rgba(34,197,94,0.15)` }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.title}</div>
        </div>
      </div>
      {data.metadata.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid rgba(34,197,94,0.1)`, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {data.metadata.slice(0, 3).map((m, i) => (
            <span key={i} style={{ fontSize: 10, background: `rgba(34,197,94,0.07)`, color: 'var(--node-start)', borderRadius: 4, padding: '1px 6px', fontFamily: 'JetBrains Mono, monospace' }}>
              {m.key}
            </span>
          ))}
          {data.metadata.length > 3 && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{data.metadata.length - 3}</span>}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: c, border: '2px solid var(--bg-card)', bottom: -5 }} />
    </div>
  );
}