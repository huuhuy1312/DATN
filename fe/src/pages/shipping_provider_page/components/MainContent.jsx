import React, { useEffect, useState } from "react";
import orderlineService from "../../../services/orderline.service";
import ChooseWarehouse from "./ChooseWarehouse";
import warehouseService from "../../../services/warehouse.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
const MainContent = () => {
  const [listOrderLine, setListOrderLine] = useState([]);
  const [chooseOrderline, setChooseOrderline] = useState(null);
  const [chooseStatus, setChooseStatus] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state
  const [listWarehouse,setListWarehouse] = useState([]);
  const [orderView,setOrderView] = useState(null);
  const [process, setProcess] = useState([]);
  const itemsPerPage = 10; // Items per page
  const getWarehouse = async ()=>{
    const response = await warehouseService.getAll();
    console.log(response)
    setListWarehouse(response?.warehouses)
  }
  const getAddressWarehouseById = (id) => {
    const warehouse = listWarehouse.find(warehouse => warehouse.id === id).address;
    return `${warehouse.addressDetails}, ${warehouse.ward}, ${warehouse.district}, ${warehouse.city}`
  };

  const getContactWarehouseById = (id) => {
    const warehouse = listWarehouse.find(warehouse => warehouse.id === id);
    return `${warehouse.name} - ${warehouse.address.phoneNumberUser}`
  };
  const [condition, setCondition] = useState({
    code: "",        // Search by order code
    fromCreatedAt: "", // from date
    toCreatedAt: "",   // to date

  });

  const getOrderLines = async () => {
    setLoading(true); // Start loading
    const response = await orderlineService.getByCondition(condition);
    console.log(response);
    setListOrderLine(response);
    setLoading(false); // End loading
  };

  useEffect(() => {
    getOrderLines();
  }, [chooseOrderline, chooseStatus, condition]);

  const getListOrderLineWaitPickUp = async () => {
    setLoading(true); // Start loading
    const response = await orderlineService.getByCondition(condition);
    console.log(response);
    setListOrderLine(response);
    setLoading(false); // End loading
    getWarehouse()
  };

  useEffect(() => {
    getListOrderLineWaitPickUp();
  }, [condition]);

  const formatPriceToVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const afterConfirm = () => {
    getListOrderLineWaitPickUp();
    setChooseOrderline(null);
  };

  const calculateTotalWeight = (order) => {
    return order.items.reduce((totalWeight, item) => {
      return totalWeight + (item.weight * item.quantity);
    }, 0);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listOrderLine.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(listOrderLine.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Adjust date format for fromCreatedAt and toCreatedAt
    if (name === 'fromCreatedAt' && value) {
      // Add 00:00:00 to the fromCreatedAt
      setCondition((prevCondition) => ({
        ...prevCondition,
        [name]: formatDateForRequest(value, "00:00:00"), // Format date with time 00:00:00
      }));
    } else if (name === 'toCreatedAt' && value) {
      // Add 23:59:59 to the toCreatedAt
      setCondition((prevCondition) => ({
        ...prevCondition,
        [name]: formatDateForRequest(value, "23:59:59"), // Format date with time 23:59:59
      }));
    } else {
      // For other fields, just update normally
      setCondition((prevCondition) => ({
        ...prevCondition,
        [name]: value,
      }));
    }
  };

  const formatDateToDisplay = (isoDateString) => {
    const date = new Date(isoDateString);
  
    // Get the components of the date
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    // Format as 'MM:HH dd/MM/yyyy'
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };
  function countOrdersByStatus( status) {
    if (!Array.isArray(listOrderLine)) {
        return 0; // Nếu listOrderLine không phải là mảng hoặc undefined, trả về 0
    }
  
    return listOrderLine.reduce((count, orderLine) => {
        if (orderLine.status === status) {
            count++;
        }
        return count;
    }, 0);
  }
  // Function to format date with time
  const formatDateForRequest = (date, time) => {
    // Assuming the input date is in 'YYYY-MM-DD' format
    return `${date}T${time}`;
  };
    const getProcess = async (id) => {
      const response = await orderlineService.getProcess(id);
      console.log(response)
      setProcess(response);
    };
  
    useEffect(() => {
      console.log(orderView);
      if (orderView != null) getProcess(orderView?.id);
    }, [orderView]);
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
  
  return (
    <div style={{ width: "100%" }}>
      { orderView == null ?(
      <>
      {chooseOrderline != null && <ChooseWarehouse orderline={chooseOrderline} after={afterConfirm} />}
      <div className="spp-main-content">
        <h1 className="spp-title">Quản lý vận hành</h1>

        <div className="spp-search-bar">
          <div>
            <label htmlFor="orderCode">Tìm đơn hàng</label>
            <input
              id="orderCode" // Add id for the label's for attribute
              type="text"
              placeholder="Tìm đơn hàng"
              name="code"
              value={condition.code}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="fromCreatedAt">Ngày từ</label>
            <input
              id="fromCreatedAt" // Add id for the label's for attribute
              type="date"
              name="fromCreatedAt"
              value={condition.fromCreatedAt.slice(0, 10)} // Extract date portion in 'YYYY-MM-DD' format
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="toCreatedAt">Ngày đến</label>
            <input
              id="toCreatedAt" // Add id for the label's for attribute
              type="date"
              name="toCreatedAt"
              value={condition.toCreatedAt.slice(0, 10)} // Extract date portion in 'YYYY-MM-DD' format
              onChange={handleInputChange}
            />
          </div>
          <div>
          <label htmlFor="warehouse">Chọn kho hàng</label>
          <select id="warehouse"> {/* Add id for the label's for attribute */}
            {listWarehouse.map((item) => (
              <option key={item.id}>{item?.name}</option>
            ))}
          </select>
          </div>
          <div>
            <label htmlFor="shipper">Người trả cước</label>
            <select id="shipper"> {/* Add id for the label's for attribute */}
              <option>Người trả cước</option>
            </select>
          </div>
          <div>
            <label htmlFor="service">Chọn theo dịch vụ</label>
            <select id="service"> {/* Add id for the label's for attribute */}
              <option>Chọn theo dịch vụ</option>
            </select>
          </div>
          <div>
            <label> '</label>
            <button onClick={getListOrderLineWaitPickUp}>Tìm kiếm</button>
          </div>
          
        </div>
        {/* <div className="spp-actions">
          <button>IN ĐƠN</button>
          <button>XUẤT EXCEL</button>
          <button>NHẬP EXCEL</button>
        </div> */}
        <div className="spp-order-summary">
          <div className={chooseStatus == 1 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(1)}}>
            <p>Đã xác nhận</p>
            <h2>{countOrdersByStatus(listStatus[1])} đơn</h2>
          </div>
          <div className={chooseStatus == 2 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(2)}}>
            <p>Đã chọn kho hàng</p>
            <h2>{countOrdersByStatus(listStatus[2])} đơn</h2>
          </div>
          <div className={chooseStatus == 3 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(3)}}>
            <p>Đang lấy hàng</p>
            <h2>{countOrdersByStatus(listStatus[3])} đơn</h2>
          </div>
          <div className={chooseStatus == 4 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(4)}}>
            <p>Đã lấy hàng</p>
            <h2>{countOrdersByStatus(listStatus[4])} đơn</h2>
          </div>
        </div>
        <div className="spp-order-summary">
          <div className={chooseStatus == 5 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(5)}}>
            <p>Đang tới kho đích</p>
            <h2>{countOrdersByStatus(listStatus[5])} đơn</h2>
          </div>
          <div className={chooseStatus == 6 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(6)}}>
            <p>Đã tới kho đích</p>
            <h2>{countOrdersByStatus(listStatus[6])} đơn</h2>
          </div>
          <div className={chooseStatus == 7 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(7)}}>
            <p>Đang tới người nhận</p>
            <h2>{countOrdersByStatus(listStatus[7])} đơn</h2>
          </div>
          <div className={chooseStatus == 8 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(8)}}>
            <p>Đã hoàn thành</p>
            <h2>{countOrdersByStatus(listStatus[8])} đơn</h2>
          </div>
        </div>
        <div className="spp-order-summary">
          {/* Summary items could be placed here */}
        </div>

        {loading ? (
          // Show loading indicator while data is being fetched
          <div className="loading-indicator">
            <p>Đang tải...</p>
          </div>
        ) : (
          <table className="spp-order-table">
            <thead>
              <tr>
                <th style={{ width: "7.5%" }}>Mã đơn hàng</th>
                {chooseStatus==1&&(
                  <> 
                    <th style={{ width: "20%" }}>Người nhận</th>
                    <th style={{ width: "20%" }}>Người gửi</th>
                  </>
                )}
                {chooseStatus==2&&(
                  <> 
                    <th style={{ width: "20%" }}>Kho lấy hàng</th>
                    <th style={{ width: "20%" }}>Kho vận chuyển</th>
                  </>
                )}
                {
                  chooseStatus ==3&&(
                    <>
                      <th style={{ width: "20%" }}>Kho lấy hàng</th>
                      <th style={{ width: "10%" }}>Ngày lấy hàng</th>
                    </>
                  )
                }
                <th style={{ width: "10%" }}>Ngày tạo</th>
                
                <th style={{ width: "7.5%" }}>Cân nặng</th>
                <th style={{ width: "10%" }}>P.thức vận chuyển</th>
                <th style={{ width: "7.5%" }}>Thành tiền</th>
                <th style={{ width: "10%" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
            {currentItems != null && currentItems.map((orderLine, orderLineIndex) => (
              // Check if the orderLine's status matches the value in listStatus[chooseStatus]
              orderLine.status === listStatus[chooseStatus] && (
                <tr key={orderLineIndex}>
                  <td><div>{orderLine.waybillCode}</div> <div style={{color:"#ff6600",cursor:"pointer"}}onClick={()=>setOrderView(orderLine)}>Xem chi tiết...</div></td>
                  { chooseStatus==1&&
                  <>  
                    <td>
                      <div>{`${orderLine.addressCustomer.nameUser}-${orderLine.addressCustomer.phoneNumberUser}`}</div>
                      <div>{`${orderLine.addressCustomer.addressDetails}, ${orderLine.addressCustomer.ward}, ${orderLine.addressCustomer.district}, ${orderLine.addressCustomer.city}`}</div>
                    </td>
                    <td>
                      <div>{`${orderLine.addressSeller.nameUser}-${orderLine.addressSeller.phoneNumberUser}`}</div>
                      <div>{`${orderLine.addressSeller.addressDetails}, ${orderLine.addressSeller.ward}, ${orderLine.addressSeller.district}, ${orderLine.addressSeller.city}`}</div>
                    </td>
                  </>
                  }
                  { chooseStatus==2&&
                  <>  
                    <td>
                      <div>{getContactWarehouseById(orderLine?.idPickupWarehouse)}</div>
                      <div>{getAddressWarehouseById(orderLine?.idPickupWarehouse)}</div>
                    </td>
                    <td>
                      <div>{getContactWarehouseById(orderLine?.idDeliveryWarehouse)}</div>
                      <div>{getAddressWarehouseById(orderLine?.idDeliveryWarehouse)}</div>
                    </td>
                  </>
                  }
                  { chooseStatus==3&&
                  <>  
                    <td>
                      <div>{getContactWarehouseById(orderLine?.idPickupWarehouse)}</div>
                      <div>{getAddressWarehouseById(orderLine?.idPickupWarehouse)}</div>
                    </td>
                    <td>
                      {orderLine?.sellerPickupRequestDate}
                    </td>
                  </>
                  }
                  <td>{formatDateToDisplay(orderLine?.createdAt)}</td>
                  <td>{calculateTotalWeight(orderLine)} gram</td>
                  <td>{orderLine.shippingMethods.name}</td>
                  <td>{formatPriceToVND(orderLine.totalAmount + orderLine.shipCost - orderLine.reduceAmount)}</td>
                  <td>
                    {chooseStatus === 1 &&
                      <button onClick={() => setChooseOrderline(orderLine)}>
                        Chọn kho hàng
                      </button>
                    }
                    {chooseStatus === 2 &&
                      <button onClick={() => setChooseOrderline(orderLine)}>
                        Thay đổi kho hàng
                      </button>
                    }
                  </td>
                </tr>
              )
            ))}

            </tbody>
          </table>
        )}

        {/* Pagination controls */}
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={index + 1 === currentPage ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Inline styles for pagination */}
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .pagination button {
          margin: 0 5px;
          padding: 8px 16px;
          cursor: pointer;
          background-color: #f1f1f1;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .pagination button:hover {
          background-color: #ddd;
        }
        .pagination button:disabled {
          cursor: not-allowed;
          background-color: #f9f9f9;
        }
        .pagination .active {
          background-color: #007bff;
          color: white;
        }

        .loading-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .loading-indicator p {
          font-size: 18px;
          color: #007bff;
        }
      `}</style>
      </>
      ):(
        <div class="odocp-container">
            <div class="odocp-header">
              <button  onClick={()=>setOrderView(null)}>← TRỞ LẠI</button>
              <div class="odocp-order-info">
                {orderView.waybillCode !=null && <span>MÃ ĐƠN HÀNG: {orderView?.waybillCode}|</span>}
                <span class="odocp-status" style={{}}>{orderView?.status}</span>
              </div>
            </div>
            
           
           
            <div class="odoc-lsdh-body">
              <div class="odoc-lsdh-container">
                <div class="odoc-lsdh-left-panel">
                  <h2 class="odoc-lsdh-left-panel-title">Địa Chỉ Nhận Hàng</h2>
                  <p class="odoc-lsdh-left-panel-text"><strong>{orderView?.addressCustomer.nameUser}</strong></p>
                  <p class="odoc-lsdh-left-panel-text">{orderView?.addressCustomer.phoneNumberUser}</p>
                  <p class="odoc-lsdh-left-panel-text">{`${orderView.addressCustomer.addressDetails}, ${orderView?.addressCustomer.ward}, ${orderView.addressCustomer.district}, ${orderView.addressCustomer.city}`}</p>
                </div>
                <div class="odoc-lsdh-right-panel">
                <div class="odoc-lsdh-timeline">
                  
                  {
                    process.map((item,index)=>(
                      <div class={`odoc-lsdh-status odoc-lsdh-status-completed ${index < item.length-1 ? "odoc-lsdh-status-no-final":""}`}>
                        <style>
                          {`
                            .odoc-lsdh-status-completed::before {
                              background-color: #ff6600;
                              display:none
                            }
                          `}
                        </style>
                        <div style={{color:"#ff6600"}}>
                          <span class="odoc-lsdh-status-text" style={{marginRight:10,color:"#ff6600"}}>{item.title}</span>
                          <span class="odoc-lsdh-status-time">{formatDate(item.time)}</span>
                        </div>
                        <p class="odoc-lsdh-status-description">{item.message}</p>
                      </div>
                    ))
                  }
                  <div class="odoc-lsdh-btn-toggle" style={{color:"#ff6600"}}>Rút gọn</div>
                </div>
              </div>
              </div>
            </div>
            <div className='odoc-product-body'>
              <div className='odoc-product-body-header'>
                <div style={{fontWeight:700,margin:"auto 0px",marginRight:"40px"}}>{orderView?.items[0].shopName}</div>
                {/* <div style={{cursor:"pointer", backgroundColor:"#3498dbc7", padding:"3px 5px",color:"white",marginRight:20}}>
                  <FontAwesomeIcon icon={faComment}/> Chat
                </div>
                <div style={{cursor:"pointer", color:"#3498dbc7", padding:"3px 5px",backgroundColor:"white", border:"1px solid #3498dbc7"}}>
                  <FontAwesomeIcon icon={faShop}/> Xem shop
                </div> */}
              </div>
              <div className='odoc-product-body-body'>
                <table>
                  
                  {
                    orderView.items.map((item,index)=>(
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
                              color: "#ff6600",
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
                    <td style={{border:"1px solid rgba(0,0,0,0.3)"}}>{formatPriceToVND(orderView?.totalAmount)}</td>
                  </tr>
                  <tr >
                    <td style={{border:"1px solid rgba(0,0,0,0.3)", padding:"5px", borderRight:"none"}}>
                      <div style={{textAlign:"end", paddingRight:20}}>Phí vận chuyển</div>
                    </td>
                    <td style={{border:"1px solid rgba(0,0,0,0.3)"}}>{formatPriceToVND(orderView?.shipCost)}</td>
                  </tr>
                  <tr >
                    <td style={{border:"1px solid rgba(0,0,0,0.3)", padding:"5px", borderRight:"none"}}>
                      <div style={{textAlign:"end", paddingRight:20}}>Giảm giá</div>
                    </td>
                    <td style={{border:"1px solid rgba(0,0,0,0.3)"}}>{formatPriceToVND(orderView?.reduceAmount)}</td>
                  </tr>
                  <tr >
                    <td style={{border:"1px solid rgba(0,0,0,0.3)", padding:"5px", borderRight:"none"}}>
                      <div style={{textAlign:"end", paddingRight:20}}>Thanh toán</div>
                    </td>
                    <td style={{border:"1px solid rgba(0,0,0,0.3)"}}>{formatPriceToVND(orderView?.totalAmount + orderView?.shipCost - orderView?.reduceAmount)}</td>
                  </tr>
                </table>
              </div>
            </div>

        </div>
      )}
    </div>
  );
};

export default MainContent;
