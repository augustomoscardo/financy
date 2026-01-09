import { Login } from "@/pages/auth/login";
import { Layout } from "./components/layout";

import { Routes, Route } from "react-router-dom"

export default function App() {

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  )
}