import React, { useEffect, useState } from "react";
import AddVoucher from "./AddShipper";
import shipperService from "../../../../services/shipper.service";
import AddShipper from "./AddShipper";
import AlertNotification from "../../../components/AlertNotification";


const ManageShipper = () => {
  const [listShipper,setListShipper] = useState([])
  const [showFormAddShipper,setShowFormAddShipper] = useState(false);
  const [chooseShipper,setChooseShipper] = useState(null);
  const [alert,setAlert] = useState(null)
  const user = JSON.parse(localStorage.getItem("user"));
  const formatPriceToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getAllShipper=async ()=>{
    const shipper = await shipperService.statisByWarehouse(user?.id)
    console.log(shipper)
    setListShipper(shipper)
  }

  useEffect(()=>{
    getAllShipper()
  },[showFormAddShipper])

  function formatDate(dateString) {
    let date = new Date(dateString);
    
    // Định dạng ngày theo dd/mm/yyyy
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');  // Tháng bắt đầu từ 0
    let year = date.getFullYear();

    // Trả về định dạng ngày theo dd/mm/yyyy
    return `${day}/${month}/${year}`;
}


  return (
    <div style={{ width: "100%" }}>
        {showFormAddShipper== true && <AddShipper chooseShipper={chooseShipper} setShowFormAddShipper={setShowFormAddShipper} setAlert={setAlert}/>}
        {alert && (
        <AlertNotification
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)} // Đóng thông báo
        />
      )}
      <div className="spp-main-content">
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <h1 className="spp-title">Quản lý shipper</h1>
        </div>
        <div className="spp-actions">
        <button onClick={()=>{setShowFormAddShipper(true);setChooseShipper(null)}}>+ Thêm shipper mới</button>
       
        </div>
        <div className="spp-actions"></div>
        <table className="spp-order-table">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Mã shipper</th>
              <th style={{ width: "20%" }}>Thông tin shipper</th>
              <th style={{ width: "10%" }}>Số đơn đang lấy hàng</th>
              <th style={{ width: "10%" }}>Số đơn đang ship</th>
              <th style={{ width: "10%" }}>Số đơn đã hoàn thành</th>
              <th style={{ width: "10%" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {listShipper.map((shipper, index) => (
              <tr key={index}>
                <td>{shipper.code}</td>
                <td>
                  <div>Họ và tên: {shipper.name}</div>
                  <div>Số điện thoại: {shipper.phoneNumber}</div>
                </td>
                <td>{shipper?.pickingUpOrdersCount} đơn hàng</td>
                <td>{shipper?.shippingOrdersCount} đơn hàng</td>
                <td>{shipper?.doneOrdersCount} đơn hàng</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle',width:"10%" }}>
                                                    <button className="btn btn-primary btn-sm trash" type="button" style={{width:"3.5rem",padding:"0.5rem",marginRight:"1rem"}} title="Xóa" >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                    <button className="btn btn-primary btn-sm edit" type="button" style={{width:"3.5rem",padding:"0.5rem"}} title="Sửa" id="show-emp" data-toggle="modal" data-target="#ModalUP" onClick={()=>{setChooseShipper(shipper);setShowFormAddShipper(true)}}>
                                                        <i className="fas fa-edit" ></i>
                                                    </button>
                                                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageShipper;
