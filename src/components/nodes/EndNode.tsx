import { Handle, Position, type NodeProps } from 'reactflow';
import type { EndNodeData } from '../../types/workflow';

export default function EndNode({ data, selected }: NodeProps<EndNodeData>) {
  const c = 'var(--node-end)';
  return (
    <div className="wf-node" style={{
      background: 'var(--node-end-bg)',
      borderColor: selected ? c : 'var(--border-default)',
      padding: '14px 16px',
      minWidth: 210,
      boxShadow: selected ? 'var(--shadow-node-selected)' : 'var(--shadow-node)',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: c, border: '2px solid var(--bg-card)', top: -5 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `rgba(251,113,133,0.1)`,
          border: `1.5px solid rgba(251,113,133,0.2)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="2.5" y="2.5" width="11" height="11" rx="5.5" stroke={c} strokeWidth="1.3"/>
            <rect x="5.5" y="5.5" width="5" height="5" rx="2" fill={c}/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontSize: 9, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: c, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Complete</span>
            <div style={{ flex: 1, height: 1, background: `rgba(251,113,133,0.15)` }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {data.endMessage?.slice(0, 28) || 'End of Workflow'}{(data.endMessage?.length ?? 0) > 28 ? '…' : ''}
          </div>
        </div>
      </div>
      {data.summaryFlag && (
        <div style={{ marginTop: 8, paddingTop: 7, borderTop: '1px solid rgba(251,113,133,0.1)', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: c }}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M4 8h8M4 5h8M4 11h5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Summary report enabled
        </div>
      )}
    </div>
  );
}