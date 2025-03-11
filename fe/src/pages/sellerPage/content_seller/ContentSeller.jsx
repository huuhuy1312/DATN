import React, { useEffect, useState } from 'react';
import './ContentSeller.css';
import orderlineService from '../../../services/orderline.service';
import fileService from '../../../services/file.service';
import ConfirmOrderLayOut from './component/ConfirmOrderLayOut';
import paymentService from '../../../services/payment.service';
// const data = [
//     {
//         "id": 2,
//         "codeOrder": "ABCDEF123",
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
//         "maxQuantity": 2312,
//         "originalPrice": 30000,
//         "city": "Hà Nội",
//         "ward": "Vĩnh Phúc",
//         "district": "Ba Đình",
//         "addressDetails": "Số 9,Ngõ 463,Đội Cấn",
//         "weight": 150,
//         "createdAt": "2024-10-16T16:05:51",
//         "doneTime": null,
//         "paymentTime": null,
//         "shipperPickUpTime": null
//     },    {
//         "id": 3,
//         "codeOrder": "ABCDEF123",
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
//         "maxQuantity": 2312,
//         "originalPrice": 30000,
//         "city": "Hà Nội",
//         "ward": "Vĩnh Phúc",
//         "district": "Ba Đình",
//         "addressDetails": "Số 9,Ngõ 463,Đội Cấn",
//         "weight": 150,
//         "createdAt": "2024-10-16T16:05:51",
//         "doneTime": null,
//         "paymentTime": null,
//         "shipperPickUpTime": null
//     },    {
//         "id": 4,
//         "codeOrder": "ABCDEF123",
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
//         "maxQuantity": 2312,
//         "originalPrice": 30000,
//         "city": "Hà Nội",
//         "ward": "Vĩnh Phúc",
//         "district": "Ba Đình",
//         "addressDetails": "Số 9,Ngõ 463,Đội Cấn",
//         "weight": 150,
//         "createdAt": "2024-10-16T16:05:51",
//         "doneTime": null,
//         "paymentTime": null,
//         "shipperPickUpTime": null
//     },    {
//         "id": 5,
//         "codeOrder": "ABCDEF124",
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
//         "maxQuantity": 2312,
//         "originalPrice": 30000,
//         "city": "Hà Nội",
//         "ward": "Vĩnh Phúc",
//         "district": "Ba Đình",
//         "addressDetails": "Số 9,Ngõ 463,Đội Cấn",
//         "weight": 150,
//         "createdAt": "2024-10-16T16:05:51",
//         "doneTime": null,
//         "paymentTime": null,
//         "shipperPickUpTime": null
//     },    {
//         "id": 6,
//         "codeOrder": "ABCDEF124",
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
//         "maxQuantity": 2312,
//         "originalPrice": 30000,
//         "city": "Hà Nội",
//         "ward": "Vĩnh Phúc",
//         "district": "Ba Đình",
//         "addressDetails": "Số 9,Ngõ 463,Đội Cấn",
//         "weight": 150,
//         "createdAt": "2024-10-16T16:05:51",
//         "doneTime": null,
//         "paymentTime": null,
//         "shipperPickUpTime": null
//     }
// ]

