import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize global error handling
import './utils/error-handler'

createRoot(document.getElementById("root")!).render(<App />);
