import React, { useState, useEffect } from 'react';
import "../../css/homepage/bootstrap.min.css";
import "../../css/homepage/plugin.css";
import "../../css/homepage/bundle.css";
import "../../css/homepage/style.css";
import "../../css/homepage/responsive.css";
import "../../css/homepage/base.css";
import "../../css/homepage/homepage.css";
import productService from '../../services/product.service';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import categoryServer from '../../services/category.server';
import cartService from '../../services/cart.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import notificationService from '../../services/notification.service';
function HomePage({}) {
    const navigate = useNavigate();
    const [userInfo,setUserInfo] = useState(null);
    const [listProduct, setListProduct] = useState([]);
    const [imageOfProducts,setImageOfProducts] = useState([]);
    const [listCategory,setListCategory] = useState([]);
    const [chooseCategory,setChooseCategory] = useState(null);
    const [productNameSearch,setProductNameSearch] = useState("");
    const [commentCount, setCommentCount] = useState(null);
    const [priceMin,setPriceMin]=useState(null);
    const [priceMax,setPriceMax] = useState(null);
    const [rateStar,setRateStar] = useState(null);
    const [cartData, setCartData] = useState(null);
    const [sortField,setSortField] = useState("countRates")
    const [typeSort,setTypeSort] = useState("DESC")
    const [page,setPage] = useState(1);
    const [listCFProducts,setListCFProducts] = useState([])
    const [totalPages,setTotalPages] = useState(3);
    
    const handlePrevious = () => {
        if (page > 1) {
          setPage(page - 1);
        }
      };
    
      const handleNext = () => {
        if (page < totalPages) {
          setPage(page + 1);
        }
      };
    const generatePageNumbers = () => {
        const pageNumbers = [];
        let startPage = Math.max(1, page - 2); // Start at least 2 pages before the current page
        let endPage = Math.min(totalPages, page + 2); // End at least 2 pages after the current page
    
        // Adjust for small ranges
        if (page <= 3) {
          endPage = Math.min(5, totalPages);
        } else if (page >= totalPages - 2) {
          startPage = Math.max(totalPages - 4, 1);
        }
    
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
    
        return pageNumbers;
      };
    const changeCommentCount = (count) => {
        setCommentCount(count);
      };
    const changeRateStar =(rs)=>{
        if(rs == rateStar){
            setRateStar(null);
        }else{
            setRateStar(rs);
        }
    }
    const handleApplyFilters = () => {
        getAllProduct();  // Gọi lại hàm getAllProduct với các bộ lọc đã chọn
      };
    const handleClearFilters = () => {
        setPriceMin(null);
        setPriceMax(null);
        setRateStar(null);
        setChooseCategory(null);
        setCommentCount(null);  
        getAllProduct()
      };
    const getListCategory = async ()=>{
        const response = await categoryServer.getParentByCondition("");
        console.log(response)
        setListCategory(response)
    }
    const getCartData = (id) => {
        cartService.getByCustomerID(id)
            .then(data => {
                console.log(data)
                setCartData(data);
            })
            .catch(error => {
                console.error(error);
            })
    }
    useEffect(()=>{
        console.log(cartData)
    },[cartData])
    useEffect(()=>{
        getListCategory()
    },[])
    const getAllProduct = async () => {
        const body = {};
    
        // Thêm bộ lọc vào đối tượng body
        if (chooseCategory != null) {
          body.categoryId = chooseCategory;
        }
        body.productName = productNameSearch
        body.sortField = sortField
        body.typeSort = typeSort;
        body.page = page;
        body.pageSize = 15;
        if (priceMin != null) {
          body.priceMin = priceMin;
        }
        if (priceMax != null) {
          body.priceMax = priceMax;
        }
        if (rateStar != null) {
          body.rateStar = rateStar;
        }
        if (commentCount != null) {
          body.countRates = commentCount;
        }
    
        try {
          const response = await productService.search(body);
          console.log(response);  // Kiểm tra kết quả trả về từ API
    
        //   // Xử lý các sản phẩm nếu cần, ví dụ tính toán thêm thông tin về giá hoặc doanh thu
        //   for (let i = 0; i < response.length; i++) {
        //     const product = response[i];
        //     const maxPrice = Math.max(...product.typeOfProducts.map(item => item.price));
        //     const minPrice = Math.min(...product.typeOfProducts.map(item => item.price));
        //     const totalRevenue = product.typeOfProducts.reduce((sum, item) => sum + item.revenue, 0);
        //     const totalQuantity = product.typeOfProducts.reduce((sum, item) => sum + item.quantity - item.soldQuantity, 0);
        //     const soldQuantity = product.typeOfProducts.reduce((sum, item) => sum + item.soldQuantity, 0);
    
        //     product.maxPrice = maxPrice;
        //     product.minPrice = minPrice;
        //     product.totalRevenue = totalRevenue;
        //     product.totalQuantity = totalQuantity;
        //     product.soldQuantity = soldQuantity;
        //   }
        //     // Nếu sortField là "price", thực hiện sắp xếp
        //     if (sortField === "price") {
        //         response.sort((a, b) => {
        //         const priceA = a.maxPrice || 0; // Sử dụng maxPrice
        //         const priceB = b.maxPrice || 0;
            
        //         // So sánh maxPrice
        //         if (priceA !== priceB) {
        //             return typeSort === "ASC" ? priceA - priceB : priceB - priceA;
        //         }
            
        //         // Nếu maxPrice bằng nhau, so sánh minPrice
        //         const minPriceA = a.minPrice || 0;
        //         const minPriceB = b.minPrice || 0;
        //         return typeSort === "ASC" ? minPriceA - minPriceB : minPriceB - minPriceA;
        //         });
        //     }
          setListProduct(response);  // Cập nhật danh sách sản phẩm sau khi tìm kiếm
          console.log(response.length)
          setTotalPages(response[0]?.totalAmount/15 + 1 || 3)
        } catch (error) {
          console.error("Error fetching products:", error);
        }
    };
    const getSuggestCF = async (uid)=>{
        const response = await productService.getSuggestCF(uid);
        setListCFProducts(response)
        console.log(response);
    }
    useEffect(()=>{
        const body ={}
        if (chooseCategory != null) {
            body.categoryId = chooseCategory;  // Thêm thuộc tính categoryId vào body
        }
        console.log(body)
        console.log(sortField)
        console.log(typeSort)
        getAllProduct(body)

    },[chooseCategory,sortField,typeSort,page])
    useEffect(()=>{
        console.log(imageOfProducts)
    },[imageOfProducts])
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user)
        if(user){
            setUserInfo(user);
        }else{
            navigate("/register")
        }
        getCartData(user?.id)
        getAllProduct({})
        getSuggestCF(user?.id)
    },[])
    function formatPriceToVND(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }
    const viewDetail = (productId) => {
        navigate(`/detailsProduct?productId=${productId}`)
    }
    return (
        <>
            <head>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Shoppe</title>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;1,700&display=swap&subset=vietnamese" rel="stylesheet" />
            </head>
            <div className="app" style={{position:"relative"}}>

                <Header userInfo ={userInfo} cartData={cartData} handleApplyFilters = {handleApplyFilters} setProductNameSearch={setProductNameSearch}/>
                <div class="app__container" >
                    {/* <div class="image-carousel">
                        <div class="image-carousel__item-list-wrapper">
                            <ul class="image-carousel__item-list" style={{"width: 135%; transform: translate(-480px, 0px); transition: 500ms;"}}>
                                <li class="image-carousel__item" style="padding: 0px; width: 5%;">
                                    <a class="home-category-list__category-grid" href="/Thời-Trang-Nam-cat.11035567">
                                        <div class="g3RFjs">
                                            <div class="_2QRysE">
                                                <picture class="-0p2rg">
                                                    <source srcset="https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w320_nl.webp 1x, https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp 2x" type="image/webp" class="-0p2rg"/>
                                                    <img width="320" loading="lazy" class="nnYku4 lazyload +K-jRT" srcset="https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w320_nl 1x, https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl 2x" src="https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b" style=""/>
                                                </picture>
                                            </div>
                                            <div class="GE2Jnm">
                                                <div class="_0qFceF">Thời Trang Nam</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li class="image-carousel__item" style={{padding: 0, width: "5%;"}}>
                                    <a class="home-category-list__category-grid" href="/Thời-Trang-Nữ-cat.11035639">
                                        <div class="g3RFjs">
                                            <div class="_2QRysE">
                                                <picture class="-0p2rg">
                                                    <source srcset="https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w320_nl.webp 1x, https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w640_nl.webp 2x" type="image/webp" class="-0p2rg"/>
                                                    <img width="320" loading="lazy" class="nnYku4 lazyload +K-jRT" srcset="https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w320_nl 1x, https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w640_nl 2x" src="https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d" style=""/>
                                                </picture>
                                            </div>
                                            <div class="GE2Jnm">
                                                <div class="_0qFceF">Thời Trang Nữ</div>
                                            </div>
                                        </div>
                                    </a>
                                </li> */}
                                
                    <div class="grid">
                        <div class="grid__row app__content">
                        <div class="grid__column-2">
                        <nav className="category" style={{padding:10,}}>

                            <h3 className="category__heading" style={{ paddingLeft: 0 }}>
                                <i className="category__heading-icon fas fa-list"></i>
                                Danh mục
                            </h3>
                            <ul className="category-list" style={{marginBottom:0}}>
                                {listCategory.map((item, index) => (
                                <li
                                    className={`category-item ${chooseCategory === item?.id ? ' category-item--active' : ''}`}
                                    onClick={() => setChooseCategory(item?.id)}
                                    key={index}
                                >
                                    <a href="#" className="category-item__link">{item?.name}</a>
                                </li>
                                ))}
                            </ul>

                            <div style={{borderTop:"1px solid rgba(0,0,0,0.3)", padding:"1rem 0rem"}}>
                                <div style={{display:"flex", alignItems:"center"}}>
                                    <FontAwesomeIcon icon={faCoins}  style={{color:"#FFD700", marginRight:5}}/>
                                    <div style={{fontWeight:400,fontSize:"1.5rem"}}>KHOẢNG GIÁ</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',padding:"10px" }}>
                                <div style={{ width: '45%', border:"1px solid gray" }}>
                                    <input
                                    type="number"
                                    min={0}
                                    placeholder="₫ TỪ"
                                    style={{ width: '100%', height:"3rem"}}
                                    onChange={(e) => setPriceMin(e.target.value)}
                                    value={priceMin || ''}
                                    />
                                </div>
                                <div
                                    style={{
                                    width: '5%',
                                    height: '2px',
                                    backgroundColor: '#000',
                                    marginTop: '5px',
                                    marginBottom: '5px',
                                    }}
                                ></div>
                                <div style={{ width: '45%',border:"1px solid gray" }}>
                                    <input
                                    type="number"
                                    min={0}
                                    placeholder="₫ ĐẾN"
                                    style={{ width: '100%',height:"3rem" }}
                                    onChange={(e) => setPriceMax(e.target.value)}
                                    value={priceMax || ''}
                                    />
                                </div>
                                </div>
                                <div style={{width:"100%", margin:"auto"}}>
                                    <button  style={{backgroundColor:"#3498db", color:"white", border:"none", width:"100%"}}onClick={handleApplyFilters}>ÁP DỤNG</button>
                                </div>
                            </div>

                            <div style={{borderTop:"1px solid rgba(0,0,0,0.3)", padding:"1rem 0rem"}}>
                                <div style={{fontWeight:400,fontSize:"1.5rem"}}>ĐÁNH GIÁ</div>
                                <div style={{padding:"0rem 1rem"}}>
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div style={{backgroundColor: rateStar === star ? 'rgba(0,0,0,0.1)' : 'white',display:"flex", alignItems:"center"}}>
                                        <div
                                            key={star}
                                            style={{
                                                margin: 0,
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer',
                                                color:"#fae845",
                                                fontSize:"1.8rem"
                                            }}
                                            onClick={() => changeRateStar(star)}
                                        >
                                        {'★'.repeat(star)}{'☆'.repeat(5 - star)} 
                                        </div>
                                        <div style={{marginLeft:"0.5rem"}}>trở lên</div>
                                    </div>
                                ))}
                                
                                </div >
                                <div style={{width:"100%", margin:"auto"}}>
                                    <button  style={{backgroundColor:"#3498db", color:"white", border:"none", width:"100%"}}onClick={handleApplyFilters}>ÁP DỤNG</button>
                                </div>
                                    
                            </div>

                            {/* Phần lọc số lượng bình luận */}
                            <div style={{borderTop:"1px solid rgba(0,0,0,0.3)", paddingTop:"1rem"}}>
                                <div style={{fontWeight:400,fontSize:"1.5rem"}}>SỐ LƯỢNG BÌNH LUẬN</div>
                                <div style={{padding:"0rem 1rem"}}>
                                    <div
                                        style={{
                                        margin: 0,
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        backgroundColor: commentCount === 0 ? 'rgba(0,0,0,0.1)' : 'white',
                                        marginBottom:"5px"
                                        }}
                                        onClick={() => changeCommentCount(0)}
                                    >
                                        Chưa có bình luận nào
                                    </div>
                                    <div
                                        style={{
                                        margin: 0,
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        backgroundColor: commentCount === 100 ? 'rgba(0,0,0,0.1)' : 'white',
                                        marginBottom:"5px"
                                        }}
                                        onClick={() => changeCommentCount(100)}
                                    >
                                        100 Bình Luận
                                    </div>
                                    <div
                                        style={{
                                        margin: 0,
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        backgroundColor: commentCount === 1000 ? 'rgba(0,0,0,0.1)' : 'white',
                                            marginBottom:"5px"
                                    }}
                                        onClick={() => changeCommentCount(1000)}
                                    >
                                        1000 Bình Luận
                                    </div>
                                    <div
                                        style={{
                                        margin: 0,
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        backgroundColor: commentCount === 5000 ? 'rgba(0,0,0,0.1)' : 'white',
                                        marginBottom:"5px"
                                    }}
                                        onClick={() => changeCommentCount(5000)}
                                    >
                                        5000 Bình Luận
                                    </div>
                                    <div
                                        style={{
                                        margin: 0,
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        backgroundColor: commentCount === 10000 ? 'rgba(0,0,0,0.1)' : 'white',
                                            marginBottom:"5px"
                                    }}
                                        onClick={() => changeCommentCount(10000)}
                                    >
                                        10000 Bình Luận
                                    </div>
                                </div>
                                    <div style={{width:"100%", margin:"auto"}}>
                                        <button  style={{backgroundColor:"#3498db", color:"white", border:"none", width:"100%"}}onClick={handleApplyFilters}>ÁP DỤNG</button>
                                    </div>
                            </div>

                            <div style={{borderTop:"1px solid rgba(0,0,0,0.3)", padding:"1rem 0rem", marginTop:"1rem"}}>
                                <button style={{backgroundColor:"red", color:"white", border:"none", width:"100%"}} onClick={handleClearFilters}>XÓA TẤT CẢ</button>
                            </div>
                            
                            </nav>
                        </div>
                            
                            <div class="grid__column-10" >
                             <div class="home-product">
                                    <div style={{textAlign:"center",fontSize:18, backgroundColor:"white", padding:5}}>GỢI Ý DÀNH CHO BẠN</div>
                                    <div class="grid__row">
                                        {listCFProducts?.length > 0 && listCFProducts.map((item, index) => {
                                            return (
                                                <div className="grid__column-2-4" key={index}>
                                                    <a className="home-product-item" onClick={()=>viewDetail(item?.pid)}>
                                                        {/* <div className="home-product-item__img" 
                                                            // Bạn có thể thêm style như sau:
                                                            // style={{ backgroundImage: `url(${item?.imageUrl || 'default-image-url'})` }}
                                                        ></div> */}
                                                        <div style={{height:"100%",width:"100%"}}>
                                                            <img className="home-product-item__img" style={{width:"100%",height:"20rem",objectFit:"cover"}}src={item.image}></img>
                                                        </div>
                                                        <h4 className="home-product-item__name">{item?.name}</h4>
                                                        <div className="home-product-item__price">
                                                            <span className="home-product-item__price-current">
                                                                {item.priceMin == item.priceMax ? `${formatPriceToVND(item.priceMin)}`:`${formatPriceToVND(item.priceMin)} - ${formatPriceToVND(item.priceMax)}`}
                                                            </span>
                                                        </div>
                                                        <div className="home-product-item__action">
                                                            <span className="home-product-item__like home-product-item__like--liked">
                                                                <i className="home-product-item__like-icon-empty far fa-heart"></i>
                                                                <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                                            </span>
                                                            <div className="home-product-item__rateting">
                                                                <ul style={{display:"flex"}}>
                                                                    <div className="vdpp-star-rating" style={{fontSize:14}}>
                                                                        <div className="vdpp-star-overlay" style={{ width: `${(item?.rateStar || 0) * 20}%` }}>
                                                                            ★★★★★
                                                                        </div>
                                                                        <div className="vdpp-star-background">★★★★★</div>
                                                                    </div>
                                                                </ul>
                                                            </div>
                                                            <span className="home-product-item__sold"> Đã bán {item?.soldQuantity}</span>
                                                        </div>
                                                        <div className="home-product-item__origin">
                                                            <span className="home-product-item__orogin-name">{item?.origin }</span>
                                                        </div>
                                                        <div className="home-product-item__favorite">
                                                            <i className="fas fa-check"></i>
                                                            Yêu thích
                                                        </div>
                                                        <div className="home-product-item__sale-off">
                                                            <div style={{  textAlign:"center"}}>
                                                                <div 
                                                                    className="home-product-item__sale-off-percent" 
                                                                    style={{ display: 'block',textAlign:"center" }}  // Ensure it takes the full width and stays on its own line
                                                                >
                                                                    {item.reducePercent}%

                                                                </div>
                                                                <div 
                                                                    className="home-product-item__sale-off-label" 
                                                                    style={{ display: 'block' }}  // Ensure it takes the full width and stays on its own line
                                                                >
                                                                    GIẢM
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </a>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div class="home-filter">
                                    <span class="home-filter__label">Sắp xếp theo</span>
                                    <button class={sortField !== "countRates" ? "home-filter__btn btn" : "home-filter__btn btn btn--primary"} onClick={()=>{{setSortField("countRates");setTypeSort("DESC")}}}>Phổ biến</button>
                                    <button class={sortField !== "createdAt" ? "home-filter__btn btn" : "home-filter__btn btn btn--primary"} onClick={()=>{{setSortField("createdAt");setTypeSort("DESC")}}}>Mới nhất</button>
                                    <button class={sortField !== "soldQuantity" ? "home-filter__btn btn" : "home-filter__btn btn btn--primary"} onClick={()=>{{setSortField("soldQuantity");setTypeSort("DESC")}}}>Bán chạy</button>
                                    <div class="select-input">
                                        <span class="select-input__label">Giá</span>
                                        <i class="select-input__icon fas fa-angle-down"></i>
                                        <ul class="select-input__list">
                                            <li class="select-input__item" onClick={(e)=>{{e.preventDefault();setSortField("price");setTypeSort("ASC")}}}>
                                                <a href="" class="select-input__link">Giá: Thấp đến cao</a>
                                            </li>
                                            <li class="select-input__item" onClick={(e)=>{{e.preventDefault();setSortField("price");setTypeSort("DESC")}}}>
                                                <a href="" class="select-input__link">Giá: Cao đến thấp</a>
                                            </li>
                                        </ul>
                                    </div>
                                
                                    <div class="home-filter__page">

                                    <div class="home-filter__page-control">
                                        <a href="" class="home-filter__page-btn home-filter__page-btn--disable">
                                            <i class="home-filter__page-icon fas fa-angle-left"></i>
                                        </a>
                                        <a href="" class="home-filter__page-btn">
                                            <i class="home-filter__page-icon fas fa-angle-right"></i>
                                        </a>
                                    </div>
                                    </div>
                                </div>
                               
                                <div class="home-product">
                                    <div class="grid__row">
                                    {listProduct?.length > 0 && listProduct.map((item, index) => {
                                        return (
                                            <div className="grid__column-2-4" key={index}>
                                                <a className="home-product-item" onClick={()=>viewDetail(item?.pid)}>
                                                    {/* <div className="home-product-item__img" 
                                                        // Bạn có thể thêm style như sau:
                                                        // style={{ backgroundImage: `url(${item?.imageUrl || 'default-image-url'})` }}
                                                    ></div> */}
                                                    <div style={{height:"100%",width:"100%"}}>
                                                        <img className="home-product-item__img" style={{width:"100%",height:"20rem",objectFit:"cover"}}src={item?.image}></img>
                                                    </div>
                                                    <h4 className="home-product-item__name">{item?.name}</h4>
                                                    <div className="home-product-item__price">
                                                        <span className="home-product-item__price-current">
                                                            {item.priceMin == item.priceMax ? `${formatPriceToVND(item.priceMin)}`:`${formatPriceToVND(item.priceMin)} - ${formatPriceToVND(item.priceMax)}`}
                                                        </span>
                                                    </div>
                                                    <div className="home-product-item__action">
                                                        <span className="home-product-item__like home-product-item__like--liked">
                                                            <i className="home-product-item__like-icon-empty far fa-heart"></i>
                                                            <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                                        </span>
                                                        <div className="home-product-item__rateting">
                                                            <ul style={{display:"flex"}}>
                                                                    <div className="vdpp-star-rating" style={{fontSize:14}}>
                                                                        <div className="vdpp-star-overlay" style={{ width: `${(item?.rateStar || 0) * 20}%` }}>
                                                                            ★★★★★
                                                                        </div>
                                                                        <div className="vdpp-star-background">★★★★★</div>
                                                                    </div>
                                                                </ul>
                                                        </div>
                                                        <span className="home-product-item__sold"> Đã bán {item?.soldQuantity}</span>
                                                    </div>
                                                    <div className="home-product-item__origin">
                                                        <span className="home-product-item__orogin-name">{item?.origin }</span>
                                                    </div>
                                                    <div className="home-product-item__favorite">
                                                        <i className="fas fa-check"></i>
                                                        Yêu thích
                                                    </div>
                                                    <div className="home-product-item__sale-off">
                                                        <div style={{  textAlign:"center"}}>
                                                            <div 
                                                                className="home-product-item__sale-off-percent" 
                                                                style={{ display: 'block',textAlign:"center" }}  // Ensure it takes the full width and stays on its own line
                                                            >
                                                                {item?.reducePercent}%

                                                            </div>
                                                            <div 
                                                                className="home-product-item__sale-off-label" 
                                                                style={{ display: 'block' }}  // Ensure it takes the full width and stays on its own line
                                                            >
                                                                GIẢM
                                                            </div>
                                                        </div>
                                                    </div>

                                                </a>
                                            </div>
                                        )
                                    })}

                                           
                                    </div>
                                </div>
                                <ul className="pagination home-product__pagination">
                                    <li className={`pagination-item ${page === 1 ? 'disabled' : ''}`}>
                                        <a
                                        className="pagination-item__link"
                                        onClick={handlePrevious}
                                        >
                                        <i className="pagination-item__icon fas fa-angle-left"></i>
                                        </a>
                                    </li>

                                    {generatePageNumbers().map(item => (
                                        <li
                                        key={item}
                                        className={`pagination-item ${page === item ? 'pagination-item--active' : ''}`}
                                        >
                                        <a
                                            className="pagination-item__link"
                                            onClick={() => setPage(item)}
                                        >
                                            {item}
                                        </a>
                                        </li>
                                    ))}

                                    {totalPages > 5 && page < totalPages - 2 && (
                                        <li className="pagination-item">
                                        <span className="pagination-item__link">...</span>
                                        </li>
                                    )}

                                    <li className={`pagination-item ${page === totalPages ? 'disabled' : ''}`}>
                                        <a
                                        className="pagination-item__link"
                                        onClick={handleNext}
                                        >
                                        <i className="pagination-item__icon fas fa-angle-right"></i>
                                        </a>
                                    </li>
                                    </ul>
                                

                            </div>
                        </div>
                    </div>
                    
                    
                </div>
                <Footer/>

            </div>
        </>
    );
}

export default HomePage;
