export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface StartNodeData {
  type: 'start';
  title: string;
  metadata: KeyValuePair[];
}

export interface TaskNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  customFields: KeyValuePair[];
}

export interface ApprovalNodeData {
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
  requiresComment: boolean;
}

export interface AutomatedNodeData {
  type: 'automated';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  type: 'end';
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
  category: string;
}

export type SimulationStatus = 'success' | 'pending' | 'error' | 'skipped';

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  title: string;
  status: SimulationStatus;
  message: string;
  timestamp: string;
  duration: number;
}

export interface SimulationResult {
  success: boolean;
  totalSteps: number;
  completedSteps: number;
  steps: SimulationStep[];
  errors: string[];
  warnings: string[];
  duration: number;
}

export interface SidebarNodeDef {
  type: NodeType;
  label: string;
  description: string;
  color: string;
  accentColor: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
}