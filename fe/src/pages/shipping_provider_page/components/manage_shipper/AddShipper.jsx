import React, { useState, useEffect } from "react";
import './AddVoucher.css';
import shipperService from "../../../../services/shipper.service";
import { message } from "antd";

const AddShipper = ({ chooseShipper, setShowFormAddShipper,setAlert }) => {
  const [shipper, setShipper] = useState({
    code: "",
    name: "",
    username: "",
    phoneNumber: "",  
    password: "",
    newPassword:""
   
  });

  useEffect(() => {
    if (chooseShipper) {
      setShipper({
        code: chooseShipper.code || "",
        name : chooseShipper.name || "",
        phoneNumber : chooseShipper.phoneNumber|| "",
        username : chooseShipper.username|| ""
      });
    }
  }, [chooseShipper]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipper((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const formatDateTime = (dateStr, isStartDate) => {
    // Convert from dd/MM/yyyy to yyyy-MM-dd and add time
    const [day, month, year] = dateStr.split('/');
    const time = isStartDate ? "00:00:00" : "23:59:59"; // Add 00:00:00 for start date and 23:59:59 for end date
    return `${year}-${month}-${day} ${time}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the dates to the correct format with times
    const formattedShipper = {
      ...shipper,
    };

    if(chooseShipper!=null)
    {
      formattedShipper.id = chooseShipper.id
    }
    const response = await shipperService.add(formattedShipper); // Send the formatted data to the service
    setShowFormAddShipper(false); // Close the form after submission
    if(response.status == 200)
    {
      if(chooseShipper!=null)
      {
        setAlert({message:"Cập nhật thông tin Shipper thành công!",type:"success"})
      }else{
        setAlert({message:"Thêm mới Shipper thành công!",type:"success"})
      }
    }else{
        setAlert({message:"Thao tác thất bại! Vui lòng thử lại!",type:"fail"})
    }
  };

  return (
    <div className="avp-popup">
      <div className="avp-popup-content">
        <h2>Thêm Shipper mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="avp-form-group">
            <label>Mã shipper</label>
            <input
              type="text"
              name="code"
              value={shipper.code}
              onChange={handleChange}
              placeholder="Mã tự nhập hoặc sinh tự động"
            />
          </div>

          <div className="avp-form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              value={shipper.name}
              onChange={handleChange}
              placeholder="Họ và tên"
            />
          </div>

          <div className="avp-form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={shipper.phoneNumber}
              onChange={handleChange}
              placeholder="Số điện thoại"
            />
          </div>

          <div className="avp-form-group">
                  <label>Tài khoản</label>
                  <input
                    type="text"
                    name="username"
                    value={shipper.username}
                    onChange={handleChange}
                    disabled={chooseShipper !== null}  // Disable input when chooseShipper is not null
                  />
                </div>
          {/* Conditionally render percentReduce for 'Giảm tiền hàng' type */}
          {/* Conditionally render percentReduce for 'Giảm tiền hàng' type */}
            {chooseShipper==null && (
              <>
                <div className="avp-form-group">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    value={shipper.password}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            {chooseShipper!=null &&(
              <div className="avp-form-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  name="newPassword"
                  value={shipper.newPassword}
                  onChange={handleChange}
                />
              </div>
            )}


          <div className="avp-form-actions">
            <button type="submit" className="avp-button">{chooseShipper == null ?"+ Thêm mới":"Cập nhật"}</button>
            <button type="button" className="avp-button avp-cancel" onClick={() => setShowFormAddShipper(false)}>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShipper;
