import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt,faCaretDown,faComments,faStore,faTicket } from '@fortawesome/free-solid-svg-icons';
import "../../css/homepage/bootstrap.min.css";
import "../../css/homepage/plugin.css";
import "../../css/homepage/bundle.css";
import "../../css/homepage/style.css";
import "../../css/homepage/responsive.css";
import "../../css/cart_details.css"
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import cartService from '../../services/cart.service';
import fileService from "../../services/file.service";
import axios from "axios";
import Footer from '../components/Footer';
import CartItemInBody from './component/cartItemInBody';
import ChooseVoucher from './component/choseVoucher';
import itemService from '../../services/item.service';
function ViewDetailsCartPage(){
    const [selectAll, setSelectAll] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const navigate = useNavigate();
    const [listItemInCart,setListItemInCart] = useState([]);  
    const[userInfo,setUserInfo] = useState(null);
    const [showChooseVoucher,setShowChooseVoucher] = useState(false);
    const [listStatusItem,setListStatusItem] = useState([]);
    const [optionsVisible, setOptionsVisible] = useState({}); 
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItem, setTotalItem] = useState(0);
    const [voucherShipping,setVoucherShipping] = useState(null);
    const [voucherDiscount,setVoucherDiscount] = useState(null);
    const [originalPrice,setOriginalPrice] = useState(0);
    useEffect(()=>{
      if(totalPrice<voucherShipping?.conditionAmount){
        setVoucherShipping(null)
      }

      if(totalPrice<voucherDiscount?.conditionAmount){
        setVoucherDiscount(null)
      }
  },[totalPrice])

    
    const handleChange = (outerIndex, value) => {
      setListStatusItem(prevState => 
        prevState.map((subArray, i) => 
          i === outerIndex
            ? subArray.includes(value)
              ? subArray.filter(v => v !== value)  // Remove the value if it exists
              : [...subArray, value]  // Add the value if it doesn't exist
            : subArray
        )
      );
    };
    
  
    const getCartDetails= async (customerId)=>{
      const response = await cartService.getByCustomerID(customerId);
      console.log(response)
      setCartItems(response);
    }
    const confirmOrder = () => {
      navigate("/user/confirm-order", {
        state: { selectedItemIds, voucherShippingTmp:voucherShipping, voucherDiscountTmp:voucherDiscount }
      });
    };
    //New
    const handleSelectAll = () => {
      const newSelectAll = !selectAll;
      setSelectAll(newSelectAll);
      const newSelectedItemIds = newSelectAll ? cartItems.map(item => item.id) : [];
      setCartItems(cartItems.map((item) => ({
        ...item,
        selected: newSelectAll,
      })));
      setSelectedItemIds(newSelectedItemIds);
    };
    useEffect(() => {
      const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
      setSelectAll(allSelected);
    }, [cartItems]);
    const groupedByShop = cartItems.reduce((result, item) => {
      const shopName = item.shopName;
      if (!result[shopName]) {
        result[shopName] = [];
      }
      result[shopName].push(item);
      return result;
    }, {});

    const handleSelectShopItems = (shopName) => {
      const allSelected = groupedByShop[shopName].every(item => item.selected);
      setCartItems(cartItems.map((item) => {
        if (item.shopName === shopName) {
          const newItem = { ...item, selected: !allSelected };
          if (!allSelected) {
            setSelectedItemIds(prev => [...prev, newItem.id]);
          } else {
            setSelectedItemIds(prev => prev.filter(itemId => itemId !== newItem.id));
          }
          return newItem;
        }
        return item;
      }));
    };

    const cancelSelections = (itemId) => {
      // Reset the temporary selection when canceled
      setTempSelections2(prev => ({
        ...prev,
        [itemId]: undefined, // Clear the temporary selection
      }));
      setTempSelections1(prev => ({
        ...prev,
        [itemId]: undefined, // Clear the temporary selection
      }));
    };
    const toggleOptionsVisibility = (id) => {
      setOptionsVisible(prev => ({ ...prev, [id]: !prev[id] }));
    };
    const [tempSelections2, setTempSelections2] = useState({});
    const [tempSelections1, setTempSelections1] = useState({});
    const handleSelectClassification2 = (itemId, classification) => {
      // Store the selection temporarily
      setTempSelections2(prev => ({
        ...prev,
        [itemId]: classification,
      }));
    };
    const handleSelectClassification1 = (itemId, classification) => {
      // Store the selection temporarily
      setTempSelections1(prev => ({
        ...prev,
        [itemId]: classification,
      }));
    };
    const confirmSelections = async (itemId, quantity) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/register");
        return; 
      }
      const updatedCartItems = await Promise.all(
        cartItems.map(async item => {
          if (item.id === itemId) {
            const response = await itemService.updateItem(
              item.id,
              item.productId,
              tempSelections1[itemId]==null?item?.label1:tempSelections1[itemId],
              tempSelections2[itemId]==null?item?.label2:tempSelections2[itemId],
              user.id,
              quantity
            );
            console.log(response);
            if(response.status == 200)
            {
              const user = JSON.parse(localStorage.getItem("user"));
              getCartDetails(user?.id)
            }
            return {
              ...item,
              ...response, 
            };
          }
          return item;
        })
      );
      setCartItems(updatedCartItems);
      setTempSelections1(prev => ({
        ...prev,
        [itemId]: undefined,
      }));
      setTempSelections2(prev => ({
        ...prev,
        [itemId]: undefined,
      }));
    };
    const handleSelectItem = (id) => {
      setCartItems(cartItems.map((item) => {
        if (item.id === id) {
          const newItem = { ...item, selected: !item.selected };
          if (newItem.selected) {
            setSelectedItemIds([...selectedItemIds, newItem.id]);
          } else {
            setSelectedItemIds(selectedItemIds.filter(itemId => itemId !== newItem.id));
          }
          return newItem;
        }
        return item;
      }));
    };
    useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user)
      if(user){
          setUserInfo(user);
      }else{
          navigate("/register")
      }
      getCartDetails(user?.id);
    },[])

    const handleQuantityChange = async (id, quantity) => {
      // Tính toán lại số lượng mới trước khi thực hiện
      const updatedCartItems = await Promise.all(
        cartItems.map(async (item) => {
          if (item.id === id) {
            const maxQuantity = item?.maxQuantity;
            const newQuantity = Math.max(1, Math.min(quantity, maxQuantity)); // Giới hạn số lượng từ 1 đến maxQuantity
    
            // Gọi API confirmSelections
            const response = await confirmSelections(id, newQuantity);
            console.log(response);
    
            // Cập nhật lại item với số lượng mới và dữ liệu từ API
            return { ...item, quantity: newQuantity, ...response };
          }
          return item;
        })
      );
    
      // Cập nhật lại state sau khi hoàn thành tất cả các thao tác
      setCartItems(updatedCartItems);
    };
    
    function formatPriceToVND(price) {
      return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
      }).format(price);
  }
    useEffect(() => {
      const total = cartItems
        .filter(item => item.selected) // Filter selected items
        .reduce((sum, item) => sum + item.price * item.quantity, 0); 
        const total2 = cartItems
        .filter(item => item.selected) // Filter selected items
        .reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);// Calculate total
      const totalItem = cartItems
        .filter(item => item.selected) // Filter selected items
        .reduce((sum, item) => sum + 1, 0); // Calculate total
      setTotalPrice(total); 
      setOriginalPrice(total2)
      setTotalItem(totalItem)// Update total price
    }, [cartItems]);
    function formatPriceToVND(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }
    const CartItem = ({ value,indexParent }) => {
      const [checkedItems, setCheckedItems] = useState([]);
      const handleCheckedChange = (itemId, isChecked) => {
        setCheckedItems((prev) => {
          if (isChecked) {
            return [...prev, itemId]; // Thêm item vào danh sách
          } else {
            return prev.filter((id) => id !== itemId); // Loại bỏ item khỏi danh sách
          }
        });
      };
        return (
          <div style={{ backgroundColor: 'white', marginTop: '20px' }}>
            <div className="header">
              <div className="checkbox">
                <input
                  type="checkbox"
                  
                />
              </div>
              <FontAwesomeIcon style={{ color: 'gray',marginRight:"5px",fontSize:18}} icon={faStore} />
              <div style={{ paddingRight: '5px',fontSize:16,margin:"0px 8px" }}>{value?.shopName}</div>
              {/* <FontAwesomeIcon style={{ color: '#3498dbcc' }} icon={faCommentAlt} /> */}
              <FontAwesomeIcon style={{ color: '#3498dbcc',fontSize:16}} icon={faComments} />
            </div>
            <div className="cart_item_body">
              {value.items.map((item,index) => {  
                return(
                  <CartItemInBody 
                    item={item}  
                    indexParent={indexParent} 
                    handleChange={handleChange} 
                    onCheckedChange={handleCheckedChange}
                    />
                )
              })}
            </div>
            <div>Items checked: {checkedItems.join(', ')}</div>
          </div>
        );
      };
    return(
        <div>
          {showChooseVoucher&&<ChooseVoucher totalPrice = {totalPrice} setShowChooseVoucher={setShowChooseVoucher} setVoucherDiscount={setVoucherDiscount} setVoucherShipping={setVoucherShipping} voucherDiscount={voucherDiscount} voucherShipping={voucherShipping}/>}
          <div style={{backgroundColor: "#f5f5f5"}}>
            
            <Header userInfo={userInfo} cartData={cartItems}/>
              <div className='cart_details'>
                  <div className='header' >
                      <div className='checkbox'>        
                        <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                      </div>
                      <div className='product_infos'>Sản Phẩm</div>
                      <div className='price '>Đơn Giá</div>
                      <div className='quantity '>Số Lượng</div>
                      <div className='total '>Số Tiền</div>
                      <div className='action '>Thao Tác</div>
                  </div>
                  <div className='body '>
                    {
                        cartItems && cartItems.length > 0 ? (
                            Object.keys(groupedByShop).map((shopName)=>(
                              <div style={{ backgroundColor: 'white', marginTop: '20px' }}>
                                <div className="header">
                                  <div className="checkbox">
                                    <input
                                      type="checkbox"
                                      onChange={() => handleSelectShopItems(shopName)}
                                      checked={groupedByShop[shopName].every(item => item.selected)}
                                    />
                                  </div>
                                  <FontAwesomeIcon style={{ color: 'gray',marginRight:"5px",fontSize:18}} icon={faStore} />
                                  <div style={{ paddingRight: '5px',fontSize:16,margin:"0px 8px" }}>{shopName}</div>
                                  {/* <FontAwesomeIcon style={{ color: '#3498dbcc' }} icon={faCommentAlt} /> */}
                                  <FontAwesomeIcon style={{ color: '#3498dbcc',fontSize:16}} icon={faComments} />
                                </div>
                                <div className="cart_item_body">
                                  
                                  {groupedByShop[shopName].map((item)=>(
                    
                                        <div className="cart_details_item" key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                                          <div className="checkbox">
                                            <input
                                              type="checkbox"
                                              checked={item.selected || false}
                                              onChange={() => handleSelectItem(item.id)}
                                            />
                                          </div>
                                          <div className="product_infos" style={{ alignItems: 'center', justifyContent: "space-around" }}>
                                            <div>
                                              <img style={{ width: '12rem', paddingRight: '1rem' }}  src={item?.image} />
                                            </div>
                                            <div style={{ width: '40%', marginRight: '1rem' }}>
                                              <div style={{ fontSize: "16px" }}>{item.productName}</div>
                                            </div>
                                            <div>
                                              <div style={{ position: 'relative', cursor: "pointer", fontSize: "16px", color: "#21252961" }} >
                                                Phân Loại Hàng <FontAwesomeIcon icon={faCaretDown} onClick={() =>{ toggleOptionsVisibility(item.id);cancelSelections(item.id)}}/>
                                                {optionsVisible[item.id] && (
                                                  <div className="classification-option">
                                                    {item?.listClassifications1 && item.listClassifications1.length > 0 && (
                                                      <div className="classification1" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                        <div style={{ color: "rgba(0,0,0,.54)", fontSize: 16, alignSelf: "center" }}>Phân loại 1:</div>
                                                        {item.listClassifications1.map((it, idx) => (
                                                          <div
                                                          className={it === (tempSelections1[item.id] || item.label1) ? "classification classification_choose" : "classification"}
                                                            onClick={() => handleSelectClassification1(item.id, it)}
                                                            key={idx}
                                                          >
                                                            {it}
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                    
                                                    {item?.listClassifications2 && item.listClassifications2.length > 0 && (
                                                      <div className="classification2" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                        <div style={{ color: "rgba(0,0,0,.54)", fontSize: 16, alignSelf: "center" }}>Phân loại 2:</div>
                                                        {item.listClassifications2.map((it, idx) => (
                                                          <div
                                                          className={it === (tempSelections2[item.id] || item.label2) ? "classification classification_choose" : "classification"}
                                                            onClick={() => handleSelectClassification2(item.id, it)}
                                                            key={idx}
                                                          >
                                                            {it}
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: 15 }}>
                                                      <button style={{ border: "none", padding: "5px 20px" }} onClick={() => {toggleOptionsVisibility(item.id);cancelSelections(item.id)}}>TRỞ LẠI</button>
                                                      <button style={{ border: "none", backgroundColor: "#3498db", color: "white", padding: "5px 20px" }} onClick={() => {confirmSelections(item.id,item.quantity);toggleOptionsVisibility(item.id);}}>XÁC NHẬN</button>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div style={{ fontSize: "16px", color: "#21252961" }}>
                                                {item?.label1}{item?.label2 ? `, ${item?.label2}` : ''}
                                              </div>
                                    
                                            </div>
                                          </div>
                                    
                                          <div className="price" style={{display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
                                            <div style={{color:"#3498db",fontWeight:"500",paddingRight:5}}>{formatPriceToVND(item?.price)}</div>
                                            <div style={{color: "#21252961",textDecoration:"line-through",fontSize:12}}>{formatPriceToVND(item?.originalPrice)}</div>
                                          </div>
                                          <div className='quantity'>
                                            <input
                                              type="number"
                                              value={item.quantity}
                                              max={item}
                                              onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                              min="1"
                                              style={{ width: "50px", marginLeft: "10px",backgroundColor:"white",border:"none" }}
                                            />
                                          </div>
                                          <div className="total">{formatPriceToVND(item?.quantity * item?.price)}</div>
                                          <div className="action">Xóa</div>
                                        </div>
                                  ))}
                                </div>
                                
                              </div>
                            )
                          )
                        ) : (
                            <p>No items in the cart</p>
                        )
                    }
                    <div className='total_price-bar' style={{backgroundColor:"white",marginTop:20}}>
                      <div className='total_price-bar-part1'>
                        <div className='col-md-3' style={{display:"flex",alignItems:"center"}}><FontAwesomeIcon icon={faTicket} style={{fontWeight:200,color:"#3498dbcc",fontSize:"20px",paddingRight:6}}/> Hyyang Voucher</div>
                        <div className='choose-vouchers col-md-4' style={{display:"flex"}}>
                          {voucherShipping&&<div style={{border:"1px dashed gray",padding:"3px",fontSize:14}}>Miễn phí vận chuyển</div>}
                          {voucherDiscount&&<div style={{border:"1px dashed gray",padding:"3px",fontSize:14}}>Mã giảm {formatPriceToVND(voucherDiscount?.reduceMaxAmount)}</div>}
                        </div>
                        <a className="btn-show-voucher"style={{fontSize:14,textDecoration:"underline",display:"flex",alignItems:"center"}} onClick={(e)=>{e.preventDefault();setShowChooseVoucher(true)}}>Chọn hoặc nhập mã</a>
                      </div>
                      
                      <div className='total_price-bar-part3'>
                        <div className='checkbox'>
                          <input type="checkbox" checked={selectAll} onChange={handleSelectAll}/>
                        </div>
                        <div style={{width:"10%"}}>{`Chọn tất cả (${cartItems.length})`}</div>
                        <div style={{width:"5%"}}>Xóa</div>
                        <div style={{width:"20%"}}>Bỏ sản phẩm không hoạt động</div>
                        <div style={{width:"15%"}}>Lưu vào thư mục Đã thích</div>
                        <div className="payment-container">
                          <div>{`Tổng thanh toán (${totalItem} Sản phẩm): `}</div>
                          <div style={{color:"#3498db",fontWeight:"500",paddingLeft:5,fontSize:18}}>
                            {formatPriceToVND(totalPrice)}
                          </div>
                          <div className="details-price">
                            <div className="header-details-price">Chi tiết khuyến mãi</div>
                            <div className="body-details-price">
                              <div className="item-details-price">
                                <div>Tổng tiền hàng</div>
                                <div>{formatPriceToVND(originalPrice)}</div>
                              </div>
                              <div className="item-details-price">
                                <div>Giảm giá sản phẩm</div>
                                <div>{formatPriceToVND(originalPrice - totalPrice)}</div>
                              </div>
                              <div className="item-details-price">
                                <div>Tổng số tiền</div>
                                <div>{formatPriceToVND(totalPrice)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{width:"20%"}}>
                          <button onClick={()=>{confirmOrder()}}style={{width:"90%",height:35,backgroundColor:"#3498dbcc",border:"none",color:"white"}}>Mua hàng</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
              </div>
              <Footer/>

          </div>
        </div>
    );
}
export default ViewDetailsCartPage;