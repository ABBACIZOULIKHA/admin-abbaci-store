import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FaienceList from "./pages/FaienceList";
import FaienceForm from "./pages/FaienceForm";
import BathroomList from "./pages/BathroomList";
import BathroomForm from "./pages/BathroomForm";
import Taxonomies from "./pages/Taxonomies";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="faience" element={<FaienceList />} />
            <Route path="faience/nouveau" element={<FaienceForm />} />
            <Route path="faience/:id/edit" element={<FaienceForm />} />
            <Route path="bathroom" element={<BathroomList />} />
            <Route path="bathroom/nouveau" element={<BathroomForm />} />
            <Route path="bathroom/:id/edit" element={<BathroomForm />} />
            <Route path="taxonomies" element={<Taxonomies />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
