import React from "react";

const SidebarAdmin = ({content,setContent}) => {
  return (
    <div className="spp-sidebar">
        <img src="/icon_shop_main.png" style={{width:"50rem"}}></img>
        <div >
            <ul>
                <li className={content == "Dashboard" ? "active":""} onClick={()=>setContent("Dashboard")}>Bảng điều kiển</li>
                <li className={content == "OperationsManagement" ? "active":""} onClick={()=>setContent("OperationsManagement")}>Quản lý vận hành</li>
                <li className={content == "ManageWarehouse" ? "active":""} onClick={()=>setContent("ManageWarehouse")}>Quản lý kho hàng</li>
                <li className={content == "ManageSeller" ? "active":""} onClick={()=>setContent("ManageSeller")}>Quản lý gian hàng</li>
                <li className={content == "ManageVoucher" ? "active":""} onClick={()=>setContent("ManageVoucher")}>Quản lý mã giảm giá</li>
                <li className={content == "ManageCategory" ? "active":""} onClick={()=>setContent("ManageCategory")}>Quản lý danh mục</li>
                <li className={content == "ManagePayment" ? "active":""} onClick={()=>setContent("ManagePayment")}>Quản lý các giao dịch</li>
                <li className={content == "SendNotification" ? "active":""} onClick={()=>setContent("SendNotification")}>Gửi thông báo</li>
                {/* <li>Thông kê tiền hàng</li>
                <li>Thống kê doanh thu</li>
                <li>Đơn hàng cần xử lý</li>
                <li>Danh sách người nhận</li>
                <li>Tra cứu</li>
                <li>Quản lý bán hàng</li>
                <li>Tiện ích</li>
                <li>Cài đặt tài khoản</li>
                <li>Hỏi đáp trợ giúp</li> */}
            </ul>
    </div>
    </div>
    
  );
};

export default SidebarAdmin;
