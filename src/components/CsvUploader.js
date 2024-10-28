import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import './CsvUploader.css';

function CsvUploader() {
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const data = [];

      rows.forEach((row, index) => {
        const columns = row.split(',');
        if (columns.length >= 10 && index > 0) { // Ensure the row has enough columns
          data.push({
            respondent: columns[0].trim(),
            age: Number(columns[1].trim()),
            sex: columns[2].trim(),
            ethic: columns[3].trim(),
            academic_perfromance: Number(columns[4].trim()),
            adamemic_description: columns[5].trim(),
            iq: columns[6].trim(),
            type_school: columns[7].trim(),
            socio_economic_status: columns[8].trim(),
            study_habit: columns[9].trim(),
            nat_result: Number(columns[10].trim()), // Add any additional columns if needed
          });
        }
      });

      try {
        const batch = data.map(async (item) => {
          await addDoc(collection(db, 'natData'), item);
        });

        await Promise.all(batch);
        alert('CSV data uploaded successfully!');
      } catch (error) {
        console.error('Error uploading CSV data:', error);
        alert('Failed to upload CSV data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="csv-uploader">
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
}

export default CsvUploader;
