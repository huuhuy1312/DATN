import React from "react";

const Sidebar = ({content,setContent}) => {
  return (
    <div className="spp-sidebar">
        <img src="/logo-express.png" style={{width:"20rem"}}></img>
        <div >
            <ul>
                {/* <li className={content == "Dashboard" ? "active":""} onClick={()=>setContent("Dashboard")}>Bảng điều kiển</li> */}
                <li className={content == "OrdersManagement" ? "active":""} onClick={()=>setContent("OrdersManagement")}>Quản lý đơn hàng cần lấy</li>
                <li className={content == "OrdersManagement2" ? "active":""} onClick={()=>setContent("OrdersManagement2")}>Quản lý đơn hàng cần giao</li>
                <li className={content == "ManageShipper" ? "active":""} onClick={()=>setContent("ManageShipper")}>Quản lý shipper</li>
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

export default Sidebar;
