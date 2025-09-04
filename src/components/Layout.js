import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav>
        <div className="nav-container">
          <div className="nav-content">
            <div className="flex items-center">
              <Link to="/" className="nav-brand">
                <FileText className="nav-brand-icon" />
                <span className="nav-brand-text">Notes App</span>
              </Link>
            </div>
            <div className="nav-actions">
              <Link to="/create" className="btn btn-primary">
                <PlusCircle className="icon mr-2" />
                New Note
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;