import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ServAIHome from "@/components/ServAIHome";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ServAIHome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
