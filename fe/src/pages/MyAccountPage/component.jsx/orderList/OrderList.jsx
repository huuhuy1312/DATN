import React, { useEffect, useState } from 'react';
import './OrderList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faComment, faShop, faStore } from '@fortawesome/free-solid-svg-icons';
import orderlineService from '../../../../services/orderline.service';
import RateProduct from './component/RateProduct';
import orderService from '../../../../services/order.service';
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
const OrderList = () => {
  const [typeOrder, setTypeOrder] = useState("Chờ xác nhận");
  const user = JSON.parse(localStorage.getItem("user"));
  const [listOrderline, setListOrderline] = useState([]);
  const [chooseItem, setChooseItem] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [process, setProcess] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // New state for pagination
  function getStatusIndex(status) {
    const index = listStatus.indexOf(status);
    return index !== -1 ? index : "Trạng thái không tồn tại";
  }
  const getProcess = async (id) => {
    const response = await orderlineService.getProcess(id);
    console.log(response)
    setProcess(response);
  };

  useEffect(() => {
    console.log(orderDetails);
    if (orderDetails != null) getProcess(orderDetails?.id);
  }, [orderDetails]);

  const getOrderlines = async () => {
    const body = {
      customerId: user?.id,
    };
    if(typeOrder == "Chờ xác nhận")
    {
      body.listStatus = [listStatus[0]]
    }else if(typeOrder == "Chờ giao hàng"){
      body.listStatus = [listStatus[1],listStatus[2],listStatus[3],listStatus[4],listStatus[5],listStatus[6],listStatus[7]]
    }else if(typeOrder == "Đã hoàn thành")
    {
      body.listStatus = [listStatus[8]]
    }
    console.log(body);
    const response = await orderlineService.getByCondition(body);
    console.log(response)
    setListOrderline(response);
  };

  useEffect(() => {
    getOrderlines();
  }, [typeOrder,chooseItem]);

  function formatPriceToVND(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
  }

  function getStatusIndex(status) {
    const index = listStatus.indexOf(status);
    return index !== -1 ? index : "Trạng thái không tồn tại";
  }
  // Pagination controls
  const handleNext = () => {
    if (currentPage < listOrderline.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {orderDetails ==null ? (
        <div style={{ position: "relative" }}>
          {chooseItem !== null && <RateProduct item={chooseItem} setChooseItem={setChooseItem} />}
          <div className="order-list-navigate">
            {["Chờ xác nhận", "Chờ giao hàng", "Đã hoàn thành", "Đã hủy", "Trả hàng"].map((status, index) => (
              <div
                key={index}
                className={`col-md-2 ${typeOrder.includes(status) && "type-order-active"}`}
                onClick={() => {
                  setTypeOrder(status);
                  setCurrentPage(0); // Reset to first page on status change
                }}
              >
                {status}
              </div>
            ))}
          </div>
          <div className="order-list">
          {
            listOrderline.map((orderLine) => (
              <div 
                className="order-item" 
                key={orderLine.id} 
                onClick={() => setOrderDetails(orderLine)}
              >
                <div className="order-item-header">
                  <div className="order-item-shop-info">
                    <div><FontAwesomeIcon icon={faStore} style={{ fontSize: 20 }} /></div>
                    <div style={{ fontSize: 16, fontWeight: 600, display: "flex", alignItems: "flex-end" }}>
                      {orderLine.items[0]?.shopName}
                    </div>
                    <div style={{ backgroundColor: "#3498db", padding: "5px 10px", color: "white", fontSize: 14 }}>
                      <FontAwesomeIcon icon={faComment} style={{ marginRight: 2 }} /> Chat
                    </div>
                    <div style={{ border: "1px solid rgba(0,0,0,0.2)", color: "rgba(0,0,0,0.5)", fontSize: 14 }}>
                      Xem Shop
                    </div>
                  </div>
                </div>
                <div className="order-item-body">
                  <div className="order-item-list-product">
                    {orderLine.items.map((item, itemIndex) => (
                      <div className="product-item-last" key={itemIndex}>
                        <div className='order-item-product-item-contain'>
                          <div className="order-item-product-item" style={{ display: "flex" }}>
                            <div style={{ display: "flex" }}>
                              <div className="product-item-img">
                                <img src={item.image} alt="Product" />
                              </div>
                              <div className="product-item-info">
                                <div style={{ fontSize: 16, fontWeight: 600 }}>{item.productName}</div>
                                {(item.label1 || item.label2) && (
                                  <div style={{ fontSize: 15, fontWeight: 400, color: "rgba(0,0,0,0.4)" }}>
                                    {`Phân loại hàng: ${item.label1 || ''}${item.label2 ? `, ${item.label2}` : ''}`}
                                  </div>
                                )}
                                <div style={{ fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.4)" }}>
                                  Số lượng: {item.quantity}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-end" }}>
                              <div style={{ fontSize: 14, color: "rgba(0,0,0,0.3)", textDecoration: "line-through", display: "flex", alignItems: "flex-end" }}>
                                {formatPriceToVND(item.originalPrice)}
                              </div>
                              <div style={{ fontSize: 24, color: "#3498db", fontWeight: 500, lineHeight: "24px" }}>
                                {formatPriceToVND(item.price)}
                              </div>
                            </div>
                          </div>
                          {item?.isRated ==false &&
                          <div 
                            style={{ margin: "auto", display: "flex", justifyContent: "center" }} 
                            onClick={(e) => { 
                              e.stopPropagation();  // Ngừng lan truyền sự kiện 
                              setChooseItem(item);  // Thực thi hành động của item
                            }}
                          >
                            <button 
                              style={{ border: "none", backgroundColor: "#3498db", color: "white", padding: "5px 10px", cursor: "pointer" }}
                            >
                              Đánh giá sản phẩm
                            </button>
                          </div>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          }
          </div>

        </div>
      ) : (
        // Display order details when orderDetails is not null
        <div class="odocp-container">
            <div class="odocp-header">
              <a href="#" class="odocp-back-link" onClick={()=>setOrderDetails(null)}>← TRỞ LẠI</a>
              <div class="odocp-order-info">
                {orderDetails.waybillCode !=null && <span>MÃ ĐƠN HÀNG: {orderDetails?.waybillCode}|</span>}
                <span class="odocp-status" style={{}}>{orderDetails?.status}</span>
              </div>
            </div>
            <div class="odocp-progress-bar">
              <div class={`odocp-step ${getStatusIndex(orderDetails?.status)>=0?"odocp-completed":"odocp-not-completed"}`}>
                <div class="odocp-icon">📄</div>
              </div>
              <div class={`odocp-step ${getStatusIndex(orderDetails?.status)>=1?"odocp-completed":"odocp-not-completed"}`}>
                <div class="odocp-icon" style={{lineHeight:"80px"}}>✅</div>
              </div>
              <div class={`odocp-step ${getStatusIndex(orderDetails?.status)>=2?"odocp-completed":"odocp-not-completed"}`}>
                <div class="odocp-icon" style={{lineHeight:"70px"}}>🚚</div>
              </div>
              <div class={`odocp-step ${getStatusIndex(orderDetails?.status)>=6?"odocp-completed":"odocp-not-completed"}`}>
                <div class="odocp-icon">📦</div>
              </div>
              <div class={`odocp-step ${getStatusIndex(orderDetails?.status)>7?"odocp-completed":"odocp-not-completed"}`}>
                <div class="odocp-icon">⭐</div>
              </div>
            </div>
            <div className="odocp-progress-bar">
              <div className={`odocp-step-content ${getStatusIndex(orderDetails?.status) >= 0 ? "odocp-completed" : "odocp-not-completed"}`}>
                <p>Đơn Hàng Đã Đặt</p>
                <span>{orderDetails?.createdAt ? formatDate(orderDetails.createdAt) : "Chưa có thông tin"}</span>
              </div>
              <div className={`odocp-step-content ${getStatusIndex(orderDetails?.status) >= 1 ? "odocp-completed" : "odocp-not-completed"}`}>
                <p>Đã Được Xác Nhận</p>
                <span>{orderDetails?.confirmTime ? formatDate(orderDetails.confirmTime) : "Chưa có thông tin"}</span>
              </div>
              <div className={`odocp-step-content ${getStatusIndex(orderDetails?.status) >= 2 ? "odocp-completed" : "odocp-not-completed"}`}>
                <p>Đang Giao Hàng</p>
                <span>{orderDetails?.shipperPickupTime ? formatDate(orderDetails.shipperPickupTime) : "Chưa có thông tin"}</span>
              </div>
              <div className={`odocp-step-content ${getStatusIndex(orderDetails?.status) >= 6 ? "odocp-completed" : "odocp-not-completed"}`}>
                <p>Đã Tới Kho Đích</p>
                <span>{orderDetails?.deliveryWarehouseReceiveTime ? formatDate(orderDetails.deliveryWarehouseReceiveTime) : "Chưa có thông tin"}</span>
              </div>
              <div className={`odocp-step-content ${getStatusIndex(orderDetails?.status) > 7 ? "odocp-completed" : "odocp-not-completed"}`}>
                <p>Đơn Hàng Đã Hoàn Thành</p>
                <span>{orderDetails?.doneTime ? formatDate(orderDetails.doneTime) : "Chưa có thông tin"}</span>
              </div>
            </div>

            <div class="odocp-footer">
              <p>Cảm ơn bạn đã mua sắm tại Hyyang!</p>
              <button class="odocp-buy-again">Mua Lại</button>
              <button class="odocp-contact-seller">Liên Hệ Người Bán</button>
            </div>
            <div class="odoc-lsdh-body">
              <div class="odoc-lsdh-container">
                <div class="odoc-lsdh-left-panel">
                  <h2 class="odoc-lsdh-left-panel-title">Địa Chỉ Nhận Hàng</h2>
                  <p class="odoc-lsdh-left-panel-text"><strong>{orderDetails?.addressCustomer.nameUser}</strong></p>
                  <p class="odoc-lsdh-left-panel-text">{orderDetails?.addressCustomer.phoneNumberUser}</p>
                  <p class="odoc-lsdh-left-panel-text">{`${orderDetails.addressCustomer.addressDetails}, ${orderDetails?.addressCustomer.ward}, ${orderDetails.addressCustomer.district}, ${orderDetails.addressCustomer.city}`}</p>
                </div>
                <div class="odoc-lsdh-right-panel">
                <div class="odoc-lsdh-timeline">
                  {/* <div class="odoc-lsdh-status  odoc-lsdh-status-no-final odoc-lsdh-status-completed">
                    <div>
                      <span class="odoc-lsdh-status-text" style={{marginRight:10}}>Đã giao</span>
                      <span class="odoc-lsdh-status-time">13:51 10-03-2024</span>
                    </div>
                    <p class="odoc-lsdh-status-description">Giao hàng thành công Người nhận hàng: Nguyễn Hữu Huy</p>
                  </div>
                  <div class="odoc-lsdh-status  odoc-lsdh-status-no-final odoc-lsdh-status-completed">
                    <div>
                      <span class="odoc-lsdh-status-text" style={{marginRight:10}}>Đã giao</span>
                      <span class="odoc-lsdh-status-time">13:51 10-03-2024</span>
                    </div>
                    <p class="odoc-lsdh-status-description">Giao hàng thành công Người nhận hàng: Nguyễn Hữu Huy</p>
                  </div>
                  <div class="odoc-lsdh-status odoc-lsdh-status-completed">
                    <div>
                      <span class="odoc-lsdh-status-text" style={{marginRight:10}}>Đã giao</span>
                      <span class="odoc-lsdh-status-time">13:51 10-03-2024</span>
                    </div>
                    <p class="odoc-lsdh-status-description">Giao hàng thành công Người nhận hàng: Nguyễn Hữu Huy</p>
                  </div> */}
                  {
                    process.map((item,index)=>(
                      <div class={`odoc-lsdh-status odoc-lsdh-status-completed ${index < item.length-1 ? "odoc-lsdh-status-no-final":""}`}>
                        <div>
                          <span class="odoc-lsdh-status-text" style={{marginRight:10}}>{item.title}</span>
                          <span class="odoc-lsdh-status-time">{formatDate(item.time)}</span>
                        </div>
                        <p class="odoc-lsdh-status-description">{item.message}</p>
                      </div>
                    ))
                  }
                  <div class="odoc-lsdh-btn-toggle">Rút gọn</div>
                </div>
              </div>
              </div>
            </div>
            <div className='odoc-product-body'>
              <div className='odoc-product-body-header'>
                <div style={{fontWeight:700,margin:"auto 0px",marginRight:"40px"}}>{orderDetails?.items[0].shopName}</div>
                <div style={{cursor:"pointer", backgroundColor:"#3498dbc7", padding:"3px 5px",color:"white",marginRight:20}}>
                  <FontAwesomeIcon icon={faComment}/> Chat
                </div>
                <div style={{cursor:"pointer", color:"#3498dbc7", padding:"3px 5px",backgroundColor:"white", border:"1px solid #3498dbc7"}}>
                  <FontAwesomeIcon icon={faShop}/> Xem shop
                </div>
              </div>
              <div className='odoc-product-body-body'>
                <table>
                  
                  {
                    orderDetails.items.map((item,index)=>(
                      <tr>
                      <td>
                        <div style={{display:"flex"}}>
                          <div style={{width:80, height:80, marginRight:30}}><img src={item?.image}></img></div>
                          <div style={{margin:"auto 0px"}}>
                            <div style={{fontWeight:600}}>{item?.productName}</div>
                            <div style={{fontSize:13,color:"rgba(0,0,0,0.5)"}}>Phân loại hàng: {item?.label1}, {item?.label2}</div>
                            <div style={{fontSize:12,color:"rgba(0,0,0,0.5)"}}>Số lượng: {item?.quantity}</div>
                          </div>
                        </div>
                      </td>
                      <td >
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", margin: "auto 0" }}>
                          <div
                            style={{
                              color: "gray",
                              textDecoration: "line-through",
                              fontSize: "12px",
                              marginRight: "8px", // Khoảng cách giữa hai giá
                            }}
                          >
                            {formatPriceToVND(item?.originalPrice)}
                          </div>
                          <div
                            style={{
                              color: "#3498dbc7",
                              fontSize: "18px",
                            }}
                          >
                            {formatPriceToVND(item?.price)}
                          </div>
                        </div>
                      </td>
  
                    </tr>
                    ))
                  }
                  <tr >
                    <td style={{border:"1px solid rgba(0,0,0,0.3)", padding:"0px", borderRight:"none"}}>
                      <div style={{textAlign:"end", paddingRight:20}}>Tổng tiền hàng</div>
                    </td>
                    <td style={{border:"1px solid rgba(0,0,0,0.3)"}}>{formatPriceToVND(orderDetails?.totalAmount)}</td>
                  </tr>
                  <tr >
                    <td style={{border:"1px solid rgba(0,0,0,0.3)", padding:"5px", borderRight:"none"}}>
                      <div style={{textAlign:"end", paddingRight:20}}>Phí vận chuyển</div>
                    </td>
                    <td style={{border:"1px solid rgba(0,0,0,0.3)"}}>{formatPriceToVND(orderDetails?.shipCost)}</td>
                  </tr>
                  <tr >
                    <td style={{border:"1px solid rgba(0,0,0,0.3)", padding:"5px", borderRight:"none"}}>
                      <div style={{textAlign:"end", paddingRight:20}}>Giảm giá</div>
                    </td>
                    <td style={{border:"1px solid rgba(0,0,0,0.3)"}}>{formatPriceToVND(orderDetails?.reduceAmount)}</td>
                  </tr>
                  <tr >
                    <td style={{border:"1px solid rgba(0,0,0,0.3)", padding:"5px", borderRight:"none"}}>
                      <div style={{textAlign:"end", paddingRight:20}}>Thanh toán</div>
                    </td>
                    <td style={{border:"1px solid rgba(0,0,0,0.3)"}}>{formatPriceToVND(orderDetails?.totalAmount + orderDetails?.shipCost - orderDetails?.reduceAmount)}</td>
                  </tr>
                </table>
              </div>
            </div>

        </div>
      )}
    </div>
  );
};

export default OrderList;
