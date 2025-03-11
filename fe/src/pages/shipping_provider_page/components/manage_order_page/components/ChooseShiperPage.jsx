import { useEffect, useState } from "react";
import shipperService from "../../../../../services/shipper.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose, faX } from "@fortawesome/free-solid-svg-icons";
import orderlineService from "../../../../../services/orderline.service";
import "./ChooseShipperPage.css"
function ChooseShipperPage({orderline,status,after}){
    const [listShipper,setListShipper] = useState([])
    const [chooseShipper, setChooseShipper] = useState(null);
    const [showError,setShowError] = useState(false);
    const getShipperByWarehouse= async ()=>{
        const response = await shipperService.findByWarehouse(status == "Đang xử lý" ? orderline?.idPickupWarehouse : orderline?.idDeliveryWarehouse);
        setListShipper(response)
    }
    useEffect(()=>{
        getShipperByWarehouse()
        console.log(orderline)
        
    },[])
    const confirmShipper = async () => {
        if (chooseShipper != null) {
            const body = {
                "id": orderline?.id,
                [status === "Đang xử lý" ? "idPickupShipper" : "idDeliveryShipper"]: chooseShipper,
                "status": status === "Đang xử lý" ? "Đang lấy hàng" : "Đang vận chuyển tới người nhận",
                
            };
            console.log(body);
            const response = await orderlineService.updateOrderLine(body);
            console.log(response);
            after();
        } else {
            setShowError(true);
        }
    }
    
    
    return(
        <div className="csp-layout">
            <div className="csp-container">
                <FontAwesomeIcon icon={faClose} style={{position:"absolute",right:"5%", color:"red",fontSize:20,cursor:"pointer"}} onClick={()=>after()}/>
                <h1 className="csp-title">Chọn shipper lấy hàng</h1>
                <div className="csp-content">
                    <div className="csp-item">
                        <div className="csp-options">
                            {listShipper.map((item, index) => (
                                <div style={{borderBottom:index<listShipper.length -1 ?"1px solid rgba(0,0,0,0.5)":"none",marginBottom:10,padding:10, display:"flex",backgroundColor:chooseShipper ==  item?.id?"white":"rgba(0,0,0,0.2)"}}
                                   onClick={()=>{setChooseShipper(item?.id)}}
                                >
                                    <div key={index} style={{display:"flex",flexDirection:"column",alignItems:"flex-start",width:"95%"}}>
                                        <h3>{`${item.name} - ${item.code}`}</h3>
                                        <div className="csp-address">{`Số điện thoại: ${item.phoneNumber}`}</div>
                                        <div style={{textAlign:"start"}}>{`Lưu ý: ${item.note} `}</div>
                                        <div>{`Số đơn đang xử lý: ${item.pickingUpOrdersCount + item.shippingOrdersCount}`}</div>
                                    </div>
                                    { chooseShipper ==  item?.id &&<div style={{margin:"auto"}}><FontAwesomeIcon icon={faCheck} style={{color:"#ff5722"}}/></div>}
                                </div>
                            ))}
                        </div>
                        
                    </div>
                </div>
                {showError && <div className="csp-error" >Vui lòng chọn đủ Kho lấy hàng và Kho giao hàng</div>}
                <button className="csp-btn" onClick={()=>confirmShipper()}>Xác nhận</button>
            </div>
            
        </div>
    )
}

export default ChooseShipperPage;