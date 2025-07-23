import { BrowserRouter, Routes, Route } from "react-router-dom";

// Routes
import Home from "./Home";

export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
