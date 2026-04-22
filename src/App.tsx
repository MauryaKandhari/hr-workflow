import { ReactFlowProvider } from 'reactflow';
import WorkflowDesigner from './components/WorkflowDesigner';
import { ThemeProvider } from './context/ThemeContext';
import 'reactflow/dist/style.css';
import './index.css';

export default function App() {
  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <WorkflowDesigner />
      </ReactFlowProvider>
    </ThemeProvider>
  );
}