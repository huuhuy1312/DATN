import React, { useEffect, useState } from "react";
import voucherService from "../../../../services/voucher.service";
import AddVoucher from "./AddVoucher";
import AlertNotification from "../../../components/AlertNotification";

const listStatus = [
  "Chờ xác nhận", // 0
  "Đã xác nhận", // 1
  "Đang xử lý", // 2
  "Đang lấy hàng", // 3
  "Đã lấy hàng", // 4
  "Đang vận chuyển tới kho đích", // 5
  "Đã tới kho đích", // 6
  "Đang vận chuyển tới người nhận", // 7
  "Đã hoàn thành", // 8
];

const ManageVoucher = () => {
  const [listVoucher,setListVoucher] = useState([])
  const [showFormAddVoucher,setShowFormAddVoucher] = useState(false);
  const [chooseVoucher,setChooseVoucher] = useState(null);
  const [alert,setAlert] = useState(null)
  const formatPriceToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getAllVoucher=async ()=>{
    const response = await voucherService.getAll();
    let combinedVouchers = [...response.listShippingVoucher, ...response.listDiscountVoucher];
    combinedVouchers.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    console.log(combinedVouchers)
    setListVoucher(combinedVouchers);
  }

  useEffect(()=>{
    getAllVoucher()
  },[showFormAddVoucher])

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
      {alert && (
        <AlertNotification
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)} // Đóng thông báo
        />
      )}
        {showFormAddVoucher== true && <AddVoucher chooseVoucher={chooseVoucher} setShowFormAddVoucher={setShowFormAddVoucher} setAlert={setAlert}/>}
      <div className="spp-main-content">
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <h1 className="spp-title">Quản lý voucher</h1>
        </div>
        <div className="spp-actions">
        <button onClick={()=>setShowFormAddVoucher(true)}>+ Thêm voucher mới</button>
       
        </div>
        <div className="spp-actions"></div>
        <table className="spp-order-table">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Mã voucher</th>
              <th style={{ width: "20%" }}>Mô tả</th>
              <th style={{ width: "10%" }}>Loại voucher</th>
              <th style={{ width: "10%" }}>Ngày bắt đầu</th>
              <th style={{ width: "10%" }}>Ngày kết thúc</th>
              <th style={{ width: "10%" }}>Số lượng</th>
              <th style={{ width: "10%" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {listVoucher.map((voucher, index) => (
              <tr key={index}>
                <td>{voucher.code}</td>
                <td>
                {
                  voucher.type == "Giảm tiền ship" &&(
                    <div>Giảm tối đa {formatPriceToVND(voucher.reduceMaxAmount)} cho đơn từ {formatPriceToVND(voucher.conditionAmount)}</div>
                  )
                }
                {
                  voucher.type == "Giảm tiền hàng" &&(
                    <div>Giảm {voucher.percentReduce}% , tối đa {formatPriceToVND(voucher.reduceMaxAmount)} cho đơn từ {formatPriceToVND(voucher.conditionAmount)}</div>
                  )
                }
                </td>

                <td>{voucher.type}</td>
                <td>{formatDate(voucher.startDate)}</td>
                <td>{formatDate(voucher.endDate)}</td>
                <td>{voucher.maxQuantity == null ?"Không giới hạn":voucher.maxQuantity}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle',width:"10%" }}>
                                                    <button className="btn btn-primary btn-sm trash" type="button" style={{width:"3.5rem",padding:"0.5rem",marginRight:"1rem"}} title="Xóa" >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                    <button className="btn btn-primary btn-sm edit" type="button" style={{width:"3.5rem",padding:"0.5rem"}} title="Sửa" id="show-emp" data-toggle="modal" data-target="#ModalUP" onClick={()=>{setChooseVoucher(voucher);setShowFormAddVoucher(true)}}>
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

export default ManageVoucher;
