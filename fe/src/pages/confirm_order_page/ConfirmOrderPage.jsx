import axios from "axios";
import { useEffect, useState } from "react";
import "./confirmOrderPage.css";
import nominatimService from "../../services/nominatim.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faComments, faStore, faCheck, faTicket } from '@fortawesome/free-solid-svg-icons';
import Footer from "../components/Footer";
import shippingMethodsService from "../../services/shipping-methods.service";
import ChooseShippingMethods from "./components/ChooseShippingMethods";
import ChooseVoucher from "../view_details_cart_page/component/choseVoucher";
import addressService from "../../services/address.service";
import { useLocation } from "react-router-dom";
import itemService from "../../services/item.service";
import orderService from "../../services/order.service";
import paymentService from "../../services/payment.service";
import SuccessComponent from "../components/SuccessComponent";
// const listTest = [
//     {
//         "id": 1,
//         "quantity": 6,
//         "topId": 2,
//         "label1": "Trắng",
//         "label2": "M",
//         "image": "38ed152e-49a9-47d3-9115-3cc05a6df813_image0.png",
//         "productName": "Quần Short Đũi Nam Dây Dút siêu mát - Quần đũi ngố nam đi phố đi biển",
//         "productId": 1,
//         "sellerId": 2,
//         "price": 3333,
//         "listClassifications1": [
//             "Trắng",
//             "Xám"
//         ],
//         "listClassifications2": [
//             "L",
//             "M"
//         ],
//         "shopName": "Shop sỉ lẻ hot trend",
//         "addressShop" : "Ha Noi",
//         "weight":"100",
//         "maxQuantity": 333,
//         "originalPrice": 4444
//     },
//     {
//         "id": 2,
//         "quantity": 3,
//         "topId": 6,
//         "label1": "Hoa hồng đỏ",
//         "label2": null,
//         "image": "81324cff-4a46-4c75-bb36-6d8b2770a428_image1.png",
//         "productName": "Túi Đựng Hộp Cơm Trưa Giữ Nhiệt Chất Lượng Cao",
//         "productId": 2,
//         "sellerId": 1,
//         "price": 26000,
//         "listClassifications1": [
//             "Đen",
//             "Hoa hồng đỏ",
//             "Xám",
//             "Xanh đậm"
//         ],
//         "listClassifications2": null,
//         "shopName": "Shop sỉ lẻ hot trend",
//         "addressShop" : "Ha Noi",
//         "weight":"200",
//         "maxQuantity": 2312,
//         "originalPrice": 30000
//     },
//     {
//         "id": 1,
//         "quantity": 6,
//         "topId": 2,
//         "label1": "Trắng",
//         "label2": "M",
//         "image": "38ed152e-49a9-47d3-9115-3cc05a6df813_image0.png",
//         "productName": "Quần Short Đũi Nam Dây Dút siêu mát - Quần đũi ngố nam đi phố đi biển",
//         "productId": 1,
//         "sellerId": 2,
//         "price": 3333,
//         "listClassifications1": [
//             "Trắng",
//             "Xám"
//         ],
//         "listClassifications2": [
//             "L",
//             "M"
//         ],
//         "shopName": "Shop sỉ lẻ hot trend 2",
//         "maxQuantity": 333,
//         "addressShop" : "Tp Ho Chi Minh",
//         "weight":"300",
//         "originalPrice": 4444
//     },
//     {
//         "id": 2,
//         "quantity": 3,
//         "topId": 6,
//         "label1": "Hoa hồng đỏ",
//         "label2": null,
//         "image": "81324cff-4a46-4c75-bb36-6d8b2770a428_image1.png",
//         "productName": "Túi Đựng Hộp Cơm Trưa Giữ Nhiệt Chất Lượng Cao",
//         "productId": 2,
//         "sellerId": 1,
//         "price": 26000,
//         "listClassifications1": [
//             "Đen",
//             "Hoa hồng đỏ",
//             "Xám",
//             "Xanh đậm"
//         ],
//         "addressShop" : "Tp Ho Chi Minh",
//         "weight":"500",
//         "listClassifications2": null,
//         "shopName": "Shop sỉ lẻ hot trend 2",
//         "maxQuantity": 2312,
//         "originalPrice": 30000
//     }
// ]
const shippingMethods=[
    {
        "id": 1,
        "priceFrom0To1kg": 15000,
        "priceFrom1To1_5kg": 16000,
        "priceFrom1_5To2kg": 17000,
        "priceNext0_5kg": 2000,
        "pricePer1Km": 100,
        "description": null,
        "name": "Tiết Kiệm",
        "dayStandard": 4,
        "voucherId": 12,
        "voucherReduce": 15000
    },
    {
        "id": 2,
        "priceFrom0To1kg": 16000,
        "priceFrom1To1_5kg": 17000,
        "priceFrom1_5To2kg": 18000,
        "priceNext0_5kg": 2500,
        "pricePer1Km": 200,
        "description": null,
        "name": "Nhanh",
        "dayStandard": 3,
        "voucherId": 12,
        "voucherReduce": 15000
    },
    {
        "id": 3,
        "priceFrom0To1kg": 18000,
        "priceFrom1To1_5kg": 20000,
        "priceFrom1_5To2kg": 22000,
        "priceNext0_5kg": 3000,
        "pricePer1Km": 300,
        "description": null,
        "name": "Hỏa tốc",
        "dayStandard": 2,
        "voucherId": 12,
        "voucherReduce": 15000
    }
]

