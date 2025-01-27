import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Main from "./pages/Main";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
