import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflow } from '../hooks/useWorkflow';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import NodeFormPanel from './NodeFormPanel';
import SandboxPanel from './SandboxPanel';
import TemplatesPanel from './TemplatesPanel';

import StartNode from './nodes/StartNode';
import TaskNode from './nodes/TaskNode';
import ApprovalNode from './nodes/ApprovalNode';
import AutomatedNode from './nodes/AutomatedNode';
import EndNode from './nodes/EndNode';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes, edges, selectedNode,
    isSimulating, simulationResult, showSandbox, showTemplates,
    canUndo, canRedo,
    onNodesChange, onEdgesChange, onConnect,
    onNodeClick, onPaneClick,
    addNode, updateNodeData, deleteSelectedNode,
    runSimulation, exportWorkflow, importWorkflow, clearCanvas,
    undo, redo, loadTemplate,
    setShowSandbox, setShowTemplates, setSelectedNode,
  } = useWorkflow();

  const onDragStart = useCallback((e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type) return;
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    addNode(type, position);
  }, [screenToFlowPosition, addNode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Toolbar
        nodeCount={nodes.length}
        edgeCount={edges.length}
        onRunSimulation={runSimulation}
        onExport={exportWorkflow}
        onImport={importWorkflow}
        onClear={clearCanvas}
        onToggleSandbox={() => setShowSandbox((s: boolean) => !s)}
        onToggleTemplates={() => setShowTemplates((s: boolean) => !s)}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        isSimulating={isSimulating}
        showSandbox={showSandbox}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar onDragStart={onDragStart} />

        <div
          ref={reactFlowWrapper}
          style={{ flex: 1, position: 'relative' }}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            deleteKeyCode="Delete"
            style={{ background: 'var(--canvas-bg)' }}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: 'var(--edge-color)', strokeWidth: 1.8 },
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="var(--canvas-dot)"
            />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                const colors: Record<string, string> = {
                  start: '#22c55e', task: '#60a5fa',
                  approval: '#fbbf24', automated: '#c084fc', end: '#fb7185',
                };
                return colors[n.type || 'task'] || '#60a5fa';
              }}
              style={{ bottom: 20, right: 20 }}
            />
          </ReactFlow>

          {nodes.length === 0 && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center', pointerEvents: 'none',
              animation: 'fadeIn 0.4s ease', zIndex: 5,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)', marginBottom: 8 }}>
                Canvas is empty
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 260, lineHeight: 1.6 }}>
                Drag a <strong style={{ color: 'var(--node-start)' }}>Trigger</strong> node from the left panel,
                or click <strong style={{ color: 'var(--accent)' }}>Templates</strong> in the toolbar to start.
              </div>
            </div>
          )}

          {showSandbox && (
            <SandboxPanel
              isSimulating={isSimulating}
              result={simulationResult}
              onClose={() => setShowSandbox(false)}
              onRun={runSimulation}
            />
          )}
        </div>

        {selectedNode && (
          <NodeFormPanel
            key={selectedNode.id}
            data={selectedNode.data}
            nodeId={selectedNode.id}
            onUpdate={updateNodeData}
            onDelete={deleteSelectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>

      {/* Templates Modal — rendered here so it overlays everything */}
      {showTemplates && (
        <TemplatesPanel
          onLoad={loadTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}

export default function WorkflowDesigner() {
  return <FlowCanvas />;
}