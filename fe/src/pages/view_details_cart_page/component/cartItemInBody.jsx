import React, {  useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import itemService from '../../../services/item.service';
const CartItemInBody = ({ item,onCheckedChange  }) => {
  const navigate = useNavigate();
  const [label1,setLabel1] = useState(item?.label?.split(", ")[0]);
  const [label2,setLabel2] = useState(item?.label?.split(", ")[1]);
  const [itemInfo,setItemInfo] = useState(item);
  const [openDropdownId, setOpenDropdownId] = useState(false);
  const [checked,setChecked] = useState(false);
  const [image,setImage] = useState(null)
  const readImage = async (fileName) => {
    try {
        const response = await axios.get(`http://localhost:8081/file/read-image/${fileName}`);
        setImage(response.data);
    } catch (error) {
        console.error(error);
    }
  }; 

  const SubmitHandle=async (quantity)=>{
    const user = JSON.parse(localStorage.getItem("user"));
      if(!user){
        navigate("/register")
      }
    const response = await itemService.updateItem(item?.id,item?.productId,label1,label2,user?.id,quantity,"CART");
    console.log(response);
    setItemInfo(response);
  } 
  useEffect(()=>{
    readImage(itemInfo?.image)
  },[itemInfo])
  function formatPriceToVND(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',   
      currency: 'VND',
    }).format(price);
  } 
  useEffect(()=>{
    console.log(label1)
  },[label1])
  const handleCheckedChange = (e) => {
    setChecked(e.target.checked);
    onCheckedChange(item.id, e.target.checked); // Truyền giá trị checked ra ngoài
  };
  return (
    <div className="cart_details_item" key={itemInfo.id} style={{ display: 'flex', alignItems: 'center' }}>
      <div className="checkbox">
        <input type="checkbox" checked={checked}onChange={handleCheckedChange} />
      </div>
      <div className="product_infos" style={{ alignItems: 'center', justifyContent: "space-around" }}>
        <div>
          <img style={{ width: '12rem', paddingRight: '1rem' }} src={image} alt={itemInfo.productName} />
        </div>
        <div style={{ width: '40%', marginRight: '1rem' }}>
          <div style={{ fontSize: "16px" }}>{itemInfo.productName}</div>
        </div>
        <div>
          <div style={{ position: 'relative', cursor: "pointer", fontSize: "16px", color: "#21252961" }} onClick={() => setOpenDropdownId(!openDropdownId)}>
            Phân Loại Hàng <FontAwesomeIcon icon={faCaretDown} />
            {openDropdownId && (
              <div className="classification-option">
                {itemInfo?.listClassifications1 && itemInfo.listClassifications1.length > 0 && (
                  <div className="classification1" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div style={{ color: "rgba(0,0,0,.54)", fontSize: 16, alignSelf: "center" }}>Phân loại 1:</div>
                    {itemInfo.listClassifications1.map((it, idx) => (
                      <div
                        className={it === label1 ? "classification classification_choose" : "classification"}
                        onClick={(e) => { setLabel1(it);e.stopPropagation(); }}
                        key={idx}
                      >
                        {it}
                      </div>
                    ))}
                  </div>
                )}

                {itemInfo?.listClassifications2 && itemInfo.listClassifications2.length > 0 && (
                  <div className="classification2" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div style={{ color: "rgba(0,0,0,.54)", fontSize: 16, alignSelf: "center" }}>Phân loại 2:</div>
                    {itemInfo.listClassifications2.map((it, idx) => (
                      <div
                        className={it === label2 ? "classification classification_choose" : "classification"}
                        onClick={(e) => { setLabel2(it);e.stopPropagation(); }}
                        key={idx}
                      >
                        {it}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: 15 }}>
                  <button style={{ border: "none", padding: "5px 20px" }} onClick={() => { setLabel1(item?.label?.split(", ")[0]);setLabel2(item?.label?.split(", ")[1]);setOpenDropdownId(false); }}>TRỞ LẠI</button>
                  <button style={{ border: "none", backgroundColor: "#3498db", color: "white", padding: "5px 20px" }} onClick={()=>SubmitHandle(item?.quantity)}>XÁC NHẬN</button>
                </div>
              </div>
            )}
          </div>
          <div style={{ fontSize: "16px", color: "#21252961" }}>
            {label1}{label2 ? `, ${label2}` : ''}
          </div>

        </div>
      </div>

      <div className="price">{formatPriceToVND(itemInfo?.price)}</div>
      <div className="quantity">{itemInfo?.quantity}</div>
      <div className="total">{formatPriceToVND(itemInfo?.quantity * itemInfo?.price)}</div>
      <div className="action">Xóa</div>
    </div>
  );
};

export default CartItemInBody;
