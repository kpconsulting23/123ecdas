import React, { createContext, useContext, useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Edit2, Save, X, Camera, CircleUser } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AppContext = createContext();

const CompactUserDisplay = ({ user }) => (
  <div className="flex items-center space-x-2">
    <img src={user.profilePicture} alt={user.fullName} className="w-8 h-8 rounded-full" />
    <span>{user.fullName}</span>
  </div>
);

const TimesheetApp = () => {
  const [users, setUsers] = useState([
    { id: 1, fullName: 'John Doe', position: 'Developer', profilePicture: '/api/placeholder/64/64' },
    { id: 2, fullName: 'Jane Smith', position: 'Manager', profilePicture: '/api/placeholder/64/64' }
  ]);

  const [projects, setProjects] = useState([
    { id: 1, title: 'Project A', description: 'Website redesign' },
    { id: 2, title: 'Project B', description: 'Mobile app' }
  ]);

  const [timeEntries, setTimeEntries] = useState([]);

  const contextValue = {
    users, setUsers,
    projects, setProjects,
    timeEntries, setTimeEntries
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="container mx-auto p-4 space-y-8">
        <TimeEntryForm />
        <TimeEntryList />
        <ProjectList />
        <UserList />
      </div>
    </AppContext.Provider>
  );
};

const TimeEntryForm = () => {
  const { users, projects, setTimeEntries } = useContext(AppContext);
  const [entry, setEntry] = useState({
    date: '', project: '', hours: '', notes: '', user: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!entry.date || !entry.project || !entry.hours || !entry.user) return;
    
    setTimeEntries(prev => [...prev, { ...entry, id: Date.now() }]);
    setEntry({ date: '', project: '', hours: '', notes: '', user: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Time Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={entry.user}
              onChange={e => setEntry(prev => ({ ...prev, user: e.target.value }))}
              className="p-2 border rounded"
              required
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.fullName}>{user.fullName}</option>
              ))}
            </select>

            <select
              value={entry.project}
              onChange={e => setEntry(prev => ({ ...prev, project: e.target.value }))}
              className="p-2 border rounded"
              required
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.title}>{project.title}</option>
              ))}
            </select>

            <input
              type="date"
              value={entry.date}
              onChange={e => setEntry(prev => ({ ...prev, date: e.target.value }))}
              className="p-2 border rounded"
              required
            />

            <input
              type="number"
              value={entry.hours}
              onChange={e => setEntry(prev => ({ ...prev, hours: e.target.value }))}
              placeholder="Hours"
              className="p-2 border rounded"
              min="0"
              step="0.5"
              required
            />

            <input
              type="text"
              value={entry.notes}
              onChange={e => setEntry(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes"
              className="p-2 border rounded col-span-2"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Entry
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

const TimeEntryList = () => {
  const { timeEntries, setTimeEntries } = useContext(AppContext);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {timeEntries.map(entry => (
            <div key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>
                <div className="font-medium">{entry.user} - {entry.project}</div>
                <div className="text-sm text-gray-600">
                  {entry.date} • {entry.hours}h • {entry.notes}
                </div>
              </div>
              <button
                onClick={() => setTimeEntries(prev => prev.filter(e => e.id !== entry.id))}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectList = () => {
  const { projects, setProjects } = useContext(AppContext);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProject.title) return;
    setProjects(prev => [...prev, { ...newProject, id: Date.now() }]);
    setNewProject({ title: '', description: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <input
            type="text"
            value={newProject.title}
            onChange={e => setNewProject(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Project Title"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={newProject.description}
            onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Project
          </button>
        </form>
        <div className="space-y-2">
          {projects.map(project => (
            <div key={project.id} className="p-2 bg-gray-50 rounded">
              <div className="font-medium">{project.title}</div>
              <div className="text-sm text-gray-600">{project.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const UserList = () => {
  const { users, setUsers } = useContext(AppContext);
  const [newUser, setNewUser] = useState({
    fullName: '',
    position: '',
    profilePicture: '/api/placeholder/64/64'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.position) return;
    setUsers(prev => [...prev, { ...newUser, id: Date.now() }]);
    setNewUser({ fullName: '', position: '', profilePicture: '/api/placeholder/64/64' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <input
            type="text"
            value={newUser.fullName}
            onChange={e => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="Full Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={newUser.position}
            onChange={e => setNewUser(prev => ({ ...prev, position: e.target.value }))}
            placeholder="Position"
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add User
          </button>
        </form>
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <img src={user.profilePicture} alt={user.fullName} className="w-8 h-8 rounded-full" />
              <div>
                <div className="font-medium">{user.fullName}</div>
                <div className="text-sm text-gray-600">{user.position}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimesheetApp;
