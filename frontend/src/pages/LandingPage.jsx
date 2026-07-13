import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import OrderStatus from '../components/OrderStatus';
import { ToastContext } from '../context/ToastContext';

const LandingPage = () => {
  const [dresses, setDresses] = useState([]);
  const [loadingDresses, setLoadingDresses] = useState(true);
  const [customerIdInput, setCustomerIdInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [bookForm, setBookForm] = useState({ customerName: '', phone: '', dressName: '' });
  const [loadingBook, setLoadingBook] = useState(false);
  const [bookedOrder, setBookedOrder] = useState(null);
  
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchDresses();
  }, []);

  const fetchDresses = async () => {
    try {
      setLoadingDresses(true);
      const { data } = await api.get('/dresses');
      setDresses(data);
    } catch (error) {
      console.error('Error fetching dresses:', error);
      showToast('Could not load dresses. Please try refreshing.', 'error');
    } finally {
      setLoadingDresses(false);
    }
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!customerIdInput.trim()) {
      showToast('Please enter a Customer ID to track', 'error');
      return;
    }

    try {
      setLoadingTrack(true);
      setTrackError('');
      setTrackedOrder(null);
      
      const { data } = await api.get(`/orders/track/${customerIdInput.trim()}`);
      setTrackedOrder(data);
      showToast('Order details fetched successfully!', 'success');
    } catch (error) {
      console.error('Tracking error:', error);
      const errMsg = error.response?.data?.message || 'No order found with that Customer ID.';
      setTrackError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoadingTrack(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookDress = (dressName) => {
    setBookForm((prev) => ({ ...prev, dressName }));
    scrollToSection('book');
  };

  const handleBookOrder = async (e) => {
    e.preventDefault();
    if (!bookForm.customerName.trim() || !bookForm.phone.trim() || !bookForm.dressName.trim()) {
      showToast('Please fill in all booking fields', 'error');
      return;
    }

    try {
      setLoadingBook(true);
      setBookedOrder(null);
      const { data } = await api.post('/orders/book', {
        customerName: bookForm.customerName.trim(),
        phone: bookForm.phone.trim(),
        dressName: bookForm.dressName.trim(),
      });
      setBookedOrder(data);
      showToast(`Order booked! Your Customer ID is ${data.customerId}`, 'success');
      setBookForm({ customerName: '', phone: '', dressName: '' });
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Could not book your order. Please try again.';
      showToast(errMsg, 'error');
    } finally {
      setLoadingBook(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Tailored for Your Perfect Fit</h1>
          <p className="hero-subtitle">
            Bespoke stitching, customized designs, and premium alteration services tailored to your exact measurements.
          </p>
          <div className="hero-cta-group">
            <button className="btn-primary" onClick={() => scrollToSection('book')}>
              Book Your Order
            </button>
            <button className="btn-outline-white" onClick={() => scrollToSection('dresses')}>
              Explore Dresses
            </button>
            <button className="btn-outline-white" onClick={() => scrollToSection('track')}>
              Track Your Order
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-image-placeholder">
            <span className="thread-needle-art">🪡🧵👗</span>
          </div>
          <div className="about-text-content">
            <span className="section-badge">About TailorPro</span>
            <h2 className="section-title">Where Fabric Meets Master Craftsmanship</h2>
            <p className="section-paragraph">
              At TailorPro, we believe that clothes should not only look outstanding but fit you like a second skin. 
              Our master artisans possess years of tailoring heritage, combining traditional methods with modern designs.
            </p>
            <p className="section-paragraph">
              We specialize in full customization for bridal wear, festive clothes, daily kurtis, and children outfits. 
              With a commitment to pristine styling, high-quality lining, and prompt delivery schedules, we are your 
              ideal design partners.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container-heading">
          <span className="section-badge">What We Do</span>
          <h2 className="section-title">Our Premium Tailoring Services</h2>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📐</div>
            <h3>Bespoke Stitching</h3>
            <p>From initial design sketches and sizing measurements to the final master stitch, we build outfits entirely customized for you.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🪡</div>
            <h3>Expert Alterations</h3>
            <p>Modify and perfect your existing wardrobe. Sizing adjustments, neck restorations, hem linings, and fit corrections.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">✨</div>
            <h3>Heavy Embroidery</h3>
            <p>Stunning handcrafting including Zardozi, beadworks, stone placements, and custom patterns for bridal blouse sets.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">📦</div>
            <h3>Express Delivery</h3>
            <p>Need your dress urgently for an upcoming event? Opt for our express service with guaranteed quality checkpoints.</p>
          </div>
        </div>
      </section>

      {/* Dress Menu Section */}
      <section id="dresses" className="dresses-section">
        <div className="container-heading">
          <span className="section-badge">Our Collection</span>
          <h2 className="section-title">Available Dresses</h2>
          <p className="section-desc">Explore starting prices for custom stitching. Select your dress type and consult with us.</p>
        </div>

        {loadingDresses ? (
          <div className="dresses-loading">
            <div className="spinner"></div>
            <p>Loading available designs...</p>
          </div>
        ) : dresses.length === 0 ? (
          <div className="dresses-empty">
            <p>No dress items are currently available in the menu. Check back later.</p>
          </div>
        ) : (
          <div className="dresses-grid">
            {dresses.map((dress) => (
              <div className="dress-card" key={dress._id}>
                <div className="dress-image-wrapper">
                  <img
                    src={`http://localhost:5000/${dress.image}`}
                    alt={dress.name}
                    className="dress-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x300?text=Dress+Image';
                    }}
                  />
                  <div className="dress-price-tag">Starting from ₹{dress.price}</div>
                </div>
                <div className="dress-info">
                  <h3>{dress.name}</h3>
                  <p>{dress.description}</p>
                  <button className="dress-cta-btn" onClick={() => handleBookDress(dress.name)}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Book Order Section */}
      <section id="book" className="book-section">
        <div className="book-container">
          <div className="book-form-box">
            <span className="section-badge">Place Order</span>
            <h2 className="section-title">Book Your Dress for Stitching</h2>
            <p className="section-desc">
              Submit your details and we will assign you a unique Customer ID to track your order progress.
            </p>

            <form onSubmit={handleBookOrder} className="book-form">
              <div className="book-form-group">
                <label htmlFor="book-name">Full Name</label>
                <input
                  id="book-name"
                  type="text"
                  placeholder="Your full name"
                  value={bookForm.customerName}
                  onChange={(e) => setBookForm({ ...bookForm, customerName: e.target.value })}
                  className="book-input"
                  required
                />
              </div>
              <div className="book-form-group">
                <label htmlFor="book-phone">Phone Number</label>
                <input
                  id="book-phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={bookForm.phone}
                  onChange={(e) => setBookForm({ ...bookForm, phone: e.target.value })}
                  className="book-input"
                  required
                />
              </div>
              <div className="book-form-group">
                <label htmlFor="book-dress">Dress Type</label>
                <select
                  id="book-dress"
                  value={bookForm.dressName}
                  onChange={(e) => setBookForm({ ...bookForm, dressName: e.target.value })}
                  className="book-input book-select"
                  required
                >
                  <option value="">Select a dress type</option>
                  {dresses.map((dress) => (
                    <option key={dress._id} value={dress.name}>{dress.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary btn-book" disabled={loadingBook}>
                {loadingBook ? 'Booking...' : 'Book Order'}
              </button>
            </form>
          </div>

          <div className="book-result-box">
            {bookedOrder ? (
              <div className="book-success-card">
                <span className="book-success-badge">Order Confirmed</span>
                <h3>Your booking is registered</h3>
                <p>Please save your Customer ID to track stitching progress.</p>
                <div className="book-id-display">
                  <span className="book-id-label">Customer ID</span>
                  <span className="book-id-value">{bookedOrder.customerId}</span>
                </div>
                <ul className="book-summary">
                  <li><strong>Name:</strong> {bookedOrder.customerName}</li>
                  <li><strong>Phone:</strong> {bookedOrder.phone}</li>
                  <li><strong>Dress:</strong> {bookedOrder.dressName}</li>
                  <li><strong>Status:</strong> {bookedOrder.status}</li>
                </ul>
                <button
                  type="button"
                  className="btn-outline book-track-btn"
                  onClick={() => {
                    setCustomerIdInput(bookedOrder.customerId);
                    scrollToSection('track');
                  }}
                >
                  Track This Order
                </button>
              </div>
            ) : (
              <div className="book-placeholder">
                <img src="/logo-icon.svg" alt="" className="book-placeholder-logo" aria-hidden="true" />
                <h3>Ready to stitch your perfect fit?</h3>
                <p>Choose a dress from our collection or fill the form to book your custom stitching order.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Track Order Section */}
      <section id="track" className="track-section">
        <div className="track-container">
          <div className="track-form-box">
            <span className="section-badge light">Status Lookup</span>
            <h2>Track Your Order Status</h2>
            <p className="track-intro">
              Enter the unique Customer ID printed on your tailor receipt to track your stitching progress in real time.
            </p>
            <form onSubmit={handleTrackOrder} className="track-form">
              <input
                type="text"
                placeholder="e.g. ORD1001"
                value={customerIdInput}
                onChange={(e) => setCustomerIdInput(e.target.value)}
                className="track-input"
              />
              <button type="submit" className="btn-primary btn-track" disabled={loadingTrack}>
                {loadingTrack ? 'Searching...' : 'Track Status'}
              </button>
            </form>

            {trackError && (
              <div className="track-error-box">
                <span className="error-icon">⚠️</span>
                <p>{trackError}</p>
              </div>
            )}
          </div>

          <div className="track-result-box">
            {trackedOrder ? (
              <OrderStatus order={trackedOrder} />
            ) : (
              <div className="track-placeholder">
                <div className="placeholder-art">🔍</div>
                <p>Waiting for tracking search query. Enter your Customer ID on the left to see progress.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
