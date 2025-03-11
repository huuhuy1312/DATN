import "./ShipperPage.css"
import orderlineService from "../../services/orderline.service";
import { useEffect, useState } from "react";
import tokenService from "../../services/token.service";
import { useNavigate } from 'react-router-dom';
import { use } from "react";
const listStatus = [
    "Chờ xác nhận",//0
    "Đã xác nhận",//1
    "Đang xử lý",//2
    "Đang lấy hàng",//3
    "Đã lấy hàng",//4
    "Đang vận chuyển tới kho đích",//5
    "Đã tới kho đích",//6
    "Đang vận chuyển tới người nhận",//7
    "Đã hoàn thành"//8
  ]
const ShipperPage=()=>{

    const navigate = useNavigate();
    const [listOrderLine,setListOrderLine] = useState([]);
    const [chooseStatus,setChooseStatus] = useState(3);
    const [countOLInfo,setCountOLInfo] = useState(null);
    let user = JSON.parse(localStorage.getItem("user")) || null;
    
    const getOrderline = async () => {
       
        const body = {
            status: listStatus[chooseStatus],
            ...(chooseStatus === 3 
                ? { idPickupShipper: user?.id } 
                : { idDeliveryShipper: user?.id })
        };
        console.log(body)
        // const tokenDecode = tokenService.decodeJwt(user?.token);
        // console.log(tokenDecode)
        const response = await orderlineService.getByCondition(body);
        console.log(response);
        setListOrderLine(response);
    }
    const countOrderLineByType=async ()=>{
        
        const response = await orderlineService.countOrderLineOfShipperByType(user?.id);
        setCountOLInfo(response.data)
      }
    const calculateTotalWeight = (order) => {
        return order.items.reduce((totalWeight, item) => {
            return totalWeight + (item.weight * item.quantity); 
        }, 0); 
      };
    function convertDateFormat(inputDate) {
        // Tạo đối tượng Date từ chuỗi đầu vào
        const date = new Date(inputDate);
    
        // Lấy ngày, tháng và năm
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JS bắt đầu từ 0
        const year = date.getFullYear();
    
        // Kết hợp thành chuỗi theo định dạng dd/MM/yyyy
        return `${day}/${month}/${year}`;
    }
    const logOut = (e) => {
        e.preventDefault();  
        localStorage.removeItem('user');
        navigate('/register'); 
      };
    const updateStatusOrderline = async (id, chooseStatus) => {
        try {
            // Get current time and add 7 hours
            const currentTime = new Date();
            currentTime.setHours(currentTime.getHours() + 7); // Add 7 hours to current time
            console.log(chooseStatus)
            const body = {
                id: id,
                status: chooseStatus === 3 ? "Đã lấy hàng" : "Đã hoàn thành",
            };
            if(chooseStatus == 3)
            {
                body.shipperPickupTime = currentTime
            }else{
                body.doneTime = currentTime;
            }
    
            const response = await orderlineService.updateOrderLine(body);
            console.log(response);
            countOrderLineByType()
            // Call the function to refresh the order line after updating the status
            getOrderline();
        } catch (error) {
            console.error("Error updating order line:", error);
        }
    };
    
    function formatPriceToVND(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }
    
    useEffect(()=>{
        
            countOrderLineByType()
            getOrderline();
        
        console.log(chooseStatus)
    },[chooseStatus])
    return(
        <div>
            {/* Top Navigation */}
            <div className="sp-top-nav">
                <h1 className="sp-title">Quản lý đơn hàng</h1>
                {/* <div className="sp-user-info">
                    <img src="avatar.png" alt="Avatar" className="sp-avatar" />
                    <span className="sp-username">Nguyễn Văn A</span>
                    <ul class="header__navbar-user-menu" style={{display:"block"}}>
                                <li class="header__navbar-user-item" >
                                    <a href="/user/view-account">Tài khoản của tôi</a>
                                </li>
                                <li class="header__navbar-user-item">
                                    <a href="">Địa chỉ của tôi</a>
                                </li>
                                <li class="header__navbar-user-item">
                                    <a href="">Đơn mua</a>
                                </li>
                                <li class="header__navbar-user-item header__navbar-user-item--separate">
                                    <a href="">Đăng xuất</a>
                                </li>
                            </ul>
                </div> */}
                <li class="header__navbar-item header__navbar-user">
                            <img src="/avatar.png" alt="" class="header__navbar-user-avatar" style={{width:35,height:35}}/>
                            <span class="header__navbar-user-name">Hữu Huy</span>
                            <ul class="header__navbar-user-menu">
                                <li class="header__navbar-user-item" >
                                    <a href="">Tài khoản của tôi</a>
                                </li>
                                <li class="header__navbar-user-item header__navbar-user-item--separate">
                                    <a href="/#" onClick={logOut}>Đăng xuất</a>
                                </li>
                            </ul>
                        </li>
            </div>

            {/* Search Bar with Filters */}
            <div className="sp-search-bar">
                <input type="text" placeholder="Tìm đơn hàng" className="sp-input" />
                <input type="text" placeholder="dd/mm/yyyy" className="sp-input" />
                <input type="text" placeholder="dd/mm/yyyy" className="sp-input" />
                <select className="sp-select">
                    <option value="">Tất cả kho hàng</option>
                    {/* Add options here */}
                </select>
                <select className="sp-select">
                    <option value="">Người trả cước</option>
                    {/* Add options here */}
                </select>
                <select className="sp-select">
                    <option value="">Chọn theo dịch vụ</option>
                    {/* Add options here */}
                </select>
                <button className="sp-search-button">Tìm kiếm</button>
            </div>

            {/* Action Buttons */}
            {/* <div className="sp-action-buttons">
                <button className="sp-button">IN ĐƠN</button>
                <button className="sp-button">XUẤT EXCEL</button>
                <button className="sp-button">NHẬP EXCEL</button>
            </div> */}

            {/* Order Summary Cards */}
            <div className="sp-order-summary">
                <div className="sp-summary-card">
                    <p><strong>Tổng số đơn</strong></p>
                    <p>{`${countOLInfo?.total} đơn`}</p>
                </div>
                <div className={ chooseStatus == 3?"sp-summary-card-active":"sp-summary-card"} onClick={()=>setChooseStatus(3)}>
                    <p><strong>Đơn hàng cần lấy</strong></p>
                    <p>{`${countOLInfo?.waitPickUp} đơn`}</p>
                </div>
                <div className={ chooseStatus == 7?"sp-summary-card-active":"sp-summary-card"} onClick={()=>setChooseStatus(7)}>
                    <p><strong>Đơn hàng cần giao</strong></p>
                    <p>{`${countOLInfo?.deliveringToReceiver} đơn`}</p>
                </div>
                <div className={ chooseStatus == 8?"sp-summary-card-active":"sp-summary-card"} onClick={()=>setChooseStatus(8)}>
                    <p><strong>Đơn hàng hoàn thành</strong></p>
                    <p>{`${countOLInfo?.done} đơn`}</p>
                </div>
                <div className="sp-summary-card">
                    <p><strong>Đơn hàng trả về</strong></p>
                    <p>26 đơn</p>
                </div>
            </div>

            {/* Order List Table */}
            <div className="sp-order-list">
                <table className="sp-table">
                    <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Người gửi</th>
                            <th>Người nhận</th>
                            <th>Ngày lấy hàng</th>
                            <th>Cân nặng</th>
                            <th>P. thức vận chuyển</th>
                            <th>Tổng cước</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOrderLine.map((item,index)=>{
                            return(
                                <tr>
                                    <td>{item.waybillCode}</td>
                                    <td>
                                        <div>{`${item.addressCustomer.nameUser}-${item.addressCustomer.phoneNumberUser}`}</div>
                                        <div>{`${item.addressCustomer.addressDetails}, ${item.addressCustomer.ward}, ${item.addressCustomer.district}, ${item.addressCustomer.city}`}</div>
                                    </td>
                                    <td>
                                        <div>{`${item.addressSeller.nameUser}-${item.addressSeller.phoneNumberUser}`}</div>
                                        <div>{`${item.addressSeller.addressDetails}, ${item.addressSeller.ward}, ${item.addressSeller.district}, ${item.addressSeller.city}`}</div>
                                    </td>
                                    <td>{convertDateFormat(item.sellerPickupRequestDate)}</td>
                                    <td>{`${calculateTotalWeight(item)}(gram)`}</td>
                                    <td>{item.shippingMethods.name}</td>
                                    <td>{formatPriceToVND(item.totalAmount + item.shipCost - item.reduceAmount)}</td>
                                    <td>
                                        {chooseStatus==3 && <button className="sp-complete-button" onClick={()=>{updateStatusOrderline(item?.id,chooseStatus)}}>Đã lấy hàng</button>}
                                        {chooseStatus==7 && <button className="sp-complete-button" onClick={()=>{updateStatusOrderline(item?.id,chooseStatus)}}>Đã giao hàng</button>}
                                    </td>
                                </tr>
                            )
                        })}
                        
                        {/* Add more rows as needed */}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default ShipperPage;