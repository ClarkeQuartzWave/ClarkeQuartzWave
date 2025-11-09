import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./css/colors.css";
import "./css/fonts.css";

const rootContainer = document.getElementById("root");
const root = createRoot(rootContainer);
root.render(<App />);
