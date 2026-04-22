import { Handle, Position, type NodeProps } from 'reactflow';
import type { ApprovalNodeData } from '../../types/workflow';

export default function ApprovalNode({ data, selected }: NodeProps<ApprovalNodeData>) {
  const c = 'var(--node-approval)';
  return (
    <div className="wf-node" style={{
      background: 'var(--node-approval-bg)',
      borderColor: selected ? c : 'var(--border-default)',
      padding: '14px 16px',
      minWidth: 220,
      boxShadow: selected ? 'var(--shadow-node-selected)' : 'var(--shadow-node)',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: c, border: '2px solid var(--bg-card)', top: -5 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: data.approverRole ? 10 : 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `rgba(251,191,36,0.1)`,
          border: `1.5px solid rgba(251,191,36,0.2)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 4.5L6.5 11.5L3 8" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontSize: 9, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: c, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Approval</span>
            <div style={{ flex: 1, height: 1, background: `rgba(251,191,36,0.15)` }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.title}</div>
        </div>
      </div>
      {data.approverRole && (
        <div style={{ borderTop: '1px solid rgba(251,191,36,0.1)', paddingTop: 8, display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 10.5, background: `rgba(251,191,36,0.1)`, color: 'var(--node-approval)', borderRadius: 5, padding: '2px 8px', fontWeight: 600 }}>
            {data.approverRole}
          </span>
          {data.autoApproveThreshold > 0 && (
            <span style={{ fontSize: 10.5, background: `rgba(251,191,36,0.06)`, color: 'var(--text-secondary)', borderRadius: 5, padding: '2px 8px', fontWeight: 500 }}>
              Auto {data.autoApproveThreshold}%
            </span>
          )}
          {data.requiresComment && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Comment req.</span>
          )}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: c, border: '2px solid var(--bg-card)', bottom: -5 }} />
    </div>
  );
}