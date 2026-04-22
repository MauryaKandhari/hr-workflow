# HR Workflow Designer — Tredence Studio Case Study

A visual, drag-and-drop HR workflow builder built with **React**, **TypeScript**, and **React Flow**. Designed as a functional prototype for the Tredence Studio Full Stack Engineering Internship (AI Agentic Platforms) case study.

---

## Live Demo / Screenshots

> Drag nodes from the sidebar → connect them on the canvas → configure via the form panel → run a simulation.

---

## How to Run

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://mauryakandhari.github.io/hr-workflow/
cd hr-workflow-designer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```
---

## Architecture Overview

```
src/
├── api/
│   └── mockApi.ts          # Mock data layer — automations, templates, simulate
├── components/
│   ├── nodes/
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedNode.tsx
│   │   └── EndNode.tsx
│   ├── WorkflowDesigner.tsx  # Root canvas component (ReactFlow wrapper)
│   ├── Toolbar.tsx           # Top bar — actions, stats, theme toggle
│   ├── Sidebar.tsx           # Draggable node palette
│   ├── NodeFormPanel.tsx     # Right-panel form for selected node
│   ├── SandboxPanel.tsx      # Simulation results overlay
│   └── TemplatesPanel.tsx    # Modal for pre-built workflow templates
├── context/
│   └── ThemeContext.tsx      # Dark/light theme via CSS custom properties
├── hooks/
│   └── useWorkflow.ts        # All canvas state, undo/redo, simulation, import/export
├── types/
│   └── workflow.ts           # TypeScript interfaces for all node/data types
├── App.tsx
├── main.tsx
└── index.css                 # Design system — CSS variables, shared component classes
```

### Key Architectural Decisions

**1. `useWorkflow` as the single source of truth**  
All workflow state (nodes, edges, selection, simulation, undo/redo history) lives in one custom hook. Components receive only what they need via props, keeping them pure and testable. This avoids prop-drilling while keeping the component tree free of scattered `useState` calls.

**2. CSS custom properties for theming**  
The entire design system is expressed as CSS variables on `[data-theme="dark"]` and `[data-theme="light"]`. Switching themes is a single attribute change on `<html>` — no component re-renders needed. Every color token (node colors, backgrounds, borders, shadows) is scoped this way.

**3. Discriminated union type for node data**  
`WorkflowNodeData` is a discriminated union (`StartNodeData | TaskNodeData | ...`). The `type` field acts as the discriminant. This gives TypeScript full narrowing in switch/if-else blocks, making the node forms and simulation engine type-safe without any casts in business logic.

**4. Mock API as a real abstraction layer**  
`mockApi.ts` exports async functions (`getAutomations`, `getTemplates`, `simulateWorkflow`) with realistic delays. Swapping to a real backend only requires updating this file — all consumers are already `async/await` compatible.

**5. Simulation as a graph algorithm**  
The `/simulate` mock doesn't just iterate nodes in insertion order. It performs BFS from the start node following the edge adjacency map, and runs a DFS-based cycle detection before execution. This mirrors real workflow engine behaviour.

---

## Features Implemented

### Core (Required)

| Feature | Status |
|---|---|
| Drag-and-drop canvas (React Flow) | ✅ |
| 5 custom node types | ✅ |
| Connect nodes with animated edges | ✅ |
| Select node to open edit form | ✅ |
| Delete nodes / edges (`Delete` key) | ✅ |
| Node Form Panel per node type | ✅ |
| Dynamic forms (controlled components) | ✅ |
| Key-value metadata / custom fields | ✅ |
| Mock API — `GET /automations` | ✅ |
| Mock API — `POST /simulate` | ✅ |
| Simulation Sandbox Panel | ✅ |
| Graph validation (missing start/end, disconnected nodes, cycles) | ✅ |
| Step-by-step execution timeline | ✅ |

### Bonus (Implemented)

| Feature | Status |
|---|---|
| Export workflow as JSON | ✅ |
| Import workflow from JSON | ✅ |
| Workflow templates modal | ✅ |
| Undo / Redo (up to 50 steps) | ✅ |
| MiniMap | ✅ |
| Zoom controls | ✅ |
| Dark / Light theme toggle (persisted to localStorage) | ✅ |
| Simulation warnings (unassigned tasks, unconfigured automations) | ✅ |

---

## Node Types & Form Fields

### Trigger (Start) Node
- **Title** — workflow name
- **Metadata** — optional key-value pairs (e.g. `department: Engineering`)

### Task Node
- **Title** *(required)*
- **Description**
- **Assignee** — name or team
- **Due Date** — date input
- **Priority** — low / medium / high (shown as color dot on node)
- **Custom Fields** — key-value pairs

### Approval Node
- **Title**
- **Approver Role** — Manager / HRBP / Director / VP / CEO
- **Auto-Approve Threshold** — score % above which approval is automatic
- **Requires Comment** — boolean toggle

### Automated Step Node
- **Title**
- **Action** — selected from mock `GET /automations` list
- **Action Parameters** — rendered dynamically based on the selected action's `params` array

### Complete (End) Node
- **End Message** — completion text
- **Generate Summary Report** — boolean toggle

---

## Mock API Reference

All API calls are in `src/api/mockApi.ts` and simulate network latency.

### `GET /automations`
Returns a list of available automated actions:
```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject", "body"], "category": "Communication" },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"], "category": "Documents" },
  ...10 actions total
]
```

### `POST /simulate`
Accepts the full workflow graph and returns:
```json
{
  "success": true,
  "totalSteps": 5,
  "completedSteps": 5,
  "steps": [
    { "nodeId": "n1", "nodeType": "start", "title": "New Hire Trigger", "status": "success", "message": "...", "timestamp": "...", "duration": 50 }
  ],
  "errors": [],
  "warnings": ["Task 'Collect Documents' has no assignee."],
  "duration": 1240
}
```

**Validation rules applied:**
- Must have exactly one Start node
- Must have at least one End node
- All nodes must be connected
- Graph must be a DAG (no cycles — detected via DFS)

---

## Design Decisions & Assumptions

1. **No backend / no auth** — per the spec. All state is in-memory. `localStorage` is used only for theme preference.

2. **Vite + React 18** — chosen over Next.js because this is a pure client-side SPA with no server rendering requirements. Vite gives faster HMR and a simpler config.

3. **CSS variables over a UI library** — using Tailwind or MUI would add bundle weight and fight React Flow's own styles. A hand-rolled CSS variable system gives full control with zero conflicts and easy theming.

4. **`useWorkflow` hook, not Redux/Zustand** — the state is localised to a single canvas view. A global state manager would be over-engineering for this scope, but the hook's interface is designed so it could be dropped behind a context or Zustand store later with minimal refactoring.

5. **Undo/redo via snapshot history** — using a `useRef` array of `{nodes, edges}` snapshots (max 50). This is simpler and more predictable than command-pattern for a prototype. A production system would use immutable data structures (Immer) for efficiency.

6. **BFS execution order in simulation** — the simulation traverses the graph in BFS order from the start node, matching how most workflow engines execute steps. Nodes unreachable from the start node are flagged as disconnected errors.

7. **Priority field on Task Node** (not in spec) — added as a natural extension of the `TaskNodeData` type to demonstrate extensibility. The priority is surfaced as a color dot on the node card.

---

## What I Would Add With More Time

- **Conditional / branch edges** — allow edges to carry conditions (e.g. approval → approved/rejected paths), turning the graph into a proper decision tree
- **Real backend (FastAPI + PostgreSQL)** — persist workflows by ID, version history, user ownership
- **Auto-layout** — use `dagre` or `elkjs` to automatically arrange nodes in a clean top-down DAG layout
- **Node validation indicators** — show red border / warning badge on nodes with missing required fields, live on the canvas
- **Keyboard shortcuts** — `Ctrl+Z/Y` for undo/redo, `Ctrl+D` to duplicate, arrow keys to nudge nodes
- **Multi-select** — drag to select a group of nodes and move/delete them together
- **Collaboration** — real-time multiplayer canvas via WebSockets (e.g. Liveblocks or Yjs)
- **Storybook** — document each node and form component in isolation
- **Unit tests** — Jest + RTL for `useWorkflow` hook and simulation logic; Playwright E2E for drag-and-drop flows

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Canvas | React Flow (v11) |
| Styling | CSS Custom Properties + inline styles |
| State | `useState` / `useRef` / custom hook |
| Fonts | Syne, DM Sans, JetBrains Mono (Google Fonts) |
| No external UI library | intentional — full design control |

---

## Folder Conventions

- `components/nodes/` — one file per node type, each is a pure presentational component receiving `NodeProps<T>`
- `hooks/` — business logic only, no JSX
- `api/` — async data layer, no UI concerns
- `types/` — TypeScript interfaces, no runtime code
- `context/` — React context providers

---
