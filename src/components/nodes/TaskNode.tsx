import { Handle, Position, type NodeProps } from 'reactflow';
import type { TaskNodeData } from '../../types/workflow';

const PRIORITY_COLORS: Record<string, string> = {
  high: '#fb7185', medium: 'var(--accent)', low: '#22c55e',
};

export default function TaskNode({ data, selected }: NodeProps<TaskNodeData>) {
  const c = 'var(--node-task)';
  const pc = PRIORITY_COLORS[data.priority || 'medium'];
  return (
    <div className="wf-node" style={{
      background: 'var(--node-task-bg)',
      borderColor: selected ? c : 'var(--border-default)',
      padding: '14px 16px',
      minWidth: 220,
      boxShadow: selected ? 'var(--shadow-node-selected)' : 'var(--shadow-node)',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: c, border: '2px solid var(--bg-card)', top: -5 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: (data.assignee || data.dueDate) ? 10 : 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `rgba(96,165,250,0.1)`,
          border: `1.5px solid rgba(96,165,250,0.2)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2.5" stroke={c} strokeWidth="1.3"/>
            <path d="M5 8h6M5 5.5h6M5 10.5h4" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontSize: 9, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: c, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Task</span>
            <div style={{ flex: 1, height: 1, background: `rgba(96,165,250,0.15)` }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: pc, flexShrink: 0 }} title={`Priority: ${data.priority}`} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.title}</div>
        </div>
      </div>

      {(data.assignee || data.dueDate) && (
        <div style={{ borderTop: '1px solid rgba(96,165,250,0.1)', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.assignee && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.assignee}</span>
            </div>
          )}
          {data.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              {data.dueDate}
            </div>
          )}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: c, border: '2px solid var(--bg-card)', bottom: -5 }} />
    </div>
  );
}