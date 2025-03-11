import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import './AddVoucher.css';
import voucherService from "../../../../services/voucher.service";
import { message } from "antd";

const AddVoucher = ({ chooseVoucher, setShowFormAddVoucher,setAlert }) => {
  const [voucher, setVoucher] = useState({
    type: "Giảm tiền ship",
    startDate: "",
    endDate: "",
    maxQuantity: "",
    code: "",
    conditionAmount: "", // New field for conditionAmount
    reduceMaxAmount: "", // New field for reduceMaxAmount
    percentReduce: "", // New field for percentReduce (conditional)
    isActive: true, // Default to true
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);  // Chuyển đổi chuỗi thành đối tượng Date
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (0-based, cần +1)
    const year = date.getFullYear(); // Lấy năm
  
    return `${day}/${month}/${year}`; // Trả về định dạng dd/MM/yyyy
  };
  // Set voucher data when chooseVoucher changes
  useEffect(() => {
    if (chooseVoucher) {
      setVoucher({
        type: chooseVoucher.type || "Giảm tiền ship",
        startDate: formatDate(chooseVoucher.startDate) || "",
        endDate: formatDate(chooseVoucher.endDate) || "",
        maxQuantity: chooseVoucher.maxQuantity || "",
        code: chooseVoucher.code || "",
        conditionAmount: chooseVoucher.conditionAmount || "",
        reduceMaxAmount: chooseVoucher.reduceMaxAmount || "",
        percentReduce: chooseVoucher.percentReduce || "",
        isActive: chooseVoucher.isActive !== undefined ? chooseVoucher.isActive : true,
      });
    }
  }, [chooseVoucher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateVoucherCode = () => {
    return uuidv4().replace(/-/g, '').toUpperCase().slice(0, 10); // Remove hyphens and convert to uppercase
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
    const formattedVoucher = {
      ...voucher,
      startDate: formatDateTime(voucher.startDate, true), // Start date with 00:00:00
      endDate: formatDateTime(voucher.endDate, false), // End date with 23:59:59
    };

    // If the code is empty or just spaces, generate a new code
    if (!voucher.code.trim()) {
      formattedVoucher.code = generateVoucherCode();
    }
    if(chooseVoucher!=null)
    {
      formattedVoucher.id = chooseVoucher.id
    }

    console.log(formattedVoucher);
    const response = await voucherService.add(formattedVoucher); // Send the formatted data to the service
    if(response.status == 200)
    {
      if(chooseVoucher!=null)
      {
        setAlert({
          message:"Cập nhật thông tin voucher thành công",
          type:"success"
        })
      }else{
        setAlert({
          message:"Thêm mới voucher thành công",
          type:"success"
        })
      }
    }else{
      if(chooseVoucher!=null)
        {
          setAlert({
            message:"Cập nhật thông tin voucher thất bại!",
            type:"fail"
          })
        }else{
          setAlert({
            message:"Thêm mới voucher thất bại!",
            type:"fail"
          })
        }
    }
    setShowFormAddVoucher(false); // Close the form after submission

  };

  return (
    <div className="avp-popup">
      <div className="avp-popup-content">
        <h2>Thêm Voucher mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="avp-form-group">
            <label>Mã voucher</label>
            <input
              type="text"
              name="code"
              value={voucher.code}
              onChange={handleChange}
              placeholder="Mã tự nhập hoặc sinh tự động"
            />
          </div>
          <div className="avp-form-group">
            <label>Loại voucher</label>
            <select
              name="type"
              value={voucher.type}
              onChange={handleChange}
            >
              <option value="Giảm tiền ship">Giảm tiền ship</option>
              <option value="Giảm tiền hàng">Giảm tiền hàng</option>
            </select>
          </div>

          <div className="avp-form-group">
            <label>Ngày bắt đầu (dd/MM/yyyy)</label>
            <input
              type="text"
              name="startDate"
              value={voucher.startDate}
              onChange={handleChange}
              placeholder="dd/MM/yyyy"
            />
          </div>

          <div className="avp-form-group">
            <label>Ngày kết thúc (dd/MM/yyyy)</label>
            <input
              type="text"
              name="endDate"
              value={voucher.endDate}
              onChange={handleChange}
              placeholder="dd/MM/yyyy"
            />
          </div>

          <div className="avp-form-group">
            <label>Số lượng</label>
            <input
              type="number"
              name="maxQuantity"
              value={voucher.maxQuantity}
              onChange={handleChange}
            />
          </div>

          {/* New Fields */}
          <div className="avp-form-group">
            <label>Điều kiện giảm giá (Số tiền tối thiểu)</label>
            <input
              type="number"
              name="conditionAmount"
              value={voucher.conditionAmount}
              onChange={handleChange}
              placeholder="Số tiền tối thiểu để áp dụng giảm giá"
            />
          </div>

          <div className="avp-form-group">
            <label>Số tiền giảm tối đa</label>
            <input
              type="number"
              name="reduceMaxAmount"
              value={voucher.reduceMaxAmount}
              onChange={handleChange}
              placeholder="Số tiền giảm tối đa"
            />
          </div>

          {/* Conditionally render percentReduce for 'Giảm tiền hàng' type */}
          {voucher.type === "Giảm tiền hàng" && (
            <div className="avp-form-group">
              <label>Phần trăm giảm giá</label>
              <input
                type="number"
                name="percentReduce"
                value={voucher.percentReduce}
                onChange={handleChange}
                placeholder="Phần trăm giảm giá"
              />
            </div>
          )}

          <div className="avp-form-actions">
            <button type="submit" className="avp-button">{chooseVoucher == null ?"+ Thêm mới":"Cập nhật"}</button>
            <button type="button" className="avp-button avp-cancel" onClick={() => setShowFormAddVoucher(false)}>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVoucher;
