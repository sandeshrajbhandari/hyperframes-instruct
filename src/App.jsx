import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import ProjectList from './components/ProjectList.jsx';
import ProjectEditor from './components/ProjectEditor.jsx';
import PromptHelper from './components/PromptHelper.jsx';
import RenderModal from './components/RenderModal.jsx';
import NewProjectModal from './components/NewProjectModal.jsx';
import AuditModal from './components/AuditModal.jsx';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [currentView, setCurrentView] = useState('projects'); // 'projects' or 'editor'

  // Modals
  const [isPromptHelperOpen, setIsPromptHelperOpen] = useState(false);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Fetch projects on load
  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
        if (!activeProjectId && data.projects.length > 0) {
          setActiveProjectId(data.projects[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Fetch full active project when selected
  const [activeProject, setActiveProject] = useState(null);
  useEffect(() => {
    if (!activeProjectId) {
      setActiveProject(null);
      return;
    }

    fetch(`/api/projects/${activeProjectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setActiveProject(data.project);
        }
      })
      .catch((err) => console.error('Failed to fetch project detail', err));
  }, [activeProjectId]);

  const handleSelectProject = (proj) => {
    setActiveProjectId(proj.id);
    setCurrentView('editor');
  };

  const handleCreateProject = async (projectData) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const data = await res.json();
      if (data.success) {
        await loadProjects();
        setActiveProjectId(data.project.id);
        setCurrentView('editor');
      }
    } catch (err) {
      alert('Error creating project: ' + err.message);
    }
  };

  const handleSaveProject = async (updated) => {
    try {
      const res = await fetch(`/api/projects/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setActiveProject(data.project);
        loadProjects();
      }
    } catch (err) {
      alert('Error saving project: ' + err.message);
    }
  };

  const handleDuplicateProject = async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}/duplicate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        await loadProjects();
        setActiveProjectId(data.project.id);
        setCurrentView('editor');
      }
    } catch (err) {
      alert('Error duplicating project: ' + err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        await loadProjects();
        if (activeProjectId === id) {
          setActiveProjectId(null);
          setCurrentView('projects');
        }
      }
    } catch (err) {
      alert('Error deleting project: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeProject={activeProject}
        onNewProject={() => setIsNewProjectModalOpen(true)}
        onOpenRender={() => setIsRenderModalOpen(true)}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        onOpenPromptHelper={() => setIsPromptHelperOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        {currentView === 'projects' || !activeProject ? (
          <ProjectList
            projects={projects}
            onSelectProject={handleSelectProject}
            onNewProject={() => setIsNewProjectModalOpen(true)}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
          />
        ) : (
          <ProjectEditor
            key={activeProject.id}
            project={activeProject}
            onSave={handleSaveProject}
            onOpenPromptHelper={() => setIsPromptHelperOpen(true)}
            onOpenAudit={() => setIsAuditModalOpen(true)}
            onLaunchStudio={() => {}}
          />
        )}
      </main>

      {/* Modals */}
      <PromptHelper
        isOpen={isPromptHelperOpen}
        onClose={() => setIsPromptHelperOpen(false)}
      />

      <RenderModal
        project={activeProject}
        isOpen={isRenderModalOpen}
        onClose={() => setIsRenderModalOpen(false)}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <AuditModal
        project={activeProject}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}
