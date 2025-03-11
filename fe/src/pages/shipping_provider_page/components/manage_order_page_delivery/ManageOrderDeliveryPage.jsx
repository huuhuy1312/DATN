import React, { useEffect, useState } from "react";
import orderlineService from "../../../../services/orderline.service";
import ChooseShipperPage from "./components/ChooseShiperPage";

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
  const [chooseStatus,setChooseStatus] = useState(5);

  const getListOrderWaitPickUp = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const body = {
      "idDeliveryWarehouse":user?.id
    }
    const response = await orderlineService.getByCondition(body)
    console.log(response);
    setListOrderLine(response);
};
function countOrdersByStatus(listOrderLine, status) {
  if (!Array.isArray(listOrderLine)) {
      return 0; 
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
    console.log(chooseStatus)
    getListOrderWaitPickUp();
  },[chooseStatus])
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
  const currentDateTime = new Date();
  currentDateTime.setHours(currentDateTime.getHours() + 7); // Thêm 7 giờ
  const formattedDateTime = currentDateTime.toISOString(); 
  const body = {
    "id":id,
    "status" : status,
    "deliveryWarehouseReceiveTime": formattedDateTime
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
        <input type="text" placeholder="Tìm đơn hàng" />
        <input type="date" />
        <input type="date" />
        <select>
          <option>Tất cả kho hàng</option>
        </select>
        <select>
          <option>Người trả cước</option>
        </select>
        <select>
          <option>Chọn theo dịch vụ</option>
        </select>
        <button>Tìm kiếm</button>
      </div>

      <div className="spp-actions">
        <button>IN ĐƠN</button>
        <button>XUẤT EXCEL</button>
        <button>NHẬP EXCEL</button>
      </div>

      <div className="spp-order-summary">
        <div className={chooseStatus == 5 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(5)}}>
          <p>{listStatus[5]}</p>
          <h2>{`${countOrdersByStatus(listOrderLine,listStatus[5])} đơn`}</h2>
        </div>
        <div className={chooseStatus == 6 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(6)}}>
          <p>{listStatus[6]}</p>
          <h2>{`${countOrdersByStatus(listOrderLine,listStatus[6])} đơn`}</h2>
        </div>
        <div className={chooseStatus == 7 ?"spp-summary-item-choose":"spp-summary-item"} onClick={()=>{setChooseStatus(7)}}>
          <p>{listStatus[7]}</p>
          <h2>{`${countOrdersByStatus(listOrderLine,listStatus[7])} đơn`}</h2>
        </div>

      </div>

      <table className="spp-order-table">
        <thead>
          <tr>
            <th style={{width:"10%"}}>Mã vận đơn</th>
            <th style={{width:"20%"}}>Người nhận</th>
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

                <td>
                  <div>{`${orderline.addressCustomer?.nameUser || ''} - ${orderline.addressCustomer?.phoneNumberUser || ''}`}</div>
                  <div>
                    {`${orderline.addressCustomer?.addressDetails || ''}, 
                    ${orderline.addressCustomer?.ward || ''}, 
                    ${orderline.addressCustomer?.district || ''}, 
                    ${orderline.addressCustomer?.city || ''}`}
                  </div>
                </td>
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
                  {orderline?.status === listStatus[5] && (
                    <button onClick={() => updateStatusOrderLine(orderline.id,listStatus[6])}>Đã nhận được hàng</button>
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
