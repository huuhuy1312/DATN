import Header from "../components/Header";
import "./my-account-page.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClipboardList, faPen, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import OrderList from "./component.jsx/orderList/OrderList";
import { useEffect, useState } from "react";
import AddressComponent from "./component.jsx/addressComponent/addressComponent";
import ProfileComponent from "./component.jsx/profileComponent";
import userService from "../../services/user.service";
import authService from "../../services/auth.service";
import customerService from "../../services/customer.service";


function MyAccountPage(){

    const [choosePage,setChoosePage] = useState("Addresses")
    const [fullInfoCustomer,setFullInfoCustomer] = useState(null);
    
    const getFullInfoCustomer = async ()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await customerService.getByCustomerID(user?.id);
        if(response.status == 200)
        {
            setFullInfoCustomer(response.data)
        }
    }
    useEffect(()=>{
        getFullInfoCustomer()
    },[])
    return(
        <div style={{backgroundColor:"#eae8e8"}}>
            <Header/>
            <div className="my-acc-body">
                <div className="nav-bar ">
                    <div className="avatar">
                        <div className="avatar-img">
                            <img src="/avatar.png" alt="avatar" />
                        </div>
                        <div className="avatar-info">
                            <div>{fullInfoCustomer?.fullName}</div>
                            <div>
                                <FontAwesomeIcon icon={faPen} />
                                <span>Sửa Hồ Sơ</span>
                            </div>
                        </div>
                    </div>
                    <ul className="navigate">
                        <li className="item-spec" >
                            <div>
                                <FontAwesomeIcon style={{color:"#5883c7"}} icon={faUser} />
                                <div className="item-content">Tài Khoản Của Tôi</div>
                            </div>
                                <ul className="sub-menu">
                                    <li onClick={()=>setChoosePage("Profile")}>Hồ Sơ</li>
                                    <li onClick={()=>setChoosePage("Addresses")}>Địa Chỉ</li>
                                    <li>Đổi Mật Khẩu</li>
                                </ul>
                        </li>
                        <li className="item-no-spec" onClick={()=>setChoosePage("OrderList")}>
                            <FontAwesomeIcon style={{color:"#5883c7"}} icon={faClipboardList} />
                            <div className="item-content">Đơn Mua</div>
                        </li>
                        <li className="item-no-spec">
                            <FontAwesomeIcon style={{color:"#f57053"}} icon={faBell} />
                            <div className="item-content">Thông Báo</div>
                        </li>
                        <li className="item-no-spec">
                            <FontAwesomeIcon style={{color:"#f2b525"}} icon={faTicket} />
                            <div className="item-content">Kho Voucher</div>
                        </li>
                    </ul>
                </div>
                <div className="content">
                    {choosePage == "OrderList" && <OrderList/>}
                    {choosePage == "Profile" && <ProfileComponent customerInfo ={fullInfoCustomer}/>}
                    {choosePage == "Addresses" && <AddressComponent/>}
                    
                </div>
        </div>
        </div>
    )
};
export default MyAccountPage;