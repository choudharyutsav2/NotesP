import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import SharedNote from './pages/SharedNote';
import './App.css';

function App() {
  return (
    <NotesProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/shared/:shareToken" element={<SharedNote />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create" element={<CreateNote />} />
                  <Route path="/edit/:id" element={<EditNote />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </div>
      </Router>
    </NotesProvider>
  );
}

export default App;
