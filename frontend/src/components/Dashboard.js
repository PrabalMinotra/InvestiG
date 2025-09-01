import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  const markAsReviewed = async (notificationId) => {
    await fetch(`/api/notifications/${notificationId}/review`, {
      method: 'POST'
    });
    // Refresh notifications
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? {...notif, reviewed: true} : notif
    );
    setNotifications(updatedNotifications);
  };

  return (
    <div className="dashboard">
      {/* ...existing code... */}
      <div className="notifications-section">
        <h3>Notifications</h3>
        {notifications.map(notification => (
          <div key={notification.id} className="notification-item">
            <p>{notification.message}</p>
            <p>Date: {new Date(notification.timestamp).toLocaleString()}</p>
            {!notification.reviewed && (
              <button 
                className="review-btn"
                style={{
                  backgroundColor: '#212529',
                  color: 'black',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => markAsReviewed(notification.id)}
              >
                Mark as Reviewed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;