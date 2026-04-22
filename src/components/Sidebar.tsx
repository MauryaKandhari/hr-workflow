const NODE_DEFS = [
  { type: 'start',     label: 'Trigger',       description: 'Workflow entry point',    color: 'var(--node-start)',    accentRgb: '34,197,94' },
  { type: 'task',      label: 'Task',           description: 'Human task or action',   color: 'var(--node-task)',     accentRgb: '96,165,250' },
  { type: 'approval',  label: 'Approval',       description: 'Sign-off required',      color: 'var(--node-approval)', accentRgb: '251,191,36' },
  { type: 'automated', label: 'Automated',      description: 'System action',          color: 'var(--node-auto)',     accentRgb: '192,132,252' },
  { type: 'end',       label: 'Complete',       description: 'End of workflow',        color: 'var(--node-end)',      accentRgb: '251,113,133' },
];

const NodePreview = ({ type, color, accentRgb }: { type: string; color: string; accentRgb: string }) => {
  const icons: Record<string, JSX.Element> = {
    start: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3.5" fill={color}/><circle cx="8" cy="8" r="7" stroke={color} strokeWidth="0.8" strokeOpacity="0.4"/></svg>,
    task: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2.5" stroke={color} strokeWidth="1.3"/><path d="M5 8h6M5 5.5h6M5 10.5h4" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>,
    approval: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 4.5L6.5 11.5L3 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    automated: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="8" r="3" stroke={color} strokeWidth="1.3"/><circle cx="8" cy="8" r="1" fill={color}/></svg>,
    end: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="2.5" width="11" height="11" rx="5.5" stroke={color} strokeWidth="1.3"/><rect x="5.5" y="5.5" width="5" height="5" rx="2" fill={color}/></svg>,
  };
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: `rgba(${accentRgb},0.1)`,
      border: `1.5px solid rgba(${accentRgb},0.2)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {icons[type]}
    </div>
  );
};

interface SidebarProps {
  onDragStart: (e: React.DragEvent, type: string) => void;
}

export default function Sidebar({ onDragStart }: SidebarProps) {
  return (
    <aside style={{
      width: 220,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px 16px',
      gap: 5,
      flexShrink: 0,
    }}>
      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 9, fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.12em',
        marginBottom: 8, paddingLeft: 2,
      }}>
        Components
      </div>

      {NODE_DEFS.map(def => (
        <div
          key={def.type}
          draggable
          onDragStart={e => onDragStart(e, def.type)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10,
            padding: '10px 12px',
            cursor: 'grab',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            userSelect: 'none',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = `rgba(${def.accentRgb},0.4)`;
            el.style.background = 'var(--bg-elevated)';
            el.style.transform = 'translateX(2px)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = 'var(--border-subtle)';
            el.style.background = 'var(--bg-card)';
            el.style.transform = '';
          }}
        >
          <NodePreview type={def.type} color={def.color} accentRgb={def.accentRgb} />
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{def.label}</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>{def.description}</div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <div style={{
          padding: '10px 12px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            How to use
          </div>
          Drag nodes onto the canvas and connect them via their handles.
        </div>
      </div>
    </aside>
  );
}