import React, { useEffect, useState } from 'react';
import './NotificationPage.css';
import { useNavigate } from 'react-router-dom';

// Dummy notification data (replace with your API call or real data)
const notifications = [
  {
    id: 1,
    image: 'https://via.placeholder.com/100',
    title: 'Thông báo 1',
    content: 'Nội dung của thông báo 1.',
    createdAt: '2025-01-01',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/100',
    title: 'Thông báo 2',
    content: 'Nội dung của thông báo 2.',
    createdAt: '2025-01-02',
  },
  // Add more notifications as needed
];

const NotificationPage = () => {
  const [themeColor, setThemeColor] = useState('#ffffff'); // Default color
    const navigate = useNavigate();
  useEffect(() => {
    // Lấy role từ localStorage
    const userRole = JSON.parse(localStorage.getItem("user"))?.role;

    if(userRole == "ROLE_ADMIN")
    {
        navigate("/register")
    }
    // Đặt màu chủ đạo dựa trên role
    switch (userRole) {
      case 'ROLE_SHIPPER':
        setThemeColor('#ff6f61'); // Admin color
        break;
      case 'ROLE_WAREHOUSE_OWNER':
        setThemeColor('#4caf50'); // User color
        break;
      case 'ROLE_SELLER':
        setThemeColor('#2196f3'); // Guest color
        break;
      case 'ROLE_USER':
        setThemeColor('#2196f3'); // Guest color
        break;
      default:
        setThemeColor('#9e9e9e'); // Default color
        break;
    }
  }, []);

  return (
    <div className="notification-page" style={{ backgroundColor: themeColor }}>
      <h1 className="page-title">Danh sách thông báo</h1>
      <div className="notification-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-card">
            <img
              src={notification.image}
              alt={notification.title}
              className="notification-image"
            />
            <div className="notification-content">
              <h2 className="notification-title" style={{ color: themeColor }}>{notification.title}</h2>
              <p className="notification-text">{notification.content}</p>
              <small className="notification-date">Ngày tạo: {notification.createdAt}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;