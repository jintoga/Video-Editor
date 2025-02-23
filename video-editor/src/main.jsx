import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./HomePage.jsx";
import { EditorPage } from "./EditorPage.jsx";
import './index.css';

import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  </BrowserRouter>
);
