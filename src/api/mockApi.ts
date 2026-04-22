import type { AutomationAction, SimulationResult, SimulationStep, WorkflowNodeData } from '../types/workflow';
import type { Node, Edge } from 'reactflow';

const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'], category: 'Communication' },
  { id: 'send_slack', label: 'Send Slack Message', params: ['channel', 'message'], category: 'Communication' },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'], category: 'Documents' },
  { id: 'generate_pdf', label: 'Generate PDF Report', params: ['template', 'data_source'], category: 'Documents' },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary', 'priority'], category: 'Project Management' },
  { id: 'update_hrms', label: 'Update HRMS Record', params: ['employee_id', 'field', 'value'], category: 'HR Systems' },
  { id: 'trigger_webhook', label: 'Trigger Webhook', params: ['url', 'method', 'payload'], category: 'Integration' },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'date', 'subject'], category: 'Calendar' },
  { id: 'send_sms', label: 'Send SMS Notification', params: ['phone', 'message'], category: 'Communication' },
  { id: 'update_confluence', label: 'Update Confluence Page', params: ['space', 'page_title', 'content'], category: 'Documentation' },
];

const MOCK_TEMPLATES = [
  {
    id: 'employee_onboarding',
    name: 'Employee Onboarding',
    description: 'Full onboarding workflow for new hires',
    nodes: [
      { id: 'n1', type: 'start', position: { x: 300, y: 80 }, data: { type: 'start', title: 'New Hire Trigger', metadata: [{ key: 'department', value: 'Engineering' }] } },
      { id: 'n2', type: 'task', position: { x: 300, y: 220 }, data: { type: 'task', title: 'Collect Documents', description: 'Gather all required onboarding documents', assignee: 'HR Team', dueDate: '', priority: 'high', customFields: [] } },
      { id: 'n3', type: 'approval', position: { x: 300, y: 380 }, data: { type: 'approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 0, requiresComment: false } },
      { id: 'n4', type: 'automated', position: { x: 300, y: 530 }, data: { type: 'automated', title: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'new_hire@company.com', subject: 'Welcome to the Team!' } } },
      { id: 'n5', type: 'end', position: { x: 300, y: 680 }, data: { type: 'end', endMessage: 'Onboarding complete! Welcome aboard.', summaryFlag: true } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: true },
      { id: 'e2', source: 'n2', target: 'n3', animated: true },
      { id: 'e3', source: 'n3', target: 'n4', animated: true },
      { id: 'e4', source: 'n4', target: 'n5', animated: true },
    ],
  },
  {
    id: 'leave_approval',
    name: 'Leave Approval',
    description: 'Standard leave request and approval flow',
    nodes: [
      { id: 'n1', type: 'start', position: { x: 300, y: 80 }, data: { type: 'start', title: 'Leave Request Submitted', metadata: [] } },
      { id: 'n2', type: 'approval', position: { x: 300, y: 240 }, data: { type: 'approval', title: 'Manager Review', approverRole: 'Manager', autoApproveThreshold: 0, requiresComment: true } },
      { id: 'n3', type: 'automated', position: { x: 300, y: 400 }, data: { type: 'automated', title: 'Notify Employee', actionId: 'send_email', actionParams: { to: 'employee@company.com', subject: 'Leave Status Update' } } },
      { id: 'n4', type: 'end', position: { x: 300, y: 550 }, data: { type: 'end', endMessage: 'Leave request processed.', summaryFlag: false } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: true },
      { id: 'e2', source: 'n2', target: 'n3', animated: true },
      { id: 'e3', source: 'n3', target: 'n4', animated: true },
    ],
  },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(250);
  return MOCK_AUTOMATIONS;
}

export async function getTemplates() {
  await delay(200);
  return MOCK_TEMPLATES;
}

export async function simulateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Promise<SimulationResult> {
  await delay(1200);

  const errors: string[] = [];
  const warnings: string[] = [];

  const startNodes = nodes.filter(n => n.data.type === 'start');
  const endNodes = nodes.filter(n => n.data.type === 'end');

  if (startNodes.length === 0) errors.push('Workflow must have a Start/Trigger node.');
  if (startNodes.length > 1) errors.push('Only one Start node is allowed.');
  if (endNodes.length === 0) errors.push('Workflow must have an End node.');

  const connectedIds = new Set<string>();
  edges.forEach(e => { connectedIds.add(e.source); connectedIds.add(e.target); });
  if (nodes.length > 1) {
    nodes.forEach(n => {
      if (!connectedIds.has(n.id)) {
        errors.push(`"${(n.data as any).title || n.data.type}" is disconnected.`);
      }
    });
  }

  // Check for cycles using DFS
  const adjMap: Record<string, string[]> = {};
  edges.forEach(e => {
    if (!adjMap[e.source]) adjMap[e.source] = [];
    adjMap[e.source].push(e.target);
  });

  const hasCycle = (): boolean => {
    const visited = new Set<string>();
    const inStack = new Set<string>();
    const dfs = (id: string): boolean => {
      visited.add(id); inStack.add(id);
      for (const next of (adjMap[id] || [])) {
        if (!visited.has(next) && dfs(next)) return true;
        if (inStack.has(next)) return true;
      }
      inStack.delete(id);
      return false;
    };
    return nodes.some(n => !visited.has(n.id) && dfs(n.id));
  };

  if (hasCycle()) errors.push('Cycle detected in workflow. Workflow must be a DAG.');

  // Warnings (non-blocking)
  nodes.forEach(n => {
    if (n.data.type === 'task' && !(n.data as any).assignee) {
      warnings.push(`Task "${(n.data as any).title}" has no assignee.`);
    }
    if (n.data.type === 'automated' && !(n.data as any).actionId) {
      warnings.push(`Automated step "${(n.data as any).title}" has no action configured.`);
    }
  });

  if (errors.length > 0) {
    return { success: false, totalSteps: 0, completedSteps: 0, steps: [], errors, warnings, duration: 0 };
  }

  // BFS execution order
  const nodeMap: Record<string, Node<WorkflowNodeData>> = {};
  nodes.forEach(n => (nodeMap[n.id] = n));

  const visited = new Set<string>();
  const order: Node<WorkflowNodeData>[] = [];
  const queue = [startNodes[0]];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    order.push(current);
    (adjMap[current.id] || []).forEach(nextId => {
      if (!visited.has(nextId) && nodeMap[nextId]) queue.push(nodeMap[nextId]);
    });
  }

  const baseTime = Date.now();
  const steps: SimulationStep[] = order.map((node, idx) => {
    const data = node.data;
    let title = 'Unknown';
    let message = '';
    let stepDuration = 100 + Math.random() * 300;

    switch (data.type) {
      case 'start':
        title = data.title || 'Start';
        message = `Workflow initiated: "${title}"`;
        stepDuration = 50;
        break;
      case 'task':
        title = (data as any).title || 'Task';
        const assignee = (data as any).assignee || 'Unassigned';
        message = `Task "${title}" assigned to ${assignee}`;
        stepDuration = 400 + Math.random() * 200;
        break;
      case 'approval':
        title = (data as any).title || 'Approval';
        const role = (data as any).approverRole || 'Manager';
        const threshold = (data as any).autoApproveThreshold || 0;
        message = threshold > 0
          ? `Auto-approved (threshold: ${threshold}%) by ${role}`
          : `Awaiting ${role} approval`;
        stepDuration = 600 + Math.random() * 400;
        break;
      case 'automated':
        title = (data as any).title || 'Automated Step';
        const actionId = (data as any).actionId || 'none';
        message = `Executing: ${actionId.replace(/_/g, ' ')}`;
        stepDuration = 200 + Math.random() * 300;
        break;
      case 'end':
        title = 'Workflow Complete';
        message = (data as any).endMessage || 'Workflow completed successfully.';
        stepDuration = 80;
        break;
    }

    const ts = new Date(baseTime + idx * 2000);
    return {
      nodeId: node.id,
      nodeType: data.type,
      title,
      status: 'success',
      message,
      timestamp: ts.toLocaleTimeString(),
      duration: Math.round(stepDuration),
    };
  });

  return {
    success: true,
    totalSteps: steps.length,
    completedSteps: steps.length,
    steps,
    errors: [],
    warnings,
    duration: steps.reduce((sum, s) => sum + s.duration, 0),
  };
}