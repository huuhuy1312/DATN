import React, { useEffect, useState } from "react";
import orderlineService from "../../../../services/orderline.service";
import ChooseShipperPage from "./components/ChooseShiperPage";
import orderService from "../../../../services/order.service";
import shipperService from "../../../../services/shipper.service";
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
const ManageOrderPage = () => {
  const [listOrderLine,setListOrderLine] = useState([]);
  const [chooseOrderline,setChooseOrderline] = useState(null);
  const [chooseStatus,setChooseStatus] = useState(2);
  const [countOLInfo,setCountOLInfo] = useState(null);
  const [listShipper,setListShipper] = useState([])
  const [condition, setCondition] = useState({
      code: "",        // Search by order code
      fromCreatedAt: "", // from date
      toCreatedAt: "",   // to date
  
  });
  const getShipperByWarehouse= async ()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await shipperService.findByAccountWarehouse(user?.id);
    console.log(response)
    setListShipper(response)
  }
  const getContactWarehouseById=(id)=>{
    const shipper = listShipper.find(shipper =>shipper.id === id);
    return(
      <>
        <div>{shipper.name} - {shipper.phoneNumber}</div>
        <div>{`Số đơn đang xử lý: ${shipper.shippingOrdersCount + shipper.pickingUpOrdersCount}`}</div>
        <div>{shipper.note}</div>
      </>
    )
  }
  const formatDateForRequest = (date, time) => {
    // Assuming the input date is in 'YYYY-MM-DD' format
    return `${date}T${time}`;
  };
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
  const getListOrderWaitPickUp = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    condition.idPickupWarehouse = user?.id;
    const response = await orderlineService.getByCondition(condition)
    console.log(response);
    setListOrderLine(response);
};
function countOrdersByStatus(listOrderLine, status) {
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


// Sử dụng:


const afterChooseShipper=()=>{
    setChooseOrderline(null);
    getListOrderWaitPickUp();

}
  useEffect(()=>{
    getShipperByWarehouse()
  },[])
  useEffect(()=>{
    console.log(chooseStatus)
    getListOrderWaitPickUp();
    
  },[chooseStatus,condition])
  function formatPriceToVND(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

const calculateTotalWeight = (order) => {
  return order.items.reduce((totalWeight, item) => {
      return totalWeight + (item.weight * item.quantity); 
  }, 0); 
};
const updateStatusOrderLine=async (id,status)=>{
  const body = {
    "id":id,
    "status" : status
  }
  const response =  await orderlineService.updateOrderLine(body);
  console.log(response)
  getListOrderWaitPickUp();

}
  return (
    <div style={{width:"100%"}}>
        {chooseOrderline!=null &&<ChooseShipperPage orderline={chooseOrderline } status={chooseOrderline?.status} after={afterChooseShipper} />}
      <div className="spp-main-content">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <h1 className="spp-title">Quản lý đơn hàng</h1>
        <div>Kho vận chuyển Yết Kiêu</div>
      </div>

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
          <label htmlFor="warehouse">Chọn shipper</label>
          <select id="warehouse"> {/* Add id for the label's for attribute */}
            {listShipper.map((item) => (
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
            <button onClick={getListOrderWaitPickUp}>Tìm kiếm</button>
          </div>
          
        </div>

      <div className="spp-actions">
        <button>IN ĐƠN</button>
        <button>XUẤT EXCEL</button>
        <button>NHẬP EXCEL</button>
      </div>

      <div className="spp-order-summary">
        <div className={chooseStatus == 2 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(2)}}>
          <p>Chờ xử lý</p>
          <h2>{`${countOrdersByStatus(listOrderLine,"Đang xử lý")} đơn`}</h2>
        </div>
        <div className={chooseStatus == 3 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(3)}}>
          <p>Đang lấy hàng</p>
          <h2>{`${countOrdersByStatus(listOrderLine,listStatus[3])} đơn`}</h2>
        </div>
        <div className={chooseStatus == 4 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(4)}}>
          <p>Đã lấy hàng</p>
          <h2>{`${countOrdersByStatus(listOrderLine,listStatus[4])} đơn`}</h2>
        </div>

      </div>

      <table className="spp-order-table">
        <thead>
          <tr>
            <th style={{width:"10%"}}>Mã vận đơn</th>
            {chooseStatus==2&&<th style={{width:"20%"}}>Người gửi</th>}
            {chooseStatus==3&&<th style={{width:"20%"}}>Shipper lấy hàng</th>}
            <th style={{width:"20%"}}>Sản phẩm</th>
            <th style={{width:"7.5%"}}>Ngày lấy hàng</th>
            <th style={{width:"7.5%"}}>Cân nặng</th>
            <th style={{width:"10%"}}>P.thức vận chuyển</th>
            <th style={{width:"10%"}}>Tổng tiền</th>
            <th style={{width:"10%"}}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {listOrderLine
            .filter(orderline => orderline.status === listStatus[chooseStatus]) // Lọc theo trạng thái
            .map((orderline, lineIndex, filteredLines) => (
              <tr key={lineIndex}>
                <td >
                  {orderline.code}
                </td>

                {chooseStatus==2 &&
                  <td>
                    <div>{`${orderline.addressSeller?.nameUser || ''} - ${orderline.addressSeller?.phoneNumberUser || ''}`}</div>
                    <div>
                      {`${orderline.addressSeller?.addressDetails || ''}, 
                      ${orderline.addressSeller?.ward || ''}, 
                      ${orderline.addressSeller?.district || ''}, 
                      ${orderline.addressSeller?.city || ''}`}
                    </div>
                  </td>
                }

                {chooseStatus==3 &&
                  <td>
                    {getContactWarehouseById(orderline.idPickupShipper)}
                  </td>
                }
                <td style={{ padding: "1rem 1rem" }}>
                  <div className="custom-scrollbar">
                    {orderline.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        style={{
                          height: "6rem",
                          display: "flex",
                          position: "relative",
                          marginBottom: 5,
                          borderBottom:
                            itemIndex < orderline.items.length - 1
                              ? "1px solid rgba(0,0,0,0.3)"
                              : "none",
                          paddingBottom: 5,
                        }}
                      >
                        <img
                          src={item?.image}
                          style={{ width: "6rem", marginRight: "2rem" }}
                          alt="product"
                        />
                        <div style={{ margin: "auto 0px" }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              width: "22rem",
                              whiteSpace: "normal",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {item?.productName}
                          </div>
                          <div
                            style={{
                              color: "rgba(0,0,0,0.3)",
                              fontSize: 12,
                            }}
                          >
                            {`Phân loại hàng: ${item.label1}${
                              item.label2 ? `, ${item.label2}` : ""
                            }`}
                          </div>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            right: "0%",
                            top: "0%",
                          }}
                        >
                          x{item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td>{orderline?.sellerPickupRequestDate || 'N/A'}</td>
                <td>{`${calculateTotalWeight(orderline)} (gram)`}</td>
                <td>{orderline.shippingMethods?.name || 'N/A'}</td>
                <td>{formatPriceToVND(orderline.totalAmount || 0)}</td>
                <td>
                  {orderline?.status === "Đã xác nhận" && (
                    <button onClick={() => setChooseOrderline(orderline)}>Xử lý đơn hàng</button>
                  )}
                  {orderline?.status === "Đã tới kho đích" && (
                    <button onClick={() => setChooseOrderline(orderline)}>Chọn shipper giao hàng</button>
                  )}
                  {orderline?.status === "Đang xử lý" && (
                    <button onClick={() => setChooseOrderline(orderline)}>Chọn shipper lấy hàng</button>
                  )}
                  {orderline?.status === "Đã lấy hàng" && (
                    <button onClick={() => updateStatusOrderLine(orderline.id,listStatus[5])}>Chuyển tới kho đích</button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>

      </table>
      </div>
    </div>
    
  );
};

export default ManageOrderPage;
