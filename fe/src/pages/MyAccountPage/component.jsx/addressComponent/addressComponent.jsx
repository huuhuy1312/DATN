import React, { useEffect, useState } from "react";
import "./addressComponent.css";
import addressService from "../../../../services/address.service";
import AddAddressComponent from "../../../components/AddAddressComponent";
const addressNoData={
  id:null,
  nameUser: '',
  phoneNumberUser: '',
  city: null,
  district: null,
  ward: null,
  addressDetails: ''
};
function AddressComponent() {
  const [addresses, setAddresses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [addressDefault,setAddressDefault] = useState(null);

  const [showAddAddressComponent,setShowAddAddressComponent] = useState(false);
  const setDefaultAddress = async (id) => {
    const body = {
      id: id,
      isDefault : true,
      customerId:user?.id
    }
    console.log(body)
    const response = await addressService.addAddress(body);
    getAddressByCustomerId()
  };
  useEffect(()=>{
    getAddressByCustomerId()
  },[showAddAddressComponent])
  const getAddressByCustomerId= async ()=>{
    const response = await addressService.getByCustomerId(user?.id);
    console.log(response)
    setAddresses(response)
  }

  const removeAddress = (id) => {
    setAddresses((prevAddresses) => prevAddresses.filter((addr) => addr.id !== id));
  };
  useEffect(()=>{
    getAddressByCustomerId()
  },[])
  return (
    <div className="address-form">
        {showAddAddressComponent && <AddAddressComponent addressDefault={addressDefault}setAddAddressVisible={setShowAddAddressComponent}/>}
        <div className="address-form-header">
            <h3 style={{fontWeight:400,fontSize:16}}>Địa chỉ của tôi</h3>
            <button className="add-btn" onClick={()=>{setAddressDefault(addressNoData);setShowAddAddressComponent(true)}}>+ Thêm địa chỉ mới</button>
        </div>


      <div className="address-list">
        <div>Địa Chỉ</div>
        {addresses.map((address) => (
          <div className="address-item-profile" key={address.id}>
            <div className="address-info-profile col-md-9">
              <div className="name-phone">
                <div style={{fontSize:14, fontWeight:400}}>{address.nameUser}</div> 
                <div style={{borderLeft: "1px solid rgba(0, 0, 0, 0.5)",paddingLeft:10,marginLeft:10,color:"rgba(0,0,0,0.3)",fontWeight:400, fontSize:12,alignItems:"center"}}>
                    {address.phoneNumberUser}
                </div>
              </div>
              <div style={{color:"rgba(0,0,0,0.4)",fontSize:12}}>{address?.addressDetails}</div>
              <div style={{color:"rgba(0,0,0,0.4)",fontSize:12}}>{`${address?.ward}, ${address.district}, ${address?.city}`}</div>
              {address.isDefault && <span className="default-label">Mặc định</span>}
            </div>
            <div className="address-actions col-md-3">
              <div className="address-actions-1">
                <div className="action-btn" onClick={()=>{setAddressDefault(address);setShowAddAddressComponent(true);}}>Cập nhật</div>
                <div className="action-btn" onClick={() => removeAddress(address.id)}>
                    Xóa
                </div>
              </div>
              {!address.isDefault && (
                <button className="set-default-btn" onClick={() => setDefaultAddress(address.id)}>
                  Thiết lập mặc định
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddressComponent;
