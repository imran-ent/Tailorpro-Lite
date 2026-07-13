import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import AdminSidebar from '../components/AdminSidebar';
import { ToastContext } from '../context/ToastContext';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [phone, setPhone] = useState('');
  const [dressName, setDressName] = useState('');
  const [status, setStatus] = useState('Pending');

  // Edit states
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Could not load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerId('');
    setPhone('');
    setDressName('');
    setStatus('Pending');
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerId.trim() || !phone.trim() || !dressName.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const orderData = {
      customerName: customerName.trim(),
      customerId: customerId.trim().toUpperCase(),
      phone: phone.trim(),
      dressName: dressName.trim(),
      status,
    };

    try {
      setIsSubmitting(true);
      if (editId) {
        // Edit existing order
        await api.put(`/orders/${editId}`, orderData);
        showToast('Order details updated successfully!', 'success');
      } else {
        // Create new order
        await api.post('/orders', orderData);
        showToast('New order registered successfully!', 'success');
      }
      resetForm();
      fetchOrders();
    } catch (error) {
      console.error('Order submit error:', error);
      showToast(error.response?.data?.message || 'Failed to save order details', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (order) => {
    setEditId(order._id);
    setCustomerName(order.customerName);
    setCustomerId(order.customerId);
    setPhone(order.phone);
    setDressName(order.dressName);
    setStatus(order.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusToggle = async (order) => {
    const nextStatus = order.status === 'Pending' ? 'Done' : 'Pending';
    try {
      await api.put(`/orders/${order._id}`, {
        status: nextStatus,
      });
      showToast(`Status updated to ${nextStatus}`, 'success');
      // Update locally immediately to avoid loading flash
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status: nextStatus } : o))
      );
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Failed to toggle order status', 'error');
    }
  };

  const handleDeleteClick = async (id, name, customerId) => {
    const confirmDelete = window.confirm(
      `Delete order for "${name}" (ID: ${customerId})? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/orders/${id}`);
      showToast('Order record deleted successfully', 'success');
      fetchOrders();
      if (editId === id) {
        resetForm();
      }
    } catch (error) {
      console.error('Delete order error:', error);
      showToast(error.response?.data?.message || 'Failed to delete order', 'error');
    }
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.dressName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h2>Manage Orders</h2>
          <p>Register new tailoring intakes and modify job statuses.</p>
        </div>

        <div className="admin-crud-container">
          {/* Form Box */}
          <div className="admin-card crud-form-card">
            <h3>{editId ? 'Modify Order Details' : 'Register New Order'}</h3>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Jessica Alba"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Customer ID (Unique Receipt Code) *</label>
                <input
                  type="text"
                  placeholder="e.g. ORD1004"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543211"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Dress Name (Stitching Type) *</label>
                <input
                  type="text"
                  placeholder="e.g. Lehenga or Kurti"
                  value={dressName}
                  onChange={(e) => setDressName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="form-btn-group">
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editId ? 'Update Order' : 'Register Order'}
                </button>
                {editId && (
                  <button type="button" className="btn-outline" onClick={resetForm}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Orders Table */}
          <div className="admin-card crud-list-card">
            <div className="list-card-header">
              <h3>Orders Log ({filteredOrders.length})</h3>
              <input
                type="text"
                placeholder="Search by ID, Name or Dress..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="table-search-input"
              />
            </div>

            {loading ? (
              <div className="admin-loading-inline">
                <div className="spinner"></div>
                <p>Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <p className="no-data-msg">No matching orders found.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Customer Name</th>
                      <th>Dress Name</th>
                      <th>Phone</th>
                      <th>Status (Click to toggle)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="bold highlight-id">{order.customerId}</td>
                        <td className="bold">{order.customerName}</td>
                        <td>{order.dressName}</td>
                        <td>{order.phone}</td>
                        <td>
                          <button
                            onClick={() => handleStatusToggle(order)}
                            className={`table-status-toggle-btn ${
                              order.status === 'Done' ? 'status-done' : 'status-pending'
                            }`}
                            title="Click to toggle status"
                          >
                            {order.status === 'Done' ? 'Done ✓' : 'Pending 🪡'}
                          </button>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEditClick(order)}
                              title="Edit Details"
                            >
                              Edit
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() =>
                                handleDeleteClick(order._id, order.customerName, order.customerId)
                              }
                              title="Delete Record"
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

export default ManageOrders;
// 
