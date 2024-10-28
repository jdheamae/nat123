import React, { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './NatData.css';

const NATDataList = () => {
  const [natData, setNATData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    respondent: "",
    age: "",
    sex: "",
    ethic: "",
    academic_perfromance: "",
    adamemic_description: "", 
    iq: "", 
    type_school: "",
    socio_economic_status: "",
    study_habit: "",
    nat_result: "",
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
      const natCollection = collection(db, "natData");
      const natSnapshot = await getDocs(natCollection);
      const dataList = natSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNATData(dataList);
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
    const natDocRef = doc(db, "natData", id);
    try {
      await deleteDoc(natDocRef);
      setNATData((prevData) => prevData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete data. Please try again.");
    }
  }, []);

  const handleEdit = useCallback((data) => {
    setEditingId(data.id);
    setEditForm({
      firstName: data.firstName,
      respondent: data.respondent,
      age: data.age,
      sex: data.sex,
      ethic: data.ethic,
      academic_perfromance: data.academic_perfromance,
      adamemic_description: data.adamemic_description, 
      iq: data.iq, 
      type_school: data.type_school,
      socio_economic_status: data.socio_economic_status,
      study_habit: data.study_habit,
      nat_result: data.nat_result,
    });
    setIsModalOpen(true); // Open modal on edit
  }, []);

  const handleUpdate = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    const natDocRef = doc(db, "natData", editingId);
    try {
      await updateDoc(natDocRef, editForm);
      setNATData((prevData) =>
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
    return natData.filter((data) => {
      const firstName = data.firstName?.toLowerCase() ?? '';
      const respondent = data.respondent?.toLowerCase() ?? '';
      const ethic = data.ethic?.toLowerCase() ?? '';
      return firstName.includes(search) || respondent.includes(search) || ethic.includes(search);
    });
  }, [natData, searchTerm]);

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
      <h2>National Achievement Test Data List</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by respondent name or ethic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
      </div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>

          <table className="data-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Ethnic</th>
                <th>Academic Performance</th>
                <th>Academic Description</th> 
                <th>IQ</th> 
                <th>Type of School</th>
                <th>Socio-Economic Status</th>
                <th>Study Habit</th>
                <th>NAT Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length > 0 ? (
                currentPageData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.firstName}</td>
                    <td>{data.respondent}</td>
                    <td>{data.age}</td>
                    <td>{data.sex}</td>
                    <td>{data.ethic}</td>
                    <td>{data.academic_perfromance}</td>
                    <td>{data.adamemic_description}</td>
                    <td>{data.iq ?? "N/A"}</td>
                    <td>{data.type_school}</td>
                    <td>{data.socio_economic_status}</td>
                    <td>{data.study_habit}</td>
                    <td>{data.nat_result}</td>
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
            <h3>Edit NAT Data</h3>
            <form className="data-form" onSubmit={handleUpdate}>
              <label>
                First Name:
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={editForm.respondent}
                  onChange={(e) => setEditForm({ ...editForm, respondent: e.target.value })}
                  required
                />
              </label>
              <label>
                Age:
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  required
                />
              </label>
              <label>
                Sex:
                <select
                  value={editForm.sex}
                  onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
                  required
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
              <label>
                Ethnic:
                <input
                  type="text"
                  value={editForm.ethic}
                  onChange={(e) => setEditForm({ ...editForm, ethic: e.target.value })}
                  required
                />
              </label>
              <label>
                Academic Performance:
                <input
                  type="text"
                  value={editForm.academic_perfromance}
                  onChange={(e) => setEditForm({ ...editForm, academic_perfromance: e.target.value })}
                  required
                />
              </label>
              <label>
                Academic Description:
                <input
                  type="text"
                  value={editForm.adamemic_description}
                  onChange={(e) => setEditForm({ ...editForm, adamemic_description: e.target.value })}
                  required
                />
              </label>
              <label>
                IQ:
                <input
                  type="text"
                  value={editForm.iq}
                  onChange={(e) => setEditForm({ ...editForm, iq: e.target.value })}
                  required
                />
              </label>
              <label>
                Type of School:
                <input
                  type="text"
                  value={editForm.type_school}
                  onChange={(e) => setEditForm({ ...editForm, type_school: e.target.value })}
                  required
                />
              </label>
              <label>
                Socio-Economic Status:
                <input
                  type="text"
                  value={editForm.socio_economic_status}
                  onChange={(e) => setEditForm({ ...editForm, socio_economic_status: e.target.value })}
                  required
                />
              </label>
              <label>
                Study Habit:
                <input
                  type="text"
                  value={editForm.study_habit}
                  onChange={(e) => setEditForm({ ...editForm, study_habit: e.target.value })}
                  required
                />
              </label>
              <label>
                NAT Result:
                <input
                  type="text"
                  value={editForm.nat_result}
                  onChange={(e) => setEditForm({ ...editForm, nat_result: e.target.value })}
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

export default NATDataList;