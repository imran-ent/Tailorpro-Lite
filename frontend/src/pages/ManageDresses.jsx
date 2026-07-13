import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../api';
import AdminSidebar from '../components/AdminSidebar';
import { ToastContext } from '../context/ToastContext';

const ManageDresses = () => {
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  // Edit mode states
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchDresses();
  }, []);

  const fetchDresses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/dresses');
      setDresses(data);
    } catch (error) {
      console.error('Error fetching dresses:', error);
      showToast('Could not load dresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImageFile(null);
    setEditId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price) {
      showToast('Please fill in name, description, and price', 'error');
      return;
    }

    if (Number(price) < 0) {
      showToast('Price cannot be negative', 'error');
      return;
    }

    if (!editId && !imageFile) {
      showToast('Please select an image file to upload', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('price', price);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      setIsSubmitting(true);
      if (editId) {
        // Edit Dress
        await api.put(`/dresses/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Dress updated successfully!', 'success');
      } else {
        // Create Dress
        await api.post('/dresses', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('New dress added successfully!', 'success');
      }
      resetForm();
      fetchDresses();
    } catch (error) {
      console.error('Dress submit error:', error);
      showToast(error.response?.data?.message || 'Failed to save dress details', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (dress) => {
    setEditId(dress._id);
    setName(dress.name);
    setDescription(dress.description);
    setPrice(dress.price);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Scroll form into view on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id, dressName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${dressName}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/dresses/${id}`);
      showToast('Dress deleted successfully', 'success');
      fetchDresses();
      if (editId === id) {
        resetForm();
      }
    } catch (error) {
      console.error('Delete dress error:', error);
      showToast(error.response?.data?.message || 'Failed to delete dress', 'error');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h2>Manage Dresses</h2>
          <p>Create, update, or remove clothing styles and pricing records.</p>
        </div>

        <div className="admin-crud-container">
          {/* Form Card */}
          <div className="admin-card crud-form-card">
            <h3>{editId ? 'Edit Dress Style' : 'Add New Dress'}</h3>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-group">
                <label>Dress Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Designer Kurti"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  placeholder="Describe stitching details, fabric requirements, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Starting Price (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload Image * {editId && '(Leave blank to keep current)'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  required={!editId}
                />
              </div>

              <div className="form-btn-group">
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editId ? 'Update Dress' : 'Create Dress'}
                </button>
                {editId && (
                  <button type="button" className="btn-outline" onClick={resetForm}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table / List Card */}
          <div className="admin-card crud-list-card">
            <h3>Catalog Dresses ({dresses.length})</h3>
            {loading ? (
              <div className="admin-loading-inline">
                <div className="spinner"></div>
                <p>Loading dresses...</p>
              </div>
            ) : dresses.length === 0 ? (
              <p className="no-data-msg">No dresses found. Add one on the left!</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Dress Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dresses.map((dress) => (
                      <tr key={dress._id}>
                        <td>
                          <img
                            src={`http://localhost:5000/${dress.image}`}
                            alt={dress.name}
                            className="table-thumbnail"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/100x100?text=Dress';
                            }}
                          />
                        </td>
                        <td className="bold">{dress.name}</td>
                        <td className="table-desc">{dress.description}</td>
                        <td className="bold price">₹{dress.price}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEditClick(dress)}
                              title="Edit Dress"
                            >
                              Edit
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteClick(dress._id, dress.name)}
                              title="Delete Dress"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageDresses;
// 
