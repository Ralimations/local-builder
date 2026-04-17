import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"

// Remove <StrictMode> wrappers
createRoot(document.getElementById("root")!).render(
    <App />
)