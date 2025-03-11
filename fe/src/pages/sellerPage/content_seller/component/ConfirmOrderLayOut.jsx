import React, { useState, useEffect } from 'react';
import './ConfirmOrderLayOut.css';
import orderlineService from '../../../../services/orderline.service';
import {v4 as uuidv4} from 'uuid';
import typeOfProductService from '../../../../services/type-of-product.service';
const ConfirmOrderLayOut = ({ orderInfo,after }) => {
  const [date, setDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [dateOptions, setDateOptions] = useState([]);
  const [trackingCode, setTrackingCode] = useState('');

  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Hàm chuyển đổi date thành thứ trong tuần
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  };

  // Hàm kiểm tra thời gian và tạo các options cho ngày
  const getDateOptions = (createdDate) => {
    const created = new Date(createdDate);
    const createdHours = created.getHours();
    
    let options = [];

    // Nếu thời gian của createdDate > 5 giờ chiều
    if (createdHours >= 17) {
      // Thêm cả ngày createdDate và ngày tiếp theo
      options.push(created.toISOString().split('T')[0]); // Ngày hiện tại
      const nextDay = new Date(created);
      nextDay.setDate(created.getDate() + 1);
      options.push(nextDay.toISOString().split('T')[0]); // Ngày tiếp theo
    } else {
      // Nếu không, chỉ thêm ngày createdDate
      options.push(created.toISOString().split('T')[0]);
    }

    return options;
  };


  const generateTrackingCode = () => {
    return uuidv4().substring(0,13).toUpperCase();
  };
  const confirmOrder=async ()=>{
    const body ={
        "id": orderInfo.id,
        "waybillCode":trackingCode,
        "status":"Đã xác nhận",
        "sellerPickupRequestDate":date,
        "confirmTime" : new Date(new Date().getTime() + 7 * 60 * 60 * 1000)

    };
    console.log(body)
    const response = await orderlineService.updateOrderLine(body);
    console.log(response)
    // Ensure you're using `for...of` to iterate over an array.
    for (const item of orderInfo?.items || []) {
      // Check that `item` exists and has the required properties.
      if (item?.maxQuantity !== undefined && item?.quantity !== undefined && item?.topId !== undefined) {
        // Ensure that the updateQuantity method is awaited if it's a promise.
        try {
          const response2 = await typeOfProductService.updateQuantity(item.quantity, item.topId);
          console.log('Updated successfully:', response2); // Optionally log the response
        } catch (error) {
          console.error('Error updating quantity:', error);
        }
      }
    }

    after();
  }
  // Cập nhật options và giá trị ngày khi orderInfo thay đổi
  useEffect(() => {
    if (orderInfo?.createdAt) {
      const options = getDateOptions(orderInfo.createdAt);
      setDateOptions(options);
      setDate(options[0]); // Đặt ngày mặc định là ngày đầu tiên trong danh sách options
      setDayOfWeek(getDayOfWeek(options[0])); // Đặt thứ trong tuần
      setTrackingCode(generateTrackingCode()); // Tạo mã vận đơn khi component render lần đầu
    }
  }, [orderInfo]);

  // Cập nhật khi người dùng thay đổi ngày
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setDayOfWeek(getDayOfWeek(selectedDate));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Date:', date);
  };

  return (
    <div className="cfol-layout">
      <div className="cfol-container">
        <h2 className="cfol-header">Chuẩn bị hàng</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vận chuyển</label>
            <p>SPX Express</p>
          </div>

          <div className="form-group colo-order-info">
            <div>
              <label>Mã đơn hàng</label>
              <p>{orderInfo.orderCode}</p>
            </div>
            <div>
              <label>Mã vận đơn</label>
              <p>{trackingCode}</p>
            </div>
          </div>

          <div className="form-group">
            <label>Date</label>
            <div className="date-input-box">
              <select 
                value={date} 
                onChange={handleDateChange} 
                className="date-picker"
              >
                {dateOptions.map((optionDate) => (
                  <option key={optionDate} value={optionDate}>
                    {optionDate}
                  </option>
                ))}
              </select>
              <span className="date-suffix">{dayOfWeek}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Địa chỉ lấy hàng</label>
            <div className="address-box">
              <p>
                {`${orderInfo.addressSeller.nameUser} - ${orderInfo.addressSeller.phoneNumberUser}`}
              </p>
              <p>
                {orderInfo.addressSeller.addressDetails}
              </p>
              <p>{orderInfo.addressSeller.district}<br />{orderInfo.addressSeller.city}</p>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cfol-button cancel" onClick={()=>{after()}}>Hủy</button>
            <button type="submit" className="cfol-button confirm" onClick={()=>{confirmOrder()}}>Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmOrderLayOut;
