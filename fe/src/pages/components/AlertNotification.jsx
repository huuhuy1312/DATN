import React, { useEffect, useState } from "react";

const AlertNotification = ({ message, type, onClose }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // Kích hoạt hiệu ứng mờ dần
    }, 2500); // Bắt đầu mờ dần sau 2.5 giây

    const closeTimer = setTimeout(() => {
      onClose(); // Đóng hoàn toàn sau 3 giây
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const styles = {
    container: {
      position: "fixed",
      top: 20,
      right: 20,
      zIndex: 1000,
      padding: "10px 20px",
      borderRadius: "5px",
      color: "#fff",
      backgroundColor: type === "success" ? "green" : "red",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
      opacity: fadeOut ? 0 : 0.9, // Đặt opacity giảm dần
      transition: "opacity 0.5s ease", // Thêm hiệu ứng chuyển đổi mờ dần
    },
  };

  return <div style={styles.container}>{message}</div>;
};

export default AlertNotification;
