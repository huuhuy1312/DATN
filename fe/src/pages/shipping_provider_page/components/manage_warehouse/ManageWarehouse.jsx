import React, { useEffect, useState } from "react";
import orderService from "../../../../services/order.service";
import AddWarehouse from "./AddWarehouse";
import AlertNotification from "../../../components/AlertNotification";
import { message } from "antd";
import warehouseService from "../../../../services/warehouse.service";

const listStatus = [
  "Chờ xác nhận", // 0
  "Đã xác nhận", // 1
  "Đang xử lý", // 2
  "Đang lấy hàng", // 3
  "Đã lấy hàng", // 4
  "Đang vận chuyển tới kho đích", // 5
  "Đã tới kho đích", // 6
  "Đang vận chuyển tới người nhận", // 7
  "Đã hoàn thành", // 8
];

const formDataAdd = {
  id: null,
  nameUser: "",
  phoneNumberUser: "",
  username: "",
  password: "",
  city: "",
  district: "",
  ward: "",
  addressDetails: "",
};

const ManageWarehouse = () => {
  const [listWarehouse, setListWarehouse] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái tải
  const [showAddForm, setShowAddForm] = useState(false);
  const [chooseWarehouse, setChooseWarehouse] = useState(null);
  const [alert, setAlert] = useState(null);

  function countStatus(orderlines, warehouse) {
    if (!orderlines || orderlines.length === 0) {
      return new Array(listStatus.length).fill(0);
    }

    const statusCount = new Array(listStatus.length).fill(0);

    orderlines.forEach((orderline) => {
      const statusIndex = listStatus.indexOf(orderline.status);

      if (statusIndex !== -1) {
        if (statusIndex >= 5 && warehouse.id === orderline.idDeliveryWarehouse) {
          statusCount[statusIndex]++;
        } else if (statusIndex < 5 && warehouse.id === orderline.idPickupWarehouse) {
          statusCount[statusIndex]++;
        }
      }
    });

    return statusCount;
  }

  const handleUpdate = (warehouse) => {
    const warehouseDefault = {
      id: warehouse.id,
      nameUser: warehouse.warehouseName,
      phoneNumberUser: warehouse.addressResponse.phoneNumberUser,
      changePassword: "",
      city: warehouse.addressResponse.city,
      district: warehouse.addressResponse.district,
      ward: warehouse.addressResponse.ward,
      addressDetails: warehouse.addressResponse.addressDetails,
    };
    setChooseWarehouse(warehouseDefault);
    setShowAddForm(true);
  };

  const staticAllWarehouse = async () => {
    setIsLoading(true); // Bắt đầu tải
    try {
      const response = await orderService.staticByWarehouse([]);
      response.forEach((warehouse) => {
        warehouse.countStatus = countStatus(warehouse.orderLines, warehouse.warehouse || []);
      });
      setListWarehouse(response);
    } catch (error) {
      console.error("Lỗi khi tải danh sách kho:", error);
    } finally {
      setIsLoading(false); // Hoàn tất tải
    }
  };

  useEffect(() => {
    staticAllWarehouse();
  }, []);

  useEffect(() => {
    if (!showAddForm) {
      setIsLoading(true)
      staticAllWarehouse(); // Load lại danh sách kho khi form đóng
    }
  }, [showAddForm]);
  const deleteHandle=async (id)=>{
    const response = await warehouseService.deleteById(id);
    if(response.status == 200){
      setAlert({message:response.data,type:"success"})
      staticAllWarehouse()
    }else{
      setAlert({message:"Xóa kho hàng không thành công",type:"success"})
    }
  }
  return (
    <div style={{ width: "100%" }}>
      {alert && (
        <AlertNotification
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)} // Đóng thông báo
        />
      )}
      {showAddForm && (
        <AddWarehouse
          addressDefault={chooseWarehouse == null ? formDataAdd : chooseWarehouse}
          setShowFormAdd={setShowAddForm}
          refreshWarehouseList={staticAllWarehouse}
          setAlert={setAlert}
        />
      )}
      <div className="spp-main-content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 className="spp-title">Quản lý kho hàng</h1>
        </div>
        <div className="spp-actions">
          <button onClick={() => {setShowAddForm(true);setChooseWarehouse(null)}}>+ Thêm kho hàng mới</button>
        </div>
        {isLoading ? ( // Hiển thị loading khi đang tải
          <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
        ) : (
          <table className="spp-order-table">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Thông tin kho hàng</th>
                <th style={{ width: "7.5%" }}>Số đơn đang xử lý</th>
                <th style={{ width: "7.5%" }}>Số đơn chờ lấy hàng</th>
                <th style={{ width: "7.5%" }}>Số đơn đã lấy hàng</th>
                <th style={{ width: "7.5%" }}>Số đơn đang vc tới kho đích</th>
                <th style={{ width: "7.5%" }}>Số đơn đang ở kho đích</th>
                <th style={{ width: "7.5%" }}>Số đơn đang vc tới người nhận</th>
                <th style={{ width: "7.5%" }}>Số đơn đã hoàn thành</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {listWarehouse.length > 0 &&
                listWarehouse.map((warehouse, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        {warehouse?.warehouse?.warehouseName} - {warehouse?.warehouse?.addressResponse?.phoneNumberUser}
                      </div>
                      <div>
                        {`${warehouse?.warehouse?.addressResponse?.addressDetails},${warehouse?.warehouse?.addressResponse?.ward},${warehouse?.warehouse?.addressResponse?.district},${warehouse?.warehouse?.addressResponse?.city}`}
                      </div>
                    </td>
                    <td>{warehouse?.countStatus[2]}</td>
                    <td>{warehouse?.countStatus[3]}</td>
                    <td>{warehouse?.countStatus[4]}</td>
                    <td>{warehouse?.countStatus[5]}</td>
                    <td>{warehouse?.countStatus[6]}</td>
                    <td>{warehouse?.countStatus[7]}</td>
                    <td>{warehouse?.countStatus[8]}</td>
                    <td>
                      <button style={{ marginRight: 10 }} onClick={() => handleUpdate(warehouse?.warehouse)}>
                        Sửa thông tin
                      </button>
                      <button onClick={()=>deleteHandle(warehouse?.warehouse?.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageWarehouse;