function ConfirmOrderPage() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const { selectedItemIds, voucherShippingTmp, voucherDiscountTmp } = location.state || {};
    const [userInfo, setUserInfo] = useState(null);
    const [showFormChangeAddress,setShowFormChangeAddress] = useState(false)
    const [activeShop, setActiveShop] = useState(null);
    const [tempShipping, setTempShipping] = useState(null); 
    const [listItems, setListItem] = useState([]);
    const [listShippingMethods,setListShippingMethods] = useState(shippingMethods);
    const [selectedShipping, setSelectedShipping] = useState({});
    const [voucherShipping,setVoucherShipping] = useState(voucherShippingTmp);
    const [voucherDiscount,setVoucherDiscount] = useState(voucherDiscountTmp);
    const [showChooseVoucher,setShowChooseVoucher] = useState(false);
    const [addressList,setAddressList] = useState([]);
    const [chooseAddress,setChooseAddress]= useState(null);
    const [addressTmp,setAddressTmp] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("THANH TOÁN KHI NHẬN HÀNG");
    const [showNoticeSuccess,setShowNoticeSuccess] = useState(false);
    const  [noticeToSeller,setNoticeToSeller] = useState("");
    const calcDistance = (address2Lat, address2Long) => {
        try {
            console.log(chooseAddress)
            const distance = calcDistanceAbc(chooseAddress?.latitude,chooseAddress?.longitude, address2Lat, address2Long);
            console.log(distance)
            return distance;
        } catch (error) {
            console.error("Error calculating distance:", error);
            return null;  // Return null or handle error as needed
        }
    };
    const handleChange = (event) => {
        setPaymentMethod(event.target.value);
      };
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        console.log(lat1,lat2,lon1,lon2)
        const R = 6371; // Radius of the Earth in km
        const dLat = degreesToRadians(lat2 - lat1);
        const dLon = degreesToRadians(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        return R * c; // Distance in km
    }

    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    function calcDistanceAbc(address1Lat, address1Lon, address2Lat ,address2Lon) {
        const distance = getDistanceFromLatLonInKm(address1Lat, address1Lon, address2Lat, address2Lon);
        return distance;
    }
    const updateDistances = () => {
        if (chooseAddress != null) {
            const updatedItems = listItems.map((item) => {
                console.log(item);
                const distance = calcDistance(item?.latitude, item?.longitude);
                const shipCost = calcShipFee(selectedShipping[item.shopName], distance, item.totalWeight);
                console.log(item.totalWeight)
                return { ...item, distance, shipCost }; // Update item with new distance and shipCost
            });
            console.log(listItems)
            setListItem(updatedItems); // Update state with new distances
        }
    };
    useEffect(() => {
        console.log(chooseAddress);

    
        updateDistances();
    }, [chooseAddress, selectedShipping]);
    
    useEffect(()=>{
        updateDistances()
    },[])
    const formatDate = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('vi-VN', options);
        return formattedDate.replace('/', ' tháng ').replace('/', ' ');
      };
      const calculateDate = (daysToAdd) => {
        const now = new Date();
        const startOfBusiness = 8; 
        const endOfBusiness = 17; 
        let futureDate = new Date(now);
        futureDate.setDate(futureDate.getDate() + daysToAdd);
        const currentHour = futureDate.getHours();
        if (currentHour < startOfBusiness || currentHour >= endOfBusiness) {
          futureDate.setDate(futureDate.getDate() + 1);
        }
    
        return formatDate(futureDate);
      };
    const getAddressByCustomerId=async ()=>{
        const response = await addressService.getByCustomerId(user?.id);
        setAddressList(response);
        setChooseAddress(response[0])
    }
    useEffect(()=>{
        getAddressByCustomerId()
        console.log(voucherShippingTmp)
        console.log(voucherDiscountTmp)
    },[])
    useEffect(() => {
        if (voucherShipping != null) {
            setListItem(prevState =>
                prevState.map(shopItem => {
                    if (shopItem.totalPrice >= voucherShipping.conditionAmount) {
                        return {
                            ...shopItem,
                            reduceShipCost: Math.min(voucherShipping.reduceMaxAmount,shopItem.shipCost)
                        };
                    }
                    return shopItem;
                })
            );
        }
    }, [voucherShipping]);
    useEffect(() => {
        if (voucherDiscount != null) {
            setListItem(prevState =>
                prevState.map(shopItem => {
                    if (shopItem.totalPrice >= voucherDiscount.conditionAmount) {
                        return {
                            ...shopItem,
                            reducePrice: Math.min(voucherDiscount.reduceMaxAmount,shopItem.totalPrice * voucherDiscount.percentReduce/100)
                        };
                    }
                    return shopItem;
                })
            );
        }
    }, [voucherDiscount]);
    const addOrder=async ()=>{
        const addOrderLineRequests=[];
        let count =0;
        for(const item of listItems){
            addOrderLineRequests.push({
                itemIds: item.items.map(tmp => tmp.id),
                totalPrice: item.items.reduce((total, tmp) => total + tmp.price*tmp.quantity, 0),
                revenue: item.items.reduce((total, tmp) => total + (tmp.price - tmp.cost)*tmp.quantity, 0),
                sellerId: item.sellerId,
                customerMessage: noticeToSeller[count],
                shippingMethodId: selectedShipping[item.shopName],
                shipCost : item.shipCost
            })
            count++;
        }
        const body ={
            voucherIds:[
                ...(voucherShipping ? [voucherShipping.id] : []),
                ...(voucherDiscount ? [voucherDiscount.id] : [])
            ],
            customerId:user?.id,
            addressShipId:chooseAddress.id,
            totalAmount: listItems.reduce((accumulator, item) => 
                accumulator + Number(item?.totalPrice) , 0),
            totalAmountForVNpay:listItems.reduce((accumulator, item) => 
                accumulator + Number(item?.totalPrice) + Number(item.shipCost) - Number(item.reduceShipCost), 
                0
            ) - listItems.reduce((accumulator,item) => accumulator +Number(item?.reducePrice) , 0),
            addOrderLineRequests: addOrderLineRequests   
        }
        console.log(body)
        if(paymentMethod == "THANH TOÁN KHI NHẬN HÀNG")
        {
            body.paymentMethod = "THANH TOÁN KHI NHẬN HÀNG"
            const response = await orderService.addOrder(body);
            console.log(response.data)
            setShowNoticeSuccess(true)
        }else{
            body.paymentMethod = paymentMethod
            const response =  await paymentService.submitOrder(body)
            console.log(response)
            localStorage.setItem('orderData', JSON.stringify(body));
            window.location.href = response.data
        }
    }
    const loadItems = async () => {
        const response = await itemService.getByIds(selectedItemIds);
        for(let item of response)
        {
            setSelectedShipping(prevState => ({
                                ...prevState,
                                [item.shopName]: 1,
                              }));
            item.reducePrice=0;
            item.reduceShipCost =0;
        }
        setListItem(response);  // Use the result from the first call
        setNoticeToSeller(new Array(response.length).fill(""));

    };
    useEffect(()=>{
        console.log(noticeToSeller)
    },[noticeToSeller])
    useEffect(() => {
        console.log(voucherShipping);
        console.log(voucherDiscount)  // Load items on component mount
    }, [voucherDiscount,voucherShipping]);  // Empty dependency array ensures this runs only once
    useEffect(() => {
        loadItems();  // Load items on component mount
    }, []);  // Empty dependency array ensures this runs only once

    const closeShippingOverlay = () => {
        setActiveShop(null);
        setTempShipping(null);
      };
      const saveShippingMethod = () => {
        if (activeShop && tempShipping !== null) {
            setSelectedShipping(prevState => ({
                ...prevState,
                [activeShop.shopName]: tempShipping
            }));
    
            // Cập nhật lại listItem với phí ship mới
            setListItem(prevState =>
                prevState.map(shopItem => {
                    if (shopItem.shopName === activeShop.shopName) {
                        const newShipCost = calcShipFee(
                            tempShipping,  
                            shopItem.distance,  
                            shopItem.totalWeight  
                        );
                        return {
                            ...shopItem,
                            shipCost: newShipCost 
                        };
                    }
                    return shopItem; 
                })
            );
        }
        closeShippingOverlay();  
    };
    




    function formatPriceToVND(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }
    // useEffect(() => {
    //     const fetchImages = async () => {
    //         const updatedItems = await updateImagesForItems(listTest);
    //         console.log(updatedItems)
    //         setListItem(updatedItems);
    //     };
    //     fetchImages();
    // }, []);
    const openShippingOverlay = (shop) => {
        setActiveShop(shop);
        setTempShipping(selectedShipping[shop.shopName] || null);
      };
    const openAddressOverlay=()=>{
        setAddressTmp(chooseAddress);
        setShowFormChangeAddress(true);
    }
    const closeAddressOverlay=(action)=>{
        if(action ==="close"){
            setAddressTmp(null)
            setShowFormChangeAddress(false)
        }else{
            setShowFormChangeAddress(false);
            setChooseAddress(addressTmp)
        }
    }

    const calcShipFee= (methodId, distance, totalWeight)=>{
        const method = shippingMethods.find(m => m.id === methodId)
        let fee=0;
        
        if(totalWeight <=1000){
            fee+=method.priceFrom0To1kg;
        }else if(totalWeight<=1500){
            fee+=method.priceFrom1To1_5kg;
        }else if(totalWeight<=2000){
            fee+=method.priceFrom1_5To2kg;
        }else{
            fee+=method.priceFrom1_5To2kg;
            fee+=method.priceNext0_5kg *(totalWeight-2000)/1000;
        }
        console.log(fee)
        fee+= distance*method.pricePer1Km;
        return fee.toFixed(0);
    }   
    return (
        <div>
            {showNoticeSuccess == true && <SuccessComponent content={"Đặt hàng thành công"}/>}
            {showChooseVoucher&&<ChooseVoucher totalPrice = {Math.min(...listItems.map(item => item.totalPrice))} setShowChooseVoucher={setShowChooseVoucher} setVoucherDiscount={setVoucherDiscount} setVoucherShipping={setVoucherShipping} voucherDiscount={voucherDiscount} voucherShipping={voucherShipping}/>}
           {activeShop && (
                <div style={{ width: "100%", height: "100%", backgroundColor: "#0006", position: "fixed", zIndex: 1, display: "flex" }}>
                    <div className="choose-ship-methods-container">
                        <div className="choose-ship-methods-header">
                            <div style={{fontSize:16}}>Chọn đơn vị vận chuyển</div>
                            <div>
                            <div style={{fontSize:12,color:"rgba(0,0,0,0.6)"}}>KÊNH VẬN CHUYỂN LIÊN KẾT VỚI HYYANG</div>
                            <div style={{fontSize:10,color:"rgba(0,0,0,0.6)"}}>Bạn có thể theo dõi đơn hàng trên ứng dụng Hyyang khi chọn một trong các đơn vị vận chuyển:</div>
                            </div>
                        </div>
                        <div className="choose-ship-methods-body">
                            <div className="choose-ship-methods-list">
                            {listShippingMethods.map((item)=>{
                                return(
                                <div className={tempShipping === item?.id ?"choose-ship-methods-item choose-item" :"choose-ship-methods-item"} onClick={() => setTempShipping(item.id)}>
                                    <div>
                                    <div className="item-header">
                                        <div style={{fontSize:14, marginRight:20}}>{item?.name}</div>
                                        <div>{formatPriceToVND(calcShipFee(item?.id,activeShop?.distance,activeShop?.totalWeight))}</div>
                                    </div>
                                    <div className="item-description">
                                        <div style={{fontSize:12,color:"rgba(0,0,0,0.6)"}}>{`Đảm bảo nhận hàng từ ${calculateDate(0)} - ${calculateDate(item?.dayStandard)}`}</div>
                                        <div style={{fontSize:10,color:"rgba(0,0,0,0.6)"}}>{`Nhận Voucher trị giá ${formatPriceToVND(item?.voucherReduce)} nếu đơn hàng được giao đến sau ngày ${calculateDate(item?.dayStandard)}`}</div>
                                    </div>
                                    </div>
                                    <div style={{width:"20%",display:"flex",justifyContent:"flex-end"}}><FontAwesomeIcon icon={faCheck}/></div>
                                </div>
                                )
                            })}
                            </div>
                        </div>
                        <div className="overlay-actions">
                            <button
                                className="save-button"
                                onClick={saveShippingMethod}
                                disabled={tempShipping === null}
                            >
                                Lưu
                            </button>
                            <button className="cancel-button" onClick={closeShippingOverlay}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showFormChangeAddress &&(
                <div className="layout">
                    <div className="address-container">
                        <div className="address-header">Địa Chỉ Của Tôi</div>
                        <div className="address-body">
                            {addressList.map((item,index) => (
                                <div className={`address-item ${addressList.length>1 && index<addressList.length-1?"address-item-border":""}`} onClick={()=>setAddressTmp(item)} key={item.id}>
                                    <div className="col-md-1"><input type="radio" checked={item?.id==addressTmp?.id}></input></div>
                                    <div className="col-md-8">
                                        <div style={{display:"flex"}}>
                                            <div style={{borderRight:"1px solid rgba(0,0,0,0.3)", paddingRight:5,marginRight:3}}>{item?.nameUser}</div>
                                            <div style={{fontSize:12,color:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center"}}>{item?.phoneNumberUser}</div>
                                        </div>
                                        <div>
                                            <div style={{fontSize:12,color:"rgba(0,0,0,0.5)"}}>{item.addressDetails}</div>
                                            <div style={{fontSize:12,color:"rgba(0,0,0,0.5)"}}>{`${item?.ward},${item.district},${item.city}`}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-3" style={{color:"#3498db",fontSize:12}}>Cập nhật</div>
                                </div>
                            ))}
                            <div style={{display:"flex", justifyContent:"center"}}>
                                <button style={{border:"1px solid rgba(0,0,0,0.3)",padding:"8px 20px",marginBottom:20,backgroundColor:"white"}}>+ Thêm Địa Chỉ Mới</button>
                            </div>
                        </div>
                        <div className="address-footer">
                            <button onClick={()=>{closeAddressOverlay("close")}}>Hủy</button>
                            <button style={{background:"#3498db", color:"white"}} onClick={()=>closeAddressOverlay("change")}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="header">
                <div style={{ width: "80%", margin: "auto" }}>
                    <div className="grid">
                        <nav className="header__navbar">
                            <ul className="header__navbar-list">
                                <li className="header__navbar-item header__navbar-item--has-qr header__navbar-item--separate">
                                    {userInfo?.role === "ROLE_USER" ? 
                                        <a className="header__navbar-item header__navbar-item--has-qr" href="/seller/register">Trở thành người bán hàng</a> :
                                        <a className="header__navbar-item header__navbar-item--has-qr" href="/seller">Kênh người bán</a>
                                    }
                                </li>
                                <li className="header__navbar-item">
                                    <span className="header__navbar-title--no-pointer">Kết nối</span>
                                    <a href="" className="header__navbar-icon-link">
                                        <i className="header__navbar-icon fab fa-facebook"></i>
                                    </a>
                                    <a href="" className="header__navbar-icon-link">
                                        <i className="header__navbar-icon fab fa-instagram"></i>
                                    </a>
                                </li>
                            </ul>
                            <ul className="header__navbar-list">
                                <li className="header__navbar-item header__navbar-item--has-notify">
                                    <a href="" className="header__navbar-link">
                                        <i className="header__navbar-icon far fa-bell"></i>
                                        Thông báo
                                    </a>
                                    {/* Notification Dropdown */}
                                </li>
                                <li className="header__navbar-item">
                                    <a href="" className="header__navbar-link">
                                        <i className="header__navbar-icon far fa-question-circle"></i>
                                        Trợ giúp
                                    </a>
                                </li>
                                <li className="header__navbar-item header__navbar-user">
                                    <img src="https://example.com/user-avatar.jpg" alt="" className="header__navbar-user-avatar" />
                                    <span className="header__navbar-user-name">Hữu Huy</span>
                                    <ul className="header__navbar-user-menu">
                                        <li className="header__navbar-user-item"><a href="">Tài khoản của tôi</a></li>
                                        <li className="header__navbar-user-item"><a href="">Địa chỉ của tôi</a></li>
                                        <li className="header__navbar-user-item"><a href="">Đơn mua</a></li>
                                        <li className="header__navbar-user-item header__navbar-user-item--separate"><a href="">Đăng xuất</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="header-with-search">
                        <div className="header__logo">
                            <a href="/" className="header__logo-link">
                                <img src="/icon_shop_main.png" alt="Logo" />
                            </a>
                        </div>
                        <div className="title">Thanh Toán</div>
                    </div>
                </div>
            </div>
            <div className="confirm-order-body">
                <div className="address-info">
                    <div className="dashed-border"></div>
                    <div className="address-info-content">
                        <div className="address-info-header">
                            <FontAwesomeIcon style={{ fontSize: 20, marginRight: 10 }} icon={faLocationDot} />
                            <div style={{ fontSize: 18 }}>Địa Chỉ Nhận Hàng</div>
                        </div>
                        <div className="address-info-body">
                            <div className="col-md-3" style={{ fontSize: 16, fontWeight: 600, padding: 0 }}>
                                {`${chooseAddress?.nameUser} ${chooseAddress?.phoneNumberUser}`}
                            </div>
                            <div className="col-md-6" style={{ fontSize: 16 }}>
                                {`${chooseAddress?.addressDetails}, ${chooseAddress?.ward}, ${chooseAddress?.district}, ${chooseAddress?.city}`}
                            </div>
                            <div className="col-md-1" onClick={()=>openAddressOverlay()}style={{ fontSize: 14,cursor:"pointer", color:"#3498db"}}>Thay Đổi</div>
                        </div>
                    </div>
                </div>
                <div className="order-info">
                    {
                        listItems.length>0 && listItems.map((group,index)=>(
                            <div style={{boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)"}}>
                                <div className="chat-with-shop" style={{flexDirection:"row"}}>
                                        <div style={{ display: "flex" }}>
                                            <FontAwesomeIcon style={{ color: 'gray', marginRight: "5px", fontSize: 18 }} icon={faStore} />
                                            <div style={{ paddingRight: '5px', fontSize: 16, margin: "0px 8px" }}>{group.shopName}</div>
                                            <FontAwesomeIcon style={{ color: '#3498dbcc', fontSize: 16 }} icon={faComments} />
                                        </div>
                                    </div>
                                <div className="order-group" key={index}>
                                    
                                    <div className="order-group-header">
                                        <div className="col-md-6" style={{  fontSize: 16 }}>Sản Phẩm</div>
                                        <div className="col-md-2 spec">Đơn giá</div>
                                        <div className="col-md-2 spec">Số lượng</div>
                                        <div className="col-md-2 spec">Thành Tiền</div>
                                    </div>
                                    {group.items.map((item, index) => (
                                        <div className="order-group-header" key={index}>
                                            <div className="col-md-6" style={{ padding: 0,display:"flex" }}>
                                                <img src={item?.image} style={{width:"10%"}}></img>
                                                <div style={{marginLeft:20,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",display:"block",width:"60%"}}>{item.productName}</div>
                                                <div>{`Loại : ${item?.label1} ${item?.label2==null?"":`, ${item?.label2}`}`}</div>
                                            </div>
                                            <div className="col-md-2 spec">{item.price.toLocaleString()} VNĐ</div>
                                            <div className="col-md-2 spec">{item.quantity}</div>
                                            <div className="col-md-2 spec">{(item.price * item.quantity).toLocaleString()} VNĐ</div>
                                        </div>
                                    ))}

                                </div>
                                <div className='order-footer'>
                                    <div className='note-to-seller'>
                                      <div style={{width:"25%"}}>Lời nhắn:</div>
                                      <input 
                                        className="note-to-seller-input"  
                                        value={noticeToSeller[index]} 
                                        onChange={(e) => {
                                            const newNoticeToSeller = [...noticeToSeller]; // Sao chép mảng noticeToSeller
                                            newNoticeToSeller[index] = e.target.value; // Cập nhật giá trị tại index
                                            setNoticeToSeller(newNoticeToSeller); // Cập nhật state với mảng mới
                                        }} 
                                        placeholder='Lưu ý cho người bán...'
                                        >
                                      </input>
                                    </div>
                                    <div className='shipping-methods'>
                                      <div style={{width:"25%",textAlign:"center"}}>Đơn vị vận chuyển:</div>
                                      <div style={{width:"75%"}}>
                                        <div style={{display:"flex",marginBottom:10}}>
                                          <div style={{display:"flex",justifyContent:"flex-start",padding:0}} className="col-md-4">{shippingMethods.find(m => m.id === selectedShipping[group.shopName])?.name}</div>
                                          <div onClick={() => openShippingOverlay(group)} style={{display:"flex",justifyContent:"center",padding:0,color:"#6fa6d6"}} className="col-md-4">Thay đổi</div>
                                          <div style={{display:"flex",justifyContent:"flex-end",padding:0}}className="col-md-4">
                                            <div style={{fontSize:12,textDecoration:"line-through",display:"flex", alignItems:"flex-end",marginRight:10}}>{formatPriceToVND(Number(group.shipCost))}</div>
                                            <div>{formatPriceToVND(Number(group.shipCost) - Number(group?.reduceShipCost))}</div>
                                          </div>
                                          <div style={{display:"flex",justifyContent:"flex-end",padding:0}}className="col-md-4">{formatPriceToVND(Number(group.shipCost) - Number(group?.reduceShipCost))}</div> 
                                        </div>
                                        <div>
                                          <div style={{fontSize:12,color:"red"}}>{`Đảm bảo nhận hàng từ ${calculateDate(0)} - ${calculateDate(shippingMethods.find(m => m.id === selectedShipping[group.shopName])?.dayStandard)}`}</div>
                                          <div style={{fontSize:10}}>{`Nhận Voucher trị giá ${formatPriceToVND(shippingMethods.find(m => m.id === selectedShipping[group.shopName])?.voucherReduce)} nếu đơn hàng được giao đến bạn sau ngày ${calculateDate(shippingMethods.find(m => m.id === selectedShipping[group.shopName])?.dayStandard)}`}</div>
                                        </div>
                                      </div>
                                    </div>
                                  
                                </div>
                                <div className='total-price' >
                                    <div className="col-md-4">{`Tổng số tiền (${group.items.length} sản phẩm): `}</div>
                                    <div style={{ fontSize: 22, color: "#3498db" }}>
                                        {formatPriceToVND(Number(group.totalPrice)+ Number(group.shipCost) - Number(group.reduceShipCost))}
                                    </div>
                                    

                                </div>
                                
                            </div>
                        ))
                    }
                </div>
                <div className="voucher">
                    <div className='col-md-6' style={{display:"flex",alignItems:"center",fontSize:18}}><FontAwesomeIcon icon={faTicket} style={{fontWeight:200,color:"#3498dbcc",fontSize:"25px",paddingRight:6}}/> Hyyang Voucher</div>
                    <div className='choose-vouchers col-md-4' style={{display:"flex",justifyContent:"flex-end"}}>
                        {voucherShipping&&<div style={{border:"1px dashed gray",padding:"3px",fontSize:14}}>Miễn phí vận chuyển</div>}
                        {voucherDiscount&&<div style={{border:"1px dashed gray",padding:"3px",fontSize:14}}>Mã giảm giá {voucherDiscount?.percentReduce}%</div>}
                    </div>
                    <a className="btn-show-voucher col-md-2"style={{fontSize:16,textDecoration:"underline",display:"flex",alignItems:"center",justifyContent:"flex-end"}} onClick={(e)=>{e.preventDefault();setShowChooseVoucher(true)}}>Chọn hoặc nhập mã</a>
                </div>
                <div className="payment-method">
                    <div className="payment-header">
                        <div className="col-md-6" style={{fontSize:18}}>Phương thức thanh toán</div>
                        <div className="col-md-6" style={{display: "flex", justifyContent: "flex-end"}}>
                            <select onChange={handleChange} style={{alignContent: "center", padding: "5px"}}>
                                <option value="THANH TOÁN KHI NHẬN HÀNG">Thanh toán khi nhận hàng</option>
                                <option value="THANH TOÁN QUA VNPAY">VíVNPay</option>
                            </select>
                        </div>

                    </div>
                    <div className="payment-body">
                        <table className="cop-table">
                            <tr>
                                <th>Tổng tiền hàng:</th>
                                <td className="confirm-order-td">{formatPriceToVND(listItems.reduce((accumulator,item) => accumulator + Number(item?.totalPrice), 0))}</td>
                            </tr>
                            <tr>
                                <th>Phí vận chuyển:</th>
                                <td className="confirm-order-td">{formatPriceToVND(listItems.reduce((accumulator,item) => accumulator +Number(item.shipCost), 0))}</td>
                            </tr>
                            <tr>
                                <th>Tổng cộng voucher giảm giá:</th>
                                <td className="confirm-order-td">-{formatPriceToVND(listItems.reduce((accumulator,item) => accumulator +Number(item.reduceShipCost) , 0) + listItems.reduce((accumulator,item) => accumulator +Number(item?.reducePrice) , 0))}</td>
                            </tr>
                            <tr>
                                <th>Tổng thanh toán:</th>
                                <td className="confirm-order-td" style={{ fontSize: 24, color: "#3498db" }}>
                                    {formatPriceToVND(
                                        listItems.reduce((accumulator, item) => 
                                            accumulator + Number(item?.totalPrice) + Number(item.shipCost) - Number(item.reduceShipCost), 
                                            0
                                        ) - listItems.reduce((accumulator,item) => accumulator +Number(item?.reducePrice) , 0)
                                    )}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="payment-footer">
                        <div className="col-md-9" style={{color: "rgba(0, 0, 0, .54)",display:"flex",margin:"auto"}}>Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân thủ theo <a style={{color:"#3498db",marginLeft:5}}>Điều khoản Hyyang</a></div>
                        <div className="col-md-3" style={{justifyContent:"flex-end",display:"flex"}}>
                            <button style={{backgroundColor:"#3498db",padding:"8px 60px",color:"white", fontWeight:400,fontSize:16,border:"none"}} onClick={()=>{addOrder()}}>Đặt hàng</button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{marginTop:30}}>
                <Footer/>
            </div>
        </div>
    );
}

export default ConfirmOrderPage;
