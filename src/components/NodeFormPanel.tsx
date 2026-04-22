import { useEffect, useState } from 'react';
import type { AutomationAction } from '../types/workflow';
import { getAutomations } from '../api/mockApi';
import type {
  WorkflowNodeData, StartNodeData, TaskNodeData,
  ApprovalNodeData, AutomatedNodeData, EndNodeData, KeyValuePair,
} from '../types/workflow';

// ── Key-Value Editor ────────────────────────────────────────────────────────────
function KVEditor({ pairs, onChange }: { pairs: KeyValuePair[]; onChange: (p: KeyValuePair[]) => void }) {
  const add = () => onChange([...pairs, { key: '', value: '' }]);
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'key' | 'value', val: string) =>
    onChange(pairs.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  return (
    <div>
      {pairs.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <input className="form-input" placeholder="Key" value={p.key} onChange={e => update(i, 'key', e.target.value)} style={{ flex: 1 }} />
          <input className="form-input" placeholder="Value" value={p.value} onChange={e => update(i, 'value', e.target.value)} style={{ flex: 1 }} />
          <button className="btn btn-danger btn-sm" onClick={() => remove(i)} style={{ flexShrink: 0, padding: '5px 9px' }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      ))}
      <button className="btn btn-secondary btn-sm" onClick={add} style={{ width: '100%', marginTop: 2, justifyContent: 'center' }}>
        + Add Field
      </button>
    </div>
  );
}

// ── Forms ───────────────────────────────────────────────────────────────────────
function StartForm({ data, onUpdate }: { data: StartNodeData; onUpdate: (d: Partial<StartNodeData>) => void }) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input className="form-input" value={data.title} onChange={e => onUpdate({ title: e.target.value })} placeholder="e.g. Employee Onboarding" />
      </div>
      <div className="form-group">
        <label className="form-label">Metadata Fields</label>
        <KVEditor pairs={data.metadata} onChange={metadata => onUpdate({ metadata })} />
      </div>
    </>
  );
}

function TaskForm({ data, onUpdate }: { data: TaskNodeData; onUpdate: (d: Partial<TaskNodeData>) => void }) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Title <span style={{ color: 'var(--red)' }}>*</span></label>
        <input className="form-input" value={data.title} onChange={e => onUpdate({ title: e.target.value })} placeholder="Task title" />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-input" value={data.description} onChange={e => onUpdate({ description: e.target.value })} placeholder="Describe the task…" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="form-group">
          <label className="form-label">Assignee</label>
          <input className="form-input" value={data.assignee} onChange={e => onUpdate({ assignee: e.target.value })} placeholder="Name or team" />
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input className="form-input" type="date" value={data.dueDate} onChange={e => onUpdate({ dueDate: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Custom Fields</label>
        <KVEditor pairs={data.customFields} onChange={customFields => onUpdate({ customFields })} />
      </div>
    </>
  );
}

function ApprovalForm({ data, onUpdate }: { data: ApprovalNodeData; onUpdate: (d: Partial<ApprovalNodeData>) => void }) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input className="form-input" value={data.title} onChange={e => onUpdate({ title: e.target.value })} placeholder="Approval step name" />
      </div>
      <div className="form-group">
        <label className="form-label">Approver Role</label>
        <select className="form-input" value={data.approverRole} onChange={e => onUpdate({ approverRole: e.target.value })}>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="VP">VP</option>
          <option value="CEO">CEO</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Auto-Approve Threshold (%)</label>
        <input
          className="form-input" type="number" min={0} max={100}
          value={data.autoApproveThreshold}
          onChange={e => onUpdate({ autoApproveThreshold: Number(e.target.value) })}
          placeholder="0 = disabled"
        />
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5, lineHeight: 1.5 }}>
          Scores above this threshold will be auto-approved.
        </div>
      </div>
    </>
  );
}

