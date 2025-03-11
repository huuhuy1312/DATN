import { useEffect, useState } from "react";
import "./ChooseWarehouse.css";
import addressService from "../../../services/address.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import orderlineService from "../../../services/orderline.service";
function ChooseWarehouse({orderline,after}){
    const [listOptionPickupWarehouse,setListOptionPickupWarehouse] = useState([]); 
    const [listOptionDeliveryWarehouse,setListOptionDeliveryWarehouse] = useState([]);
    const [choosePickupWarehouse, setChoosePickupWarehouse] = useState(orderline?.idPickupWarehouse);
    const [chooseDeliveryWarehouse, setChooseDeliveryWarehouse] = useState(orderline?.idDeliveryWarehouse);
    const [showError,setShowError] = useState(false);
    const getAddressNearPickupWarehouse =async ()=>{
        const response = await addressService.findAddressNearAddress(orderline.addressSeller.id);
        console.log(response.content);
        setListOptionPickupWarehouse(response.content)
    } 
    const getAddressNearDeliveryWarehouse =async ()=>{
        const response = await addressService.findAddressNearAddress(orderline.addressCustomer.id);
        console.log(response.content);
        setListOptionDeliveryWarehouse(response.content)
    } 
    useEffect(()=>{
        console.log(orderline)
        getAddressNearPickupWarehouse();
        getAddressNearDeliveryWarehouse();
    },[])
    const confirmWarehouse=async ()=>{
        if(chooseDeliveryWarehouse!=null && choosePickupWarehouse !=null)
        {
            const body={
                "id":orderline?.id,
                "idPickupWarehouse":choosePickupWarehouse,
                "idDeliveryWarehouse":chooseDeliveryWarehouse,
                "status":"Đang xử lý"
            }
            console.log(body)
            const response = await orderlineService.updateOrderLine(body);
            console.log(response)
        }else{
            setShowError(true)
        }
        after()

    }
    return(
        <div className="cw-layout">
            <div className="cw-container">
                <h1 className="cw-title">Chọn kho xử lý vận chuyển</h1>
                <div className="cw-content">
                    <div className="cw-item" style={{borderRight:"1px solid rgba(0,0,0,0.5)"}}>
                        <h2>Chọn kho lấy hàng</h2>
                        <div className="cw-options">
                            {listOptionPickupWarehouse.map((item, index) => (
                                    <div style={{borderBottom:index<listOptionPickupWarehouse.length -1 ?"1px solid rgba(0,0,0,0.5)":"none",marginBottom:10,padding:10, display:"flex",backgroundColor:choosePickupWarehouse ==  item?.id?"white":"rgba(0,0,0,0.2)"}}
                                        onClick={()=>{setChoosePickupWarehouse(item?.id)}}
                                    >
                                        <div key={index} style={{display:"flex",flexDirection:"column",alignItems:"flex-start",width:"95%"}}>
                                            <h3>{item.nameUser}</h3>
                                            <div className="cw-address">{`Địa chỉ: ${item.addressResponse.addressDetails}, ${item.addressResponse.ward}, ${item.addressResponse.district}, ${item.addressResponse.city}`}</div>
                                            <div>{`Khoảng cách: ${item.distance.toFixed(2)} km`}</div>
                                            <div>{`Số đơn đang xử lý: 3`}</div>
                                        </div>
                                        { choosePickupWarehouse ==  item?.id &&<div style={{margin:"auto"}}><FontAwesomeIcon icon={faCheck} style={{color:"#ff5722"}}/></div>}
                                    </div>
                            ))}
                        </div>
                        <div className="address-seller">
                            <h2>Địa chỉ lấy hàng</h2>
                            <div>
                                <div>{`${orderline.addressSeller.addressDetails}, ${orderline.addressSeller.ward}`}</div>
                                <div>{`${orderline.addressSeller.district}`}</div>
                                <div>{`${orderline.addressSeller.city}`}</div>
                            </div>
                        </div>
                    </div>
                    <div className="cw-item">
                        <h2>Chọn kho giao hàng</h2>
                        <div className="cw-options">
                            {listOptionDeliveryWarehouse.map((item, index) => (
                                <div style={{borderBottom:index<listOptionDeliveryWarehouse.length -1 ?"1px solid rgba(0,0,0,0.5)":"none",marginBottom:10,padding:10, display:"flex",backgroundColor:chooseDeliveryWarehouse ==  item?.id?"white":"rgba(0,0,0,0.2)"}}
                                    onClick={()=>{setChooseDeliveryWarehouse(item?.id)}}
                                >
                                    <div key={index} style={{display:"flex",flexDirection:"column",alignItems:"flex-start",width:"95%"}}>
                                        <h3>{item.nameUser}</h3>
                                        <div className="cw-address">{`Địa chỉ: ${item.addressResponse.addressDetails}, ${item.addressResponse.ward}, ${item.addressResponse.district}, ${item.addressResponse.city}`}</div>
                                        <div>{`Khoảng cách: ${item.distance.toFixed(2)} km`}</div>
                                        <div>{`Số đơn đang xử lý: 3`}</div>
                                    </div>
                                    { chooseDeliveryWarehouse ==  item?.id &&<div style={{margin:"auto"}}><FontAwesomeIcon icon={faCheck} style={{color:"#ff5722"}}/></div>}
                                </div>
                            ))}
                        </div>
                        <div className="address-seller">
                            <h2>Địa chỉ nhận hàng</h2>
                            <div>
                                <div>{`${orderline.addressCustomer.addressDetails}, ${orderline.addressCustomer.ward}`}</div>
                                <div>{`${orderline.addressCustomer.district}`}</div>
                                <div>{`${orderline.addressCustomer.city}`}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {showError && <div className="cw-error" >Vui lòng chọn đủ Kho lấy hàng và Kho giao hàng</div>}
                <button className="cw-btn" onClick={()=>confirmWarehouse()}>Xác nhận</button>
            </div>
            
        </div>
    )
}

export default ChooseWarehouse;