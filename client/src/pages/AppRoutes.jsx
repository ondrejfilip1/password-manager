import { BrowserRouter, Routes, Route } from "react-router-dom";

// Routes
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Home";
import NotFound from "./NotFound";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute route={<Dashboard />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