function AutomatedForm({ data, onUpdate }: { data: AutomatedNodeData; onUpdate: (d: Partial<AutomatedNodeData>) => void }) {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const selectedAction = automations.find(a => a.id === data.actionId);

  useEffect(() => { getAutomations().then(setAutomations); }, []);

  const handleActionChange = (id: string) => onUpdate({ actionId: id, actionParams: {} });
  const handleParamChange = (param: string, value: string) =>
    onUpdate({ actionParams: { ...data.actionParams, [param]: value } });

  return (
    <>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input className="form-input" value={data.title} onChange={e => onUpdate({ title: e.target.value })} placeholder="Step title" />
      </div>
      <div className="form-group">
        <label className="form-label">Action</label>
        <select className="form-input" value={data.actionId} onChange={e => handleActionChange(e.target.value)}>
          <option value="">Select an action…</option>
          {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </div>
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="form-group">
          <label className="form-label">Parameters</label>
          {selectedAction.params.map(param => (
            <div key={param} style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 500 }}>{param}</label>
              <input
                className="form-input"
                value={data.actionParams[param] || ''}
                onChange={e => handleParamChange(param, e.target.value)}
                placeholder={param}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function EndForm({ data, onUpdate }: { data: EndNodeData; onUpdate: (d: Partial<EndNodeData>) => void }) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Completion Message</label>
        <textarea className="form-input" value={data.endMessage} onChange={e => onUpdate({ endMessage: e.target.value })} placeholder="e.g. Onboarding complete!" />
      </div>
      <div className="form-group">
        <label className="form-label">Generate Summary Report</label>
        <div
          onClick={() => onUpdate({ summaryFlag: !data.summaryFlag })}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            background: 'var(--bg-primary)', border: '1px solid var(--border-light)',
            borderRadius: 7, padding: '8px 11px',
            transition: 'border-color 0.15s',
          }}
        >
          <div style={{
            width: 34, height: 18, borderRadius: 9,
            background: data.summaryFlag ? 'var(--accent)' : 'var(--border-light)',
            transition: 'background 0.2s', position: 'relative', flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: 2, left: data.summaryFlag ? 18 : 2,
              width: 14, height: 14, borderRadius: '50%', background: 'white',
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </div>
          <span style={{ fontSize: 12.5, color: data.summaryFlag ? 'var(--accent)' : 'var(--text-secondary)' }}>
            {data.summaryFlag ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
    </>
  );
}

// ── Panel config ────────────────────────────────────────────────────────────────
const PANEL_META: Record<string, { label: string; color: string }> = {
  start:     { label: 'Trigger',        color: '#10b981' },
  task:      { label: 'Task',           color: '#0ea5e9' },
  approval:  { label: 'Approval',       color: '#f59e0b' },
  automated: { label: 'Automated Step', color: '#8b5cf6' },
  end:       { label: 'Complete',       color: '#f43f5e' },
};

interface NodeFormPanelProps {
  data: WorkflowNodeData;
  nodeId: string;
  onUpdate: (id: string, d: Partial<WorkflowNodeData>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function NodeFormPanel({ data, nodeId, onUpdate, onDelete, onClose }: NodeFormPanelProps) {
  const meta = PANEL_META[data.type] || PANEL_META.task;
  const update = (partial: Partial<WorkflowNodeData>) => onUpdate(nodeId, partial);

  return (
    <div className="animate-slide-in" style={{
      width: 296,
      background: 'var(--bg-secondary)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '13px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--bg-card)',
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: meta.color, flexShrink: 0,
          boxShadow: '0 0 6px ' + meta.color,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: meta.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 1 }}>
            {meta.label}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Geist Mono, monospace' }}>
            {nodeId.slice(0, 20)}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 4px', fontSize: 18, lineHeight: 1 }}
        >×</button>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {data.type === 'start'     && <StartForm     data={data as StartNodeData}     onUpdate={update as any} />}
        {data.type === 'task'      && <TaskForm      data={data as TaskNodeData}      onUpdate={update as any} />}
        {data.type === 'approval'  && <ApprovalForm  data={data as ApprovalNodeData}  onUpdate={update as any} />}
        {data.type === 'automated' && <AutomatedForm data={data as AutomatedNodeData} onUpdate={update as any} />}
        {data.type === 'end'       && <EndForm       data={data as EndNodeData}       onUpdate={update as any} />}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-danger" onClick={onDelete} style={{ width: '100%', justifyContent: 'center', gap: 7 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Remove Node
        </button>
      </div>
    </div>
  );
}