const ContentSeller = () => {
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [listOrder, setListOrder] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const [openConfirmLayout,setOpenConfirmLayout] = useState(false)
    const [orderChoose,setOrderChoose] = useState(null);
    const uploadImageForItem = async (orderLines) => {
        // Sử dụng for...of để chờ các promise hoàn thành
        for (let orderline of orderLines) {
            orderline["totalAmount"] =0;
            for(let item of orderline.items)
            {
                orderline["totalAmount"]+= item.quantity*item.price;
            }
        }
        console.log(orderLines)
        return orderLines;
    }
    const confirmOrderBtnClick=(order)=>{
        setOrderChoose(order);
        setOpenConfirmLayout(true);
    }
    const getOrdersBySellerId = async () => {
        const response = await orderlineService.getByCondition({"sellerId": user?.id});
        console.log(response);
    
        // Gọi hàm uploadImageForItem và chờ các ảnh được upload xong
        const uploadImagesResponse = await uploadImageForItem(response);
    
        // Sort orders by createdAt in descending order (latest first)
        uploadImagesResponse.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
        setListOrder(uploadImagesResponse);
    }
    
    useEffect(()=>{
        getOrdersBySellerId()
        
    },[])

    useEffect(()=>{
        console.log(listOrder)
    },[listOrder])
    const tabs = [
        'Tất cả',
        'Chờ xác nhận',
        'Chuẩn bị hàng',
        'Đang đóng gói',
        'Chờ lấy hàng',
        'Đã giao đơn vị vận chuyển',
        'Hết hàng',
        'Đang hủy',
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    const addPayment = async (orderLine) => {
        const body = {
            amount: (orderLine?.totalAmount + orderLine?.shipCost), // Chuyển đổi sang đơn vị tiền tệ phù hợp
            bank: "VNP_Admin",
            objectId:0,
            objectName: "Admin",
            purpose: "Hoàn tiền đơn hàng",
            isBack : true,
            reasonBack : "Người bán hủy đơn hàng"
          };
        try {
          await paymentService.addPayment(body);
        } catch (error) {
          console.error("Error adding payment:", error);
        }
      };
    
    const cancelOrder =async (order)=>{
        const body ={
            "id":order?.id,
            "status":"Đã hủy"
        }
        
        const response = await orderlineService.updateOrderLine(body);
        getOrdersBySellerId();
        addPayment(order)
        console.log(order);

    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');   // Giờ (2 chữ số)
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Phút (2 chữ số)
        const day = date.getDate().toString().padStart(2, '0');       // Ngày (2 chữ số)
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng (2 chữ số)
        const year = date.getFullYear();                              // Năm
    
        return `${minutes}:${hours} ${day}/${month}/${year}`;
    };
    const afterConfirm=()=>{
        getOrdersBySellerId();
        setOpenConfirmLayout(false)
        setOrderChoose(null)
    }
    return (
        <div className="main-content-seller">
            {openConfirmLayout && <ConfirmOrderLayOut orderInfo={orderChoose} after={afterConfirm}/>}
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={activeTab === tab ? 'tab active' : 'tab'}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="order-header">
                <span style={{ fontSize: 24, fontWeight: 500 }}>Quản lý đơn hàng</span>
                
            </div>

            <div className="order-filters">
                <input type="text" placeholder="ID đơn hàng" />
                <input type="text" placeholder="Tên Shop" />
                <input type="text" placeholder="Tên sản phẩm" />
                <input type="date" />
                <select>
                    <option value="">Phương thức thanh toán</option>
                </select>
            </div>

            <div className="order-list-seller">
                <table>
                    <thead>
                        <tr>
                            <th style={{width:"7.5%"}}>Mã đơn hàng</th>
                            <th style={{width:"25%"}}>Sản phẩm</th>
                            <th style={{width:"7.5%"}}>Tổng tiền</th>
                            <th style={{width:"7.5%"}}>Trạng thái</th>
                            <th style={{width:"10%"}}>Ngày tạo</th>
                            <th style={{width:"10%"}}>Ngày lấy hàng</th>
                            <th style={{width:"10%"}}>Ngày hoàn thành</th>
                            <th style={{width:"15%",textAlign:"center"}}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOrder.map((order) => (
                            <tr key={order.id}>
                                <td style={{width:"7.5%"}}>
                                    <div>
                                        <div>{order.orderCode}</div>
                                        <a style={{color:"#3498db",cursor:"pointer",fontSize:12}}>Xem chi tiết...</a>
                                    </div>
                                </td>
                                <td style={{width:"25%"}}>
                                    <div className='custom-scrollbar'>
                                        {order.items.map((item,index)=>(
                                            <div style={{ display: 'flex', position: 'relative',marginBottom:5,borderBottom: index < order.items.length - 1 ? "1px solid rgba(0,0,0,0.3)" : "none",paddingBottom:5}}>
                                                <img src={item?.image} style={{ width: '6rem', marginRight: '2rem' }} alt="product" />
                                                <div style={{ margin: 'auto 0px' }}>
                                                <div style={{
                                                    fontSize: 14, 
                                                    fontWeight: 500,
                                                    width: "22rem",
                                                    whiteSpace: "normal", // Cho phép nội dung xuống dòng
                                                    overflow: "hidden",   // Ẩn nội dung thừa
                                                    textOverflow: "ellipsis", // Thêm dấu ... nếu nội dung vượt quá
                                                    display: "-webkit-box",    // Hiển thị dưới dạng hộp để hỗ trợ dòng
                                                    WebkitLineClamp: 2,        // Giới hạn hiển thị tối đa 2 dòng
                                                    WebkitBoxOrient: "vertical" // Đặt định hướng của hộp là dọc
                                                }}>
                                                    {item?.productName}
                                                </div>

                                                    <div style={{ color: 'rgba(0,0,0,0.3)', fontSize: 12 }}>
                                                        {`Phân loại hàng: ${item.label1}${item.label2 ? `, ${item.label2}` : ''}`}
                                                    </div>
                                                </div>
                                                <div style={{ position: 'absolute', right: '0%', top: '0%' }}>x{item.quantity}</div>
                                            </div>
                                        ))
                                        }
                                    </div>
                                </td>
                                <td style={{width:"7.5%"}}>{(order.totalAmount).toLocaleString()}đ</td>
                                <td style={{width:"7.5%"}}>{order.status}</td>
                                <td style={{width:"10%"}}>{formatDate(order.createdAt)}</td>
                                <td style={{width:"10%"}}>{order.shipperPickupTime ? new Date(order.shipperPickupTime).toLocaleString() : 'Chưa lấy hàng'}</td>
                                <td style={{width:"10%"}}>{order.doneTime ? new Date(order.doneTime).toLocaleString() : 'Chưa hoàn thành'}</td>
                                <td style={{width:"15%"}}>
                                    <div style={{display: "flex", justifyContent: order.status === "Chờ xác nhận" ? "space-between" : "center"}}>
                                        {order.status =="Chờ xác nhận" &&<button style={{border:"1px solid #3498db",padding:"5px 10px", color:"white",backgroundColor:"#3498db",fontWeight:500}} onClick={()=>confirmOrderBtnClick(order )}>Xác nhận đơn</button>}
                                        {order.status =="Chờ xác nhận" &&<button onClick={()=>cancelOrder(order)}style={{border:"1px solid #eb061cc7",padding:"5px 10px", color:"white",backgroundColor:"#eb061cc7",fontWeight:500}}>Hủy đơn</button>}
                                    </div>
                                      
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContentSeller;
