import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./choose_shipping_methods.css"
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
function ChooseShippingMethods({listShippingMethods,chooseShipping,shop,change}){
  function formatPriceToVND(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
  }
  useEffect(()=>{
    console.log(listShippingMethods)
  },[])
  return(
    <div style={{ width: "100%", height: "100%", backgroundColor: "#0006", position: "fixed", zIndex: 1, display: "flex" }}>
      <div className="choose-ship-methods-container">
        <div className="choose-ship-methods-header">
          <div style={{fontSize:16}}>Chọn đơn vị vận chuyển</div>
          <div>
            <div style={{fontSize:12,color:"rgba(0,0,0,0.6)"}}>KÊNH VẬN CHUYỂN LIÊN KẾT VỚI HYYANG</div>
            <div style={{fontSize:10,color:"rgba(0,0,0,0.6)"}}>Bạn có thể theo dõi đơn hàng trên ứng dụng Hyyang khi chọn một trong các đơn vị vận chuyển:</div>
          </div>
        </div>
        <div className="choose-ship-methods-body">
          <div className="choose-ship-methods-list">
            {listShippingMethods.map((item)=>{
              return(
                <div className={chooseShipping.id == item.id ?"choose-ship-methods-item choose-item":"choose-ship-methods-item"} onClick={()=>change(1,item?.id)}>
                  <div>
                    <div className="item-header">
                      <div style={{fontSize:14, marginRight:20}}>{item?.name}</div>
                      <div>{formatPriceToVND(shop?.totalWeight)}</div>
                    </div>
                    <div className="item-description">
                      <div style={{fontSize:12,color:"rgba(0,0,0,0.6)"}}>Đảm bảo nhận hàng từ 13 Tháng 10 - 14 Tháng 10</div>
                      <div style={{fontSize:10,color:"rgba(0,0,0,0.6)"}}>{`Nhận Voucher trị giá ${formatPriceToVND(15000)} nếu đơn hàng được giao đến sau ngày 14 Tháng 10 2024`}</div>
                    </div>
                  </div>
                  <div style={{width:"20%",display:"flex",justifyContent:"flex-end"}}><FontAwesomeIcon icon={faCheck}/></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ChooseShippingMethods;