import React, { useEffect, useState } from 'react';
import { fetchNotifications } from '../api/notifications';
import { Link } from 'react-router-dom';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };

    getNotifications();
  }, []);

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  return (
    <>
      <div className="notification-center" style={{ 
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div className="notification-header">
          Notifications
        </div>
        <div className="notification-list">
          {notifications.map(notification => (
            <div className="notification-item" key={notification.id}>
              <div className="notification-content">
                {notification.content}
              </div>
              <div className="notification-time">
                {new Date(notification.timestamp).toLocaleString()}
              </div>
              <button 
                className="view-details-btn"
                style={{
                  backgroundColor: '#212529',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  marginTop: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => handleViewDetails(notification)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
        <div className="notification-badge">
          {notifications.length}
        </div>
        <Link 
          to="/dashboard" 
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '10px',
            color: '#007bff',
            textDecoration: 'none'
          }}
        >
          View All in Dashboard
        </Link>
      </div>

      {showModal && selectedNotification && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <h3>Notification Details</h3>
            <p>{selectedNotification.content}</p>
            <p>Date: {new Date(selectedNotification.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationCenter;