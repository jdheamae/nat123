// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddNatData from "./components/AddNatData";
import NATDataList from "./components/NATDataList";
import Sidebar from "./components/sidebar";
import Visual from "./components/visual";
import DataVisualization from "./components/dataVisualization";
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <header className="header">
            <h1>National Achievement Test Data Management</h1>
          </header>
          <div className="main-content">
            <Routes>
              <Route path="/data-list" element={<NATDataList />} /> 
              <Route path="/add-data" element={<AddNatData />} />
              <Route path="/dataVisualization" element={<DataVisualization />} />
              <Route path="/" element={<NATDataList />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
