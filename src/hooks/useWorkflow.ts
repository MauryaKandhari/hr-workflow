import { useCallback, useState, useRef } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
} from 'reactflow';
import type { WorkflowNodeData } from '../types/workflow';
import { simulateWorkflow } from '../api/mockApi';
import type { SimulationResult } from '../types/workflow';

let nodeIdCounter = 1;
export const createNodeId = () => `node_${Date.now()}_${nodeIdCounter++}`;

const defaultData: Record<string, () => WorkflowNodeData> = {
  start: () => ({ type: 'start', title: 'Workflow Start', metadata: [] }),
  task: () => ({
    type: 'task', title: 'New Task', description: '',
    assignee: '', dueDate: '', priority: 'medium', customFields: [],
  }),
  approval: () => ({
    type: 'approval', title: 'Approval Required',
    approverRole: 'Manager', autoApproveThreshold: 0, requiresComment: false,
  }),
  automated: () => ({
    type: 'automated', title: 'Automated Action',
    actionId: '', actionParams: {},
  }),
  end: () => ({ type: 'end', endMessage: 'Workflow completed successfully.', summaryFlag: false }),
};

interface HistoryState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

export function useWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Undo/Redo history
  const history = useRef<HistoryState[]>([]);
  const historyIndex = useRef(-1);
  const isUndoRedo = useRef(false);

  const pushHistory = useCallback((newNodes: Node<WorkflowNodeData>[], newEdges: Edge[]) => {
    if (isUndoRedo.current) return;
    const state = { nodes: JSON.parse(JSON.stringify(newNodes)), edges: JSON.parse(JSON.stringify(newEdges)) };
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push(state);
    if (history.current.length > 50) history.current.shift();
    historyIndex.current = history.current.length - 1;
  }, []);

  const undo = useCallback(() => {
    if (historyIndex.current <= 0) return;
    historyIndex.current -= 1;
    const state = history.current[historyIndex.current];
    isUndoRedo.current = true;
    setNodes(state.nodes);
    setEdges(state.edges);
    setSelectedNode(null);
    setTimeout(() => { isUndoRedo.current = false; }, 0);
  }, [setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex.current >= history.current.length - 1) return;
    historyIndex.current += 1;
    const state = history.current[historyIndex.current];
    isUndoRedo.current = true;
    setNodes(state.nodes);
    setEdges(state.edges);
    setSelectedNode(null);
    setTimeout(() => { isUndoRedo.current = false; }, 0);
  }, [setNodes, setEdges]);

  const canUndo = historyIndex.current > 0;
  const canRedo = historyIndex.current < history.current.length - 1;

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const id = createNodeId();
    const newNode: Node<WorkflowNodeData> = {
      id,
      type,
      position,
      data: defaultData[type]?.() ?? defaultData.task(),
    };
    setNodes(nds => {
      const updated = [...nds, newNode];
      pushHistory(updated, edges);
      return updated;
    });
  }, [setNodes, edges, pushHistory]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => {
      const updated = addEdge({ ...connection, animated: true, style: { stroke: 'var(--border-strong)', strokeWidth: 1.5 } }, eds);
      pushHistory(nodes, updated);
      return updated;
    });
  }, [setEdges, nodes, pushHistory]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<WorkflowNodeData>) => {
    setSelectedNode(node);
  }, []);

  const updateNodeData = useCallback((id: string, newData: Partial<WorkflowNodeData>) => {
    setNodes(nds => {
      const updated = nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...newData } as WorkflowNodeData } : n);
      pushHistory(updated, edges);
      return updated;
    });
    setSelectedNode(prev =>
      prev?.id === id ? { ...prev, data: { ...prev.data, ...newData } as WorkflowNodeData } : prev
    );
  }, [setNodes, edges, pushHistory]);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes(nds => {
      const updated = nds.filter(n => n.id !== selectedNode.id);
      pushHistory(updated, edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
      return updated;
    });
    setEdges(eds => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges, edges, pushHistory]);

  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const runSimulation = useCallback(async () => {
    setIsSimulating(true);
    setShowSandbox(true);
    setSimulationResult(null);
    try {
      const result = await simulateWorkflow(nodes, edges);
      setSimulationResult(result);
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges]);

  const exportWorkflow = useCallback(() => {
    const data = {
      version: '1.0',
      name: 'HR Workflow',
      exportedAt: new Date().toISOString(),
      nodes,
      edges,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `workflow-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const importWorkflow = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const importedNodes = data.nodes || [];
        const importedEdges = data.edges || [];
        setNodes(importedNodes);
        setEdges(importedEdges);
        setSelectedNode(null);
        pushHistory(importedNodes, importedEdges);
      } catch { alert('Invalid workflow file.'); }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges, pushHistory]);

  const loadTemplate = useCallback((template: { nodes: any[]; edges: any[] }) => {
    setNodes(template.nodes);
    setEdges(template.edges);
    setSelectedNode(null);
    setShowTemplates(false);
    pushHistory(template.nodes, template.edges);
  }, [setNodes, setEdges, pushHistory]);

  const clearCanvas = useCallback(() => {
    setNodes([]); setEdges([]); setSelectedNode(null); setSimulationResult(null);
    pushHistory([], []);
  }, [setNodes, setEdges, pushHistory]);

  return {
    nodes, edges, selectedNode,
    isSimulating, simulationResult, showSandbox, showTemplates,
    canUndo, canRedo,
    onNodesChange, onEdgesChange, onConnect,
    onNodeClick, onPaneClick,
    addNode, updateNodeData, deleteSelectedNode,
    runSimulation, exportWorkflow, importWorkflow, loadTemplate,
    clearCanvas, undo, redo,
    setShowSandbox, setShowTemplates, setSelectedNode,
  };
}