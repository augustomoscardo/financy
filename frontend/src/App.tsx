import { Login } from "@/pages/auth/login";
import { Layout } from "./components/layout";

import { Routes, Route } from "react-router-dom";
import { Signup } from "./pages/auth/signup";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Layout>
  );
}
