import Sidebar from "./components/Sidebar.jsx";
import NewProject from "./components/NewProject.jsx";
import NoprojectSelected from "./components/NoprojectSelected.jsx";
import SelectedProjects from "./components/SelectedProjects.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Admin from "./components/Admin.jsx";

import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { getSecureItem, setSecureItem } from "./utils/secureStorage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  const { user, logout, loading } = useAuth();

  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projects: [],
  });

  // 🔄 Load user-specific data
  useEffect(() => {
    if (user) {
      const storedData = getSecureItem(user.uid, "projectsState");
      if (storedData) {
        setProjectsState(storedData);
      }
    }
  }, [user]);

  // 💾 Persist user-specific data
  useEffect(() => {
    if (user) {
      setSecureItem(user.uid, "projectsState", projectsState);
    }
  }, [projectsState, user]);

  function handleStartProjects() {
    setProjectsState((prev) => ({ ...prev, selectedProjectId: null }));
  }

  function handleCancelProject() {
    setProjectsState((prev) => ({ ...prev, selectedProjectId: undefined }));
  }

  function handleAddProjects(projectData) {
    setProjectsState((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { ...projectData, id: Math.random(), tasks: [] },
      ],
    }));
  }

  const selectedProject = projectsState.projects.find(
    (p) => p.id === projectsState.selectedProjectId
  );

  let content = <NoprojectSelected onStartAddProject={handleStartProjects} />;

  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject
        onAdd={handleAddProjects}
        onCancel={handleCancelProject}
      />
    );
  } else if (selectedProject) {
    content = <SelectedProjects project={selectedProject} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* 🔐 AUTH ROUTES */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />

        {/* 👑 ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            user && user.isAdmin ? (
              <Admin />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 🏠 MAIN APP */}
        <Route
          path="/"
          element={
            user ? (
              user.isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <main className="my-8 h-screen flex gap-8">
                  <Sidebar
                    onStartAddProject={handleStartProjects}
                    projects={projectsState.projects}
                    onLogout={logout}
                    user={user}
                  />
                  {content}
                </main>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
