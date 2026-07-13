import React from 'react';

const OrderStatus = ({ order }) => {
  const isDone = order.status === 'Done';

  return (
    <div className="order-status-card">
      <div className="order-status-header">
        <h3>Order Details</h3>
        <span className={`status-badge ${isDone ? 'status-done' : 'status-pending'}`}>
          {isDone ? 'Done ✓' : 'Pending 🪡'}
        </span>
      </div>

      <div className="order-details-grid">
        <div className="detail-item">
          <span className="detail-label">Customer Name</span>
          <span className="detail-value">{order.customerName}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Customer ID</span>
          <span className="detail-value highlight-id">{order.customerId}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Dress Name</span>
          <span className="detail-value">{order.dressName}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Contact Number</span>
          <span className="detail-value">{order.phone}</span>
        </div>
      </div>

      {/* Visual Progress Indicator */}
      <div className="progress-timeline-container">
        <div className="progress-line">
          <div className="progress-line-fill" style={{ width: isDone ? '100%' : '50%' }}></div>
        </div>
        <div className="progress-steps">
          <div className="step active">
            <div className="step-circle">1</div>
            <div className="step-label">Order Pending (Stitching)</div>
          </div>
          <div className={`step ${isDone ? 'active' : ''}`}>
            <div className="step-circle">{isDone ? '✓' : '2'}</div>
            <div className="step-label">Order Done (Ready for Pickup)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
