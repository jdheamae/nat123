import React, { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './dengueList.css';

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    loc: "",
    cases: "",
    deaths: "",
    date: "",
    Region: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal visibility state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDengueData(dataList);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData((prevData) => prevData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete data. Please try again.");
    }
  }, []);

  const handleEdit = useCallback((data) => {
    setEditingId(data.id);
    setEditForm({
      loc: data.loc,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      Region: data.Region,
    });
    setIsModalOpen(true); // Open modal on edit
  }, []);

  const handleUpdate = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, editForm);
      setDengueData((prevData) =>
        prevData.map((data) =>
          data.id === editingId ? { id: editingId, ...editForm } : data
        )
      );
      setEditingId(null);
      alert("Data updated successfully!");
      setIsModalOpen(false); // Close modal after update
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [editForm, editingId]);

  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return dengueData.filter((data) => {
      const loc = data.loc?.toLowerCase() ?? '';
      const Region = data.Region?.toLowerCase() ?? '';
      return loc.includes(search) || Region.includes(search);
    });
  }, [dengueData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = useMemo(() => filteredData.slice(startIndex, startIndex + itemsPerPage), [filteredData, startIndex, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUploadSuccess = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="data-list">
      <h2>Dengue Data List</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Location or Region..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
      </div>
      { loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Cases</th>
                <th>Death</th>
                <th>Date</th>
                <th>Region</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length > 0 ? (
                currentPageData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.loc}</td>
                    <td>{data.cases}</td>
                    <td>{data.deaths}</td>
                    <td>{data.date}</td>
                    <td>{data.Region}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(data)}>Edit</button>
                      <button onClick={() => handleDelete(data.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13">No data available.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        </>
      )}

      {/* Modal for editing data */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Dengue Data</h3>
            <form className="data-form" onSubmit={handleUpdate}>
              <label>
                Location:
                <input
                  type="text"
                  value={editForm.loc}
                  onChange={(e) => setEditForm({ ...editForm, loc: e.target.value })}
                  required
                />
              </label>
              <label>
                Cases:
                <input
                  type="number"
                  value={editForm.cases}
                  onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
                  required
                />
              </label>
              <label>
                Death:
                <input
                  type="number"
                  value={editForm.deaths}
                  onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
                  required
                />
              </label>

              <label>
                Date:
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  required
                />
              </label>
              <label>
                Region:
                <input
                  type="text"
                  value={editForm.Region}
                  onChange={(e) => setEditForm({ ...editForm, Region: e.target.value })}
                  required
                />
              </label>

              <div className="button-container">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DengueDataList;
