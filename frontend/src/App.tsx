import { Login } from "@/pages/auth/login";
import { Layout } from "./components/layout";

import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Signup } from "./pages/auth/signup";
import { useAuthStore } from "./stores/auth";
import { Dashboard } from "./pages/dashboard";
import { Transactions } from "./pages/transactions";
import { Categories } from "./pages/categories";

export function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
        </Route>
      </Routes>
    </Layout>
  );
}
