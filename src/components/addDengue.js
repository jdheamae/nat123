import React, { useState, useCallback } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import CsvUploader from './CsvUploader'; // Import CsvUploader
import './addDengue.css'; // Custom CSS for styling

const AddDengueData = () => {
  const [formData, setFormData] = useState({
    loc: "",
    cases: "",
    deaths: "",
    date: "",
    Region: "",

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error

    try {
      await addDoc(collection(db, "dengueData"), {
        ...formData,
        cases: Number(formData.cases),
        deaths: Number(formData.deaths),
      });
      setFormData({
        loc: "",
        cases: "",
        deaths: "",
        date: "",
        Region: "",

      });
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Failed to add data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV upload success
  const handleUploadSuccess = useCallback(() => {
    alert("CSV data uploaded successfully!");
    // Optionally, refresh data here if needed
  }, []);

  return (
    <div className="add-data-container">
      <div className="form-and-uploader">
        <form className="data-form1" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            name="loc"
            placeholder="Location"
            value={formData.loc}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="cases"
            placeholder="Cases"
            value={formData.cases}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="deaths"
            placeholder="Deaths"
            value={formData.deaths}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Region"
            placeholder="Region"
            value={formData.Region}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Data"}
          </button>
        </form>
        <div className="uploader-container">
          <CsvUploader onUploadSuccess={handleUploadSuccess} /> {/* Add CSV Uploader */}
        </div>
      </div>
    </div>
  );
};

export default AddDengueData;
