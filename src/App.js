// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddDengueData from "./components/addDengue";
import DengueDataList from "./components/dengueDataList";
import Sidebar from "./components/sidebar";
import DataVisualization from "./components/dataVisualization";
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <header className="header">
            <h1>Dengue Data Management</h1>
          </header>
          <div className="main-content">
            <Routes>
              <Route path="/dengueDataList" element={<DengueDataList />} /> 
              <Route path="/add-data" element={<AddDengueData />} />
              <Route path="/dataVisualization" element={<DataVisualization />} />
              <Route path="/" element={<DengueDataList />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
