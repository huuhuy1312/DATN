import React, { useEffect, useState } from 'react';
import "./SendNotification.css";
import shipperService from '../../services/shipper.service';
import warehouseService from '../../services/warehouse.service';
import customerService from '../../services/customer.service';
import sellerService from '../../services/seller.service';
import notificationService from '../../services/notification.service';

const SendNotification = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [role, setRole] = useState('');
  const [sender, setSender] = useState('');
  const [search, setSearch] = useState('');
  const [senders, setSenders] = useState([]); // Initialize senders as an empty array
  const [filteredSenders, setFilteredSenders] = useState([]); // Filtered senders

  // Fetch the list of senders based on role
  useEffect(() => {
    const fetchSenders = async () => {
      let response;
      if (role === 'warehouseOwner') {
        response = await warehouseService.getAllNoStatic();
        setSenders(response.data.map(item => ({ value: item.idAccount, label: item.name })));
      } else if (role === 'seller') {
        response = await sellerService.findAll();
        setSenders(response.data.map(item => ({ value: item.idAccount, label: item.shopName })));
      } else if (role === 'customer') {
        response = await customerService.findAll();
        setSenders(response.data.map(item => ({ value: item.idAccount, label: item.fullName })));
      } else if (role === 'shipper') {
        response = await shipperService.all();
        setSenders(response.data.map(item => ({ value: item.idAccount, label: item.name })));
      } else {
        setSenders([]); // Clear senders if no role selected
      }
      console.log(response);
    };

    if (role) {
      fetchSenders();
    } else {
      setSenders([]); // Clear senders if no role selected
    }
  }, [role]);

  // Filter senders based on the search query
  useEffect(() => {
    if (senders && senders.length > 0) {
      setFilteredSenders(
        senders.filter(option =>
          option.label.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [senders, search]);

  // Handle image upload and convert it to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Remove the data:image/xxx;base64, part
        setImage(base64String); // Set the base64 string to state
        setImageURL(reader.result); // Set the image preview URL
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const notificationData = {
      title,
      content,
      image, // Send the base64 string instead of the file
      objectName: role,
      objectId: sender,
    };
  
    try {
      const response = await notificationService.addNotification(notificationData);
      console.log('Notification sent successfully', response);
      
      // Hiển thị thông báo thành công nếu cần
      alert("Thông báo đã được gửi thành công!");
  
      // Reload lại trang
      window.location.reload();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert("Đã xảy ra lỗi khi gửi thông báo.");
    }
  };

  return (
    <div style={{ marginLeft: "5rem", width: "80%" }}>
      <h2 className="sn-heading">Gửi Thông Báo</h2>
      <form onSubmit={handleSubmit} className="sn-form">
        <div className="sn-form-group">
          <label className="sn-label">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề"
            required
            className="sn-input"
          />
        </div>

        <div className="sn-form-group">
          <label className="sn-label">Nội dung</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung thông báo"
            required
            className="sn-textarea"
          />
        </div>

        <div className="sn-form-group">
          <label className="sn-label">Chọn ảnh</label>
          {image && (
            <>

              <img
                src={imageURL}
                alt="Preview"
                className="sn-image-preview"
              />
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="sn-file-input"
          />
          <p className="sn-placeholder">Kéo và thả ảnh vào đây hoặc chọn ảnh</p>
        </div>

        <div className="sn-form-group">
          <label className="sn-label">Chọn đối tượng</label>
          <select
            onChange={(e) => setRole(e.target.value)}
            value={role}
            required
            className="sn-select"
          >
            <option value="">Chọn đối tượng</option>
            <option value="warehouseOwner">Chủ kho hàng</option>
            <option value="seller">Người bán</option>
            <option value="customer">Khách hàng</option>
            <option value="shipper">Shipper</option>
          </select>
        </div>

        {role && (
          <div className="sn-form-group">
            <label className="sn-label">Chọn người gửi</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm tên người gửi"
              className="sn-search-input"
            />
            <select
              onChange={(e) => setSender(e.target.value)}
              value={sender}
              required
              className="sn-select"
            >
              <option value="">Chọn người gửi</option>
              {filteredSenders && filteredSenders.length > 0 ? (
                filteredSenders.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              ) : (
                <option disabled>Không có người gửi</option>
              )}
            </select>
          </div>
        )}

        <button type="submit" className="sn-submit-button">Gửi Thông Báo</button>
      </form>
    </div>
  );
};

export default SendNotification;
