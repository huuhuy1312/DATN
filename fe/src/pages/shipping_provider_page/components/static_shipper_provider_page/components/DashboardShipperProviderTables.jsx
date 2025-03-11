import React, { useEffect, useState } from 'react';
import sellerService from '../../../../../services/seller.service';
import { useNavigate } from "react-router-dom";
const DashboardShipperProviderTables = ({ listOrder, listCustomer }) => {
  console.log(listOrder)
  console.log(listCustomer)
  function formatPriceToVND(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  const [listRegisterToSeller,setListRegisterToSeller] = useState([]);
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/details-request-to-seller/${id}`); // Chuyển hướng đến URL chi tiết với ID
  };
  const findAllSeller = async () =>
  {
    const body = {
      isActive : false
    }
    const response = await sellerService.search(body);
    console.log(response)
    setListRegisterToSeller(response);
  }
  useEffect(()=>{
    findAllSeller()
  },[])
  return (
    <section className="scp-tables">
      <div className="scp-table-container">
        <h3>Yêu cầu đăng ký trở thành người bán</h3>
        <div className="scp-table-responsive">
          <table>
            <thead>
              <tr>
                <th>Tên gian hàng</th>
                <th>Tên người bán</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {listRegisterToSeller&&listRegisterToSeller.map((item, index) => (
                <tr key={index}>
                  <td>{item.shopName}</td>
                  <td>{item?.fullName}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber}</td>
                  <td>
                    <button className="scp-status scp-status-info" onClick={()=>handleViewDetails(item.id)}>
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="scp-table-container">
        <h3>Khách hàng mới</h3>
        <div className="scp-table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên khách hàng</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              {listCustomer&&listCustomer.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.id}</td>
                  <td>{customer.nameUser}</td>
                  <td>{customer.phoneNumberUser}</td>
                  <td>{`${customer.addressDetails}, ${customer.ward}, ${customer.district}, ${customer.city}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DashboardShipperProviderTables;
