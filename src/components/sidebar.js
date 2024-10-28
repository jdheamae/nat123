// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import './sidebar.css'; // Custom CSS for sidebar styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <img src="1.png" alt="Profile" className="sidebar-logo"/>
      <ul>
        <li>
          <Link to="/data-list">Data List</Link>
          
        </li>
        <li>
          <Link to="/add-data">Add Data</Link>
        </li>
        <li>
          <Link to="/dataVisualization">Data Visualization</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
