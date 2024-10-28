import React, { useState, useCallback } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import CsvUploader from './CsvUploader'; // Import CsvUploader
import './natAdd.css'; // Custom CSS for styling

const AddNatData = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    respondent: "",
    age: "",
    sex: "",
    ethnic: "",
    academic_perfromance: "",
    adamemic_description: "",
    iq: "",
    type_school: "",
    socio_economic_status: "",
    study_habit: "",
    nat_results: "",
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
      await addDoc(collection(db, "natData"), {
        ...formData,
        age: Number(formData.age),
        academic_perfromance: Number(formData.academic_perfromance),
        nat_results: Number(formData.nat_results),
      });
      setFormData({
        firstName: "",
        respondent: "",
        age: "",
        sex: "",
        ethnic: "",
        academic_perfromance: "",
        adamemic_description: "",
        iq: "",
        type_school: "",
        socio_economic_status: "",
        study_habit: "",
        nat_results: "",
      });
      alert("NAT Data added successfully!");
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
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="respondent"
            placeholder="Last Name"
            value={formData.respondent}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="sex"
            placeholder="Sex"
            value={formData.sex}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="ethnic"
            placeholder="Ethnic"
            value={formData.ethnic}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="academic_perfromance"
            placeholder="Academic Performance"
            value={formData.academic_perfromance}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="adamemic_description"
            placeholder="Academic Description"
            value={formData.adamemic_description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="iq"
            placeholder="IQ"
            value={formData.iq}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="type_school"
            placeholder="Type of School"
            value={formData.type_school}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="socio_economic_status"
            placeholder="Socio-Economic Status"
            value={formData.socio_economic_status}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="study_habit"
            placeholder="Study Habit"
            value={formData.study_habit}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="nat_result"
            placeholder="NAT Results"
            value={formData.nat_result}
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

export default AddNatData;
