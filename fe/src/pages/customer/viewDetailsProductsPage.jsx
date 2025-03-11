import React, { useState, useEffect } from 'react';
import "../../css/homepage/bootstrap.min.css";
import "../../css/homepage/plugin.css";
import "../../css/homepage/bundle.css";
import "../../css/homepage/style.css";
import "../../css/homepage/responsive.css";
import "../../css/homepage/viewDetailsProduct.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faAngleRight, faSearch, faAngleDown, faShoppingCart, faTimesCircle, faSearchPlus, faBagShopping, faShop, faMessage } from '@fortawesome/free-solid-svg-icons';
import cartService from "../../services/cart.service"
import { useLocation, useNavigate } from 'react-router-dom';
import productService from '../../services/product.service';
import itemService from '../../services/item.service';
import ratesService from '../../services/rates.service';
import axios from "axios";
import Header from '../components/Header';
import "./viewDetailsProductsPage.css"
function ViewDetailsProductPage({setSelectedPartnerChatBox,setShowChatBox}) {
    
    const user = JSON.parse(localStorage.getItem("user"));
    //Header Start
    const [rateStar, setRateStar] = useState(0);
    const [quantityBuy, setQuantityBuy] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const [cartData, setCartData] = useState(null);
    const [product, setProduct] = useState(null);
    const [label1Choosen,setLabel1Choosen]= useState(null);
    const [label2Choosen,setLabel2Choosen]= useState(null);
    const [imageShow,setImageShow] = useState(null);
    const [TOPChoose, setTOPChoose] = useState(null);
    const [descriptionContent,setDescriptionContent] = useState("");
    const [userInfo,setUserInfo] = useState(null);
    const [rateInfo,setRateInfo] = useState([])
    const [suggests,setSuggests]= useState([]);
    const [rateStarShow,setRateStarShow] = useState(null)
    const getRateByProductId = async ()=>{
        const response =await ratesService.getByProductId(product?.id);
        console.log(response)
        setRateInfo(response)
    }
    const handleQuantityChange = (e) => {
        const newValue = parseInt(e.target.value); 
        const maxValue = TOPChoose == null ? product?.totalQuantity : TOPChoose?.quantity; 
        if (newValue >= 1 && newValue <= maxValue) {
          setQuantityBuy(newValue); 
        } else {
          setQuantityBuy(quantityBuy); 
        }
      };
      
    useEffect(()=>{
        if(product!==null){
            getRateByProductId();
        }
    },[product])
    const getCartData = () => {
        cartService.getByCustomerID(user?.id)
            .then(data => {
                console.log(data)
                setCartData(data);
            })
            .catch(error => {
                console.error(error);
            })
    }
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user)
        if(user){
            setUserInfo(user);
        }else{
            navigate("/register")
        }
        getCartData()
    },[])

    const staticRate =(product_id)=>{
        ratesService.staticRateByPid(product_id)
        .then(response=>{
            console.log(response)
            setRateInfo(response)
        }).catch(error => {
            console.error(error);
        })
    }
   
    const getProductByID = async (productId) => {
        const response = await productService.getProductById(productId);

            // Tính maxPrice và minPrice cho typeOfProducts của từng sản phẩm
            const maxPrice = Math.max(...response.typeOfProducts.map(item => item.price));
            const minPrice = Math.min(...response.typeOfProducts.map(item => item.price));
            
            // Tính tổng revenue cho typeOfProducts của từng sản phẩm
            const totalRevenue = response.typeOfProducts.reduce((sum, item) => sum + item.revenue, 0);
            const totalQuantity = response.typeOfProducts.reduce((sum, item) => sum + item.quantity- item.soldQuantity, 0);
            // Gán các giá trị đã tính toán vào đối tượng sản phẩm
            response.maxPrice = maxPrice;
            response.minPrice = minPrice;
            response.totalRevenue = totalRevenue;
            response.totalQuantity = totalQuantity;
            response.soldQuanity = response.typeOfProducts.reduce((sum, item) => sum +  item.soldQuantity, 0);
        
        console.log(response)
        setProduct(response)    
        setImageShow(response?.imageProducts[0])
    }
    useEffect(()=>{
        console.log(label1Choosen)
    },[label1Choosen])
    
    useEffect(() => {
        const fetchAllData = async()=>{
            const searchParams = new URLSearchParams(location.search);
            const keyword = searchParams.get('productId');
            //Get Cart
            await getProductByID(keyword);

            const suggestionResponse = await productService.getSuggestProduct(keyword);

            setSuggests(suggestionResponse)
        }
        
        fetchAllData()
        // staticRate(keyword)
    }, []);
  
    const [showMiniCart, setShowMiniCart] = useState(false);
    const toogleMiniCart = () => {
        setShowMiniCart(!showMiniCart);
    }
    const [searchName, setSearchName] = useState(null);
    const updateSearchName = (e) => {
        setSearchName(e.target.value);
    }
    const handleClickSearchName = (e) => {
        e.preventDefault();
        navigate(`/search?keyword=${searchName}`)
        console.log(searchName);
    }
    //Header End

    //Ratings Start
    const MyComponent = ({ transparency }) => {
        const starStyle = {
            maskImage: `linear-gradient(270deg, transparent ${(1 - transparency) * 100}%, gray ${(1 - transparency) * 100}%)`,
        };

        return (
            <a>
                <FontAwesomeIcon  icon={faStar} style={{...starStyle,color:"#FFC400"}} />
            </a>
        );
    };
    //Ratings End

    function formatPriceToVND(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }

    const addToCart = () => {

        itemService.addItem(TOPChoose?.id,quantityBuy,user?.id)
        .then(
            response=>{
                console.log(response);
                getCartData();
            }
        ).catch(error=>{
            console.error(error);
        })
    }
    // const addRate = (productId, rateStar, rateReview, customerId) => {

    //     ratesService.addRate(productId, rateStar, rateReview, customerId)
    //         .then(
    //             response => {
    //                 console.log(response);
    //                 window.location.reload();
    //             }
    //         )
    // }
    const formatCount = (count) => {
        return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
    };
    const chooseLabel1 =(value)=>{
        setImageShow(value.image)

        setLabel1Choosen(value.label1)
    }
    const chooseLabel2 =(value)=>{
        setLabel2Choosen(value)
    }
    useEffect(()=>{
        if(label1Choosen!==null && label2Choosen!==null)
        {
            const topChoosen = product?.typeOfProducts.filter(item => item.label1 ==label1Choosen && item.label2 == label2Choosen);
            setTOPChoose(topChoosen[0]);
        }else if(label1Choosen!==null)
        {
            const topChoosen = product?.typeOfProducts.filter(item => item.label1 ==label1Choosen);
            setTOPChoose(topChoosen[0]);
        }
    },[label1Choosen,label2Choosen])
    useEffect(()=>{
        console.log(TOPChoose)
    },[TOPChoose])
    return (
        <div className='pos_page' style={{width:"100vw"}}>
            <Header userInfo ={userInfo} cartData={cartData} getCartData={getCartData}/>
            <div className='container-view-details-product' >
                <div className='pos_page_inner' style={{color:"black"}}>
                    
                    <div className="breadcrumbs_area">
                        <div className="row">
                            <div className="col-12">
                                <div className="breadcrumb_content">
                                    <ul>
                                        <li><a href="index.html">home</a></li>
                                        <li><FontAwesomeIcon icon={faAngleRight} /></li>
                                        <li>View Details</li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='product_details'>
                        <div className='row'>
                            <div className="col-lg-4 col-md-6">
                                <div className="product_tab fix">

                                    <div className="tab-content produc_tab_c" style={{ width: "100%" }}>
                                        <div className="tab-pane fade show active" id="p_tab1" role="tabpanel">
                                            <div className="modal_img" style={{height:"35rem",display:"flex"}}>
                                                <img  alt="" src={imageShow?.content} style={{ width: "100%",objectFit:"contain" }} />
                                                {/* <div className="img_icone">
                                                    <img src={"img/cart/span-new.png"} alt="" />
                                                </div>
                                                <div className="view_img">
                                                    <a className="large_view" href={product?.linkImage}><FontAwesomeIcon icon={faSearchPlus} /></a>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="p_tab2" role="tabpanel">
                                            <div className="modal_img">
                                                <a href="#"><img src={"img/product/product14.jpg"} alt="" /></a>
                                                <div className="img_icone">
                                                    <img src={"img/cart/span-new.png"} alt="" />
                                                </div>
                                                <div className="view_img">
                                                    <a className="large_view" href="assets\img\product\product14.jpg"><FontAwesomeIcon icon={faSearchPlus} /></a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="p_tab3" role="tabpanel">
                                            <div className="modal_img">
                                                <a href="#"><img src={"img/product/product15.jpg"} alt="" /></a>
                                                <div className="img_icone">
                                                    <img src={"img/cart/span-new.png"} alt="" />
                                                </div>
                                                <div className="view_img">
                                                    <a className="large_view" href="assets\img\product\product15.jpg"> <i className="fa fa-search-plus"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="product_tab_button">
                                        <ul className="nav" role="tablist">
                                            {product?.imageProducts.length > 1 ?
                                                (
                                                    <>
                                                        {product?.imageProducts.map((item) => {
                                                            return (
                                                                <li style={{height:"10rem",width:"10rem"}} onClick={()=>setImageShow(item)}>
                                                                    <img src={`${item.content}`} style={{height:"8rem",width:"8rem",objectFit:"contain"}} alt="" />
                                                                </li>
                                                            )
                                                        })
                                                        }
                                                    </>
                                                ) : (
                                                    <></>
                                                )
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-6">
                                <div className="product_d_right">
                                    <h1 style={{fontWeight:"400",fontSize:"20px"}}>{product?.name}</h1>
                                    <div className="product_ratting mb-10" style={{display:"flex", height:"28px",textAlign:"center"}}>
                                            <ul style={{paddingRight:"15px",display:"flex"}}>
                                                <div className="vdpp-star-rating">
                                                    <div className="vdpp-star-overlay" style={{ width: `${(rateInfo?.averageRate || 0) * 20}%` }}>
                                                        ★★★★★
                                                    </div>
                                                    <div className="vdpp-star-background">★★★★★</div>
                                                </div>
                                            </ul>
                                            <div style={{padding: "0px 15px", borderLeft: "1px solid gray", borderRight: "1px solid gray"}}>
                                                {product?.countRates} Đánh giá
                                            </div>
                                            <div style={{paddingLeft:"15px"}}>{product?.soldQuanity} Đã Bán</div>
                                        <div style={{marginLeft:"auto"}}>Tố cáo</div>
                                    </div>
                                    

                                    <div className="content_price mb-15" style={{backgroundColor:"#fafafa",height:"50px", alignContent:"center"}}>
                                        {
                                         TOPChoose==null 
                                        ?
                                        <span style={{paddingLeft:"20px",color:"#FF424E", fontWeight:"400"}}>
                                            {product?.minPrice=== product?.maxPrice ? (
                                                formatPriceToVND(product?.minPrice)
                                            ) : (
                                                `${formatPriceToVND(product?.minPrice)} - ${formatPriceToVND(product?.maxPrice)}`
                                            )}
                                        </span>
                                        :
                                        <div>
                                            <span style={{paddingLeft:"20px",color:"#FF424E", fontWeight:"400"}}>{formatPriceToVND(TOPChoose?.price)}</span>
                                            <span style={{ color: "#B0B0B0", fontWeight: "400", textDecoration: "line-through",fontSize:16 }}>
                                                {formatPriceToVND(TOPChoose?.originalPrice)}
                                            </span>
                                        </div>
                                        
                                        }
                                    </div>
                                    <div style={{display:"flex", marginBottom:20, fontSize:20}}>
                                        <div style={{width:"20%",fontSize:"17px",fontWeight:300}}>Chính Sách Trả Hàng</div>
                                        <div style={{width:"80%", display:"flex",flexWrap:"wrap",alignItems:"center"}}>
                                            <div style={{display:"flex",height:"20px",width:"100%"}}>
                                                <div style={{display:"flex",alignItems:"center",paddingRight:"20px"}}>
                                                    <img style={{width:"18px",height:"18px"}} src="icon/icon_back.png"></img>
                                                    <div style={{fontSize:"15px",paddingLeft:"8px"}}>Trả hàng 15 ngày</div>
                                                </div>
                                                <div style={{display:"flex",alignItems:"center"}}>
                                                    <div style={{fontSize:"15px",paddingRight:"8px"}}>Đổi ý miễn phí</div>
                                                    <img style={{width:"15px",height:"15px"}}src='icon/icon2.png'></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{display:"flex", marginBottom:20, fontSize:20}}>
                                        <div style={{width:"20%",fontSize:"17px",fontWeight:300}}>Vận Chuyển</div>
                                        <div style={{width:"80%", display:"flex",flexWrap:"wrap",alignItems:"center"}}>
                                           <div style={{display:"flex",width:"100%",alignItems:"center",paddingBottom:"5px"}}>
                                                <div style={{width:"10%"}}><img style={{width:"30px",height:"30px"}}src="icon/freeship.png"></img></div>
                                                <div style={{width:"90%",fontSize:"17px",fontWeight:400}}>Miễn phí vận chuyển</div>
                                           </div>
                                           <div style={{display:"flex",width:"100%"}}>
                                                <div style={{width:"10%"}}><img src='icon/xe_vc.png'></img></div>
                                                <div style={{width:"90%"}}>
                                                    <div style={{display:"flex",paddingBottom:"3px"}}>
                                                        <div style={{fontSize:"17px",fontWeight:300, width:"25%"}}>Vận chuyển tới</div>
                                                        <div style={{fontSize:"17px",fontWeight:400}}>Phường Thanh Xuân Nam, Quận Thanh Xuân</div>
                                                    </div>
                                                    <div style={{display:"flex"}}>
                                                        <div style={{fontSize:"17px",fontWeight:300, width:"25%"}}>Phí Vận Chuyển</div>
                                                        <div style={{fontSize:"17px",fontWeight:400}}>đ0 - đ13.500</div>
                                                    </div>
                                                </div>
                                                
                                           </div>
                                        </div>
                                    </div>
                                    { product?.title1 !=null &&
                                    <div style={{display:"flex", marginBottom:30, fontSize:20}}>
                                        <div style={{width:"20%",fontSize:"17px",fontWeight:300}}>{product?.title1}:</div>
                                        <div style={{width:"80%", display:"flex",flexWrap:"wrap"}}>
                                        {
                                            product?.imageClassifications.map((item,index)=>(
                                                <div onClick={()=>chooseLabel1(item)} style={{display:"flex",alignItems:"center",border:"1px solid #80808078",minWidth:150,height:50,marginRight:5,marginBottom:5, alignContent:"center", fontSize:16,backgroundColor:`${label1Choosen==item.label1?"#00bba6":"white"}`, color:`${label1Choosen==item?.label1?"white":"black"}`, cursor:"pointer"}}>
                                                    <div><img src={item?.image?.content} style={{width:"35px",margin:"0px 10px"}}></img></div>
                                                    <div style={{margin:"0px 5px",fontWeight:"300"}}>{item?.label1}</div>
                                                </div>
                                            ))
                                        }
                                        </div>
                                    </div>
                                    }
                                    {
                                    product?.title2 !=null &&
                                    <div style={{display:"flex",marginBottom:30, fontSize:20}}>
                                        <div style={{width:"20%",fontSize:"17px",fontWeight:300}}>{product?.title2}:</div>
                                        <div style={{width:"80%", display:"flex",flexWrap:"wrap"}}>
                                            {
                                                product?.listLabel2.map((item,index)=>(
                                                    <div onClick={()=>chooseLabel2(item,index)} style={{display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #80808078",minWidth:100,height:50,marginRight:5,marginBottom:5, alignContent:"center", fontSize:16,backgroundColor:`${label2Choosen==item?"#00bba6":"white"}`, color:`${label2Choosen==item?"white":"black"}`, cursor:"pointer"}}>
                                                        <div style={{fontWeight:"300"}}>{item}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    
                                    }
                                    {/* className="box_quantity mb-20" */}
                                    <div >
                                        <form style={{display:"flex",marginBottom:30}}>
                                            <label style={{fontSize:"17px",fontWeight:300,width:"20%"}}>Số lượng:</label>
                                            <div style={{width:"80%", display:"flex",alignItems:"center"}}>
                                                <input style={{border:"1px solid gray",width:150,height:35, textAlign:"center", fontSize:20,marginRight:20,backgroundColor:"white"}} min="1" max={TOPChoose == null ?product?.totalQuantity:TOPChoose?.quantity} value={quantityBuy} type="number" step={1} onChange={(e) => handleQuantityChange(e)} />
                                                <div style={{fontSize:15}}>{`${TOPChoose == null ?product?.totalQuantity:TOPChoose?.quantity} sản phẩm có sẵn`}</div>
                                            </div>
                                            
                                        </form>
                                        
                                    </div>
                                    <div style={{display:"flex", justifyContent:"space-between",width:"80%",margin:"30px auto",marginTop:30,padding:"0px 30px"}}>
                                        <button onClick={() => addToCart(product?.id)} style={{color:"#00bba6",height:"50px", backgroundColor:"rgb(4 231 205 / 10%)",border:"1px solid #00bba6",padding:"0px 5px", fontSize:18,fontWeight:400, width:"45%"}}><FontAwesomeIcon icon={faShoppingCart} style={{marginRight:5}}/> Thêm vào giỏ hàng</button>
                                        <button onClick={() => addToCart(product?.id)} style={{backgroundColor:"#00bba6",height:50, color:"white",padding:"0px 5px",border:"1px solid #00bba6", fontSize:18, width:"35%",fontWeight:400}}><FontAwesomeIcon icon={faBagShopping} style={{marginRight:5}}/>Mua Ngay</button>
                                    </div>
                                    
                                    {/* <div className="wishlist-share">
                                        <h4>Share on:</h4>
                                        <ul>
                                            <li><a href="#"><FontAwesomeIcon icon={faRss} /></a></li>
                                        </ul>
                                    </div> */}

                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                   
            </div>
            <div className='container-view-details-product'style={{display:"flex",minHeight:"100px",backgroundColor:"white",marginTop:20,padding:20}}>
                <div style={{display:"flex", alignItems:"center",paddingRight:30, borderRight:"1px solid #d6d3d3"}}>
                    <div >
                        <img src={product?.seller?.avatar} style={{width:75,height:75,marginRight:10}}></img>
                    </div>
                    <div>
                        <div style={{color:"black",fontSize:18,fontWeight:300}}>{product?.seller?.shopName}</div>
                        <div style={{color:"rgb(170 170 170)"}} >Online 20 Phút Trước</div>
                        <div style={{marginTop:10}}>
                            <button style={{backgroundColor:"rgba(0, 187, 166,0.1)",color:"#00bba6",marginRight:5,padding:"6px 10px", border:"1px solid #00bba6"}} onClick={()=>{setSelectedPartnerChatBox(product?.seller);setShowChatBox(true)}}>
                                <FontAwesomeIcon icon={faMessage} style={{marginRight:3}}></FontAwesomeIcon>
                                Chat Ngay
                            </button>
                            <button style={{backgroundColor:"white",color:"rgb(170 170 170)",padding:"6px 10px",border:"1px solid rgb(170 170 170)"}}> <FontAwesomeIcon icon={faShop} style={{marginRight:3}}></FontAwesomeIcon>Xem Shop</button>
                        </div>
                    </div>
                </div>
                <div style={{display:"flex",flex:"1",alignItems:"center",justifyContent:"space-around"}}>
                    <div style={{width:"25%"}}>
                        <div style={{display:"flex"}}>
                            <div style={{width:"60%",color:"#00000066"}}>Đánh giá</div>
                            <div style={{width:"40%",color:"#009F8D"}}>10,1k</div>
                        </div>
                        <div style={{display:"flex"}}>
                            <div style={{width:"60%",color:"#00000066"}}>Sản phẩm</div>
                            <div style={{color:"#009F8D"}}>214</div>
                        </div>
                    </div>
                    <div style={{width:"35%"}} >
                        <div style={{display:"flex"}}>
                            <div style={{width:"60%",color:"#00000066"}}>Tỉ Lệ Phản Hồi</div>
                            <div style={{color:"#009F8D"}}>90%</div>
                        </div>
                        <div style={{display:"flex"}}>
                            <div style={{width:"60%",color:"#00000066"}}>Thời Gian Phản Hồi</div>
                            <div style={{color:"#009F8D"}}>trong vài giờ</div>
                        </div>
                    </div>
                    <div style={{width:"30%"}}>
                        <div style={{display:"flex"}}>
                            <div style={{width:"60%",color:"#00000066"}}>Tham Gia</div>
                            <div style={{color:"#009F8D"}}>18 tháng trước</div>
                        </div>
                        <div style={{display:"flex"}}>
                            <div style={{width:"60%",color:"#00000066"}}>Người Theo Dõi</div>
                            <div style={{color:"#009F8D"}}>1,4k</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container-view-details-product' style={{padding:0,marginTop:20,display:"flex"}}>
                <div className='container_details_product_1'>
                    <div className='details_product'>
                        <div className='details_product_title'>CHI TIẾT SẢN PHẨM</div>
                        <div className='details_product_content'>
                            <div className='details_product_content_item'>
                                <div className='col-4 label'>Danh Mục</div>
                                <div className='col-8'>{product?.categories.slice().reverse().join(' > ')}</div>
                            </div>
                            <div className='details_product_content_item'>
                                <div className='col-4 label'>Nhà cung cấp</div>
                                <div className='col-8'>{product?.supplier.name}</div>
                            </div>
                            <div className='details_product_content_item'>
                                <div className='col-4 label'>Xuất xứ</div>
                                <div className='col-8'>{product?.origin}</div>
                            </div>
                        </div>
                    </div>
                    <div className='details_product' style={{borderBottom:"1px solid rgba(0,0,0,0.2)"}}>
                        <div className='details_product_title'>MÔ TẢ SẢN PHẨM</div>
                        <div style={{paddingLeft:"15px"}}
                            dangerouslySetInnerHTML={{ __html: product?.description }}
                        />
                    </div>
                    <div className="vdpp-review-section">
                        <div className="vdpp-header">
                            <h2>ĐÁNH GIÁ SẢN PHẨM</h2>
                        </div>

                        <div className="vdpp-rating-summary">
                        <div className="vdpp-average-rating">
                            {rateInfo?.averageRate !=null && <h1>{rateInfo?.averageRate.toFixed(1) || "0.0"}</h1>}
                            <p>trên 5</p>
                            <div className="vdpp-star-rating">
                                <div className="vdpp-star-overlay" style={{ width: `${(rateInfo?.averageRate || 0) * 20}%` }}>
                                    ★★★★★
                                </div>
                                <div className="vdpp-star-background">★★★★★</div>
                            </div>
                        </div>

                            <div className="vdpp-review-stats">
                                <button className={`vdpp-filter-button ${rateStarShow === null ? 'active' : ''}`} onClick={()=>setRateStarShow(null)}>
                                    {`Tất Cả (${formatCount(rateInfo?.totalRate || 0)})`}
                                </button>
                                <button className={`vdpp-filter-button ${rateStarShow === 5 ? 'active' : ''}`} onClick={()=>setRateStarShow(5)}>
                                    {`5 Sao (${formatCount(rateInfo?.rate5Star || 0)})`}
                                </button>
                                <button className={`vdpp-filter-button ${rateStarShow === 4 ? 'active' : ''}`} onClick={()=>setRateStarShow(4)}>
                                    {`4 Sao (${formatCount(rateInfo?.rate4Star || 0)})`}
                                </button>
                                <button className={`vdpp-filter-button ${rateStarShow === 3 ? 'active' : ''}`} onClick={()=>setRateStarShow(3)}>
                                    {`3 Sao (${formatCount(rateInfo?.rate3Star || 0)})`}
                                </button>
                                <button className={`vdpp-filter-button ${rateStarShow === 2 ? 'active' : ''}`} onClick={()=>setRateStarShow(2)}>
                                    {`2 Sao (${formatCount(rateInfo?.rate2Star || 0)})`}
                                </button>
                                <button className={`vdpp-filter-button ${rateStarShow === 1 ? 'active' : ''}`} onClick={()=>setRateStarShow(1)}>
                                    {`1 Sao (${formatCount(rateInfo?.rate1Star || 0)})`}
                                </button>
                            </div>
                        </div>

                        {
                            rateInfo?.rateResponses != null && rateInfo?.rateResponses.map((item, index) => {
                                // Kiểm tra điều kiện: nếu item.rateStar === rateStarshow hoặc rateStarshow === null
                                if (rateStarShow === null || item?.rateStar === rateStarShow) {
                                    return (
                                        <div className="vdpp-review" key={index}>
                                            <div className="vdpp-review-header">
                                                <p className="vdpp-reviewer-name" style={{ margin: 0 }}>{item?.customerName}</p>
                                                <p style={{ margin: 0 }}>
                                                    Phân loại: 
                                                    {item.label1 && ` ${item.label1}`}
                                                    {item.label2 && `, ${item.label2}`}
                                                </p>
                                                <p className="vdpp-review-date" style={{ margin: 0 }}>
                                                    {new Date(item?.createdDate).toLocaleString('en-CA', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
                                                    })}
                                                </p>

                                                <div className="vdpp-star-rating" style={{ margin: 0, color: "#fae845" }}>
                                                    {'★'.repeat(item?.rateStar || 5)}{'☆'.repeat(5 - (item?.rateStar || 5))}
                                                </div>
                                            </div>
                                            <p className="vdpp-review-text">
                                                {item?.content}
                                            </p>
                                            <div className="vdpp-review-images">
                                                {item.images && item.images.length > 0 && (
                                                    item.images.map((imgSrc, imgIndex) => (
                                                        <img src={imgSrc} alt={`Product Image ${imgIndex + 1}`} key={imgIndex} />
                                                    ))
                                                ) }
                                            </div>
                                            {item.replySeller && (
                                                <div className="vdpp-seller-reply">
                                                    <p>
                                                        <strong>Phản Hồi Của Người Bán:</strong> {item.replySeller}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null; // Nếu điều kiện không thỏa mãn, không render item
                            })
                        }


                        
                    </div>
                </div>
                
                <div className='container_details_product_2'>
                <div style={{backgroundColor:"white"}}>
                    <div style={{textAlign:"center", color:"#3498db", fontWeight:"500", fontSize:"2rem", marginBottom:"2rem"}}>CÓ THỂ BẠN CŨNG THÍCH</div>
                    {suggests.map((item, index) => (
                        <div key={index} className="product-card">
                        <img src={item?.image} alt={item?.name} />
                        <div className="two-line-ellipsis">
                            {item?.name}
                        </div>
                        <div>
                            {item?.priceMin === item?.priceMax
                            ? formatPriceToVND(item?.priceMin)
                            : `${formatPriceToVND(item?.priceMin)} - ${formatPriceToVND(item?.priceMax)}`}
                        </div>
                        </div>
                    ))}
                </div>
                </div>
            </div>
            <div className='container-view-details-product'style={{padding:0,marginTop:20,display:"flex",background:"white"}}>
                
            </div>
        </div >
    )
}

export default ViewDetailsProductPage;