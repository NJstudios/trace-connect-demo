import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import ProjectDetail from "./pages/ProjectDetail";
import Pricing from "./pages/Pricing";
import About from "./pages/About";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />

        <Route path="/app" element={<Navigate to="/app/projects" replace />} />
        <Route path="/app/projects" element={<Projects />} />
        <Route path="/app/new" element={<NewProject />} />
        <Route path="/app/projects/:id" element={<ProjectDetail />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
