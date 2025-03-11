import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./shop_seller_page.css"
import productService from '../../services/product.service';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import SellerInfo from "./components/SellerInfo";
function ShopSellerPage(){
    const [listProduct, setListProduct] = useState([]);
    const [imageOfProducts,setImageOfProducts] = useState([]);
    const[userInfo,setUserInfo] = useState(null);
    const navigate = useNavigate();
    const getAllProduct =()=>{
        productService.getAllProduct()
            .then(data => {
                console.log(data)
                setListProduct(data)
                let imageList =[];
                data.map(item=>{
                    imageList.push(item?.image)
                })
                console.log(imageList)
                loadImagesProduct(imageList)
            }).catch(error=>{
                console.log(error)
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
        
        getAllProduct()

    },[])
    const readImage = async (fileName) => {
        try {
            const response = await axios.get(`http://localhost:8081/file/read-image/${fileName}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };
    const loadImagesProduct = async (imageList) => {
        try {
            const imagePromises = imageList.map(async item => (await readImage(item)));
            const images = await Promise.all(imagePromises);
            console.log(images)
            setImageOfProducts(images);
        } catch (error) {
            console.error(error);
        }
    };
    function formatPriceToVND(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }
    const viewDetail = (productId) => {
        navigate(`/detailsProduct?productId=${productId}`)
    }
    return(
        <div>
            <Header/>
            <SellerInfo/>
            <div class="app__container">
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
                                <nav class="category">
                                    <h3 class="category__heading">
                                        <i class="category__heading-icon fas fa-list"></i>
                                        Danh mục</h3>
                                    <ul class="category-list">
                                        <li class="category-item category-item--active">
                                            <a href="#" class="category-item__link">Sản phẩm</a>
                                        </li>
                                        <li class="category-item">
                                            <a href="#" class="category-item__link">Điện tử</a>
                                        </li>
                                        <li class="category-item">
                                            <a href="#" class="category-item__link">Thời trang</a>
                                        </li>
                                        <li class="category-item">
                                            <a href="#" class="category-item__link">Đồ gia dụng</a>
                                        </li>
                                        <li class="category-item">
                                            <a href="#" class="category-item__link">Sách vở</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div class="grid__column-10">
                                <div class="home-filter">
                                    <span class="home-filter__label">Sắp xếp theo</span>
                                    <button class="home-filter__btn btn">Phổ biến</button>
                                    <button class="home-filter__btn btn btn--primary">Mới nhất</button>
                                    <button class="home-filter__btn btn">Bán chạy</button>
                                    <div class="select-input">
                                        <span class="select-input__label">Giá</span>
                                        <i class="select-input__icon fas fa-angle-down"></i>
                                        <ul class="select-input__list">
                                            <li class="select-input__item">
                                                <a href="" class="select-input__link">Giá: Thấp đến cao</a>
                                            </li>
                                            <li class="select-input__item">
                                                <a href="" class="select-input__link">Giá: Cao đến thấp</a>
                                            </li>
                                        </ul>
                                    </div>
                                
                                    <div class="home-filter__page">
                                    <span class="home-filter__page-num">
                                        <span class="home-filter__page-current">1</span>/14
                                    </span>
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
                                                <a className="home-product-item" onClick={()=>viewDetail(item?.id)}>
                                                    {/* <div className="home-product-item__img" 
                                                        // Bạn có thể thêm style như sau:
                                                        // style={{ backgroundImage: `url(${item?.imageUrl || 'default-image-url'})` }}
                                                    ></div> */}
                                                    <img className="home-product-item__img" src={imageOfProducts[index]}></img>
                                                    <h4 className="home-product-item__name">{item?.name}</h4>
                                                    <div className="home-product-item__price">
                                                        <span className="home-product-item__price-old">
                                                            {item?.priceOld ? `${item.priceOld}đ` : '1.200.000đ'}
                                                        </span>
                                                        <span className="home-product-item__price-current">
                                                            {item?.price ? `${formatPriceToVND(item.price)}` : '999.999đ'}
                                                        </span>
                                                    </div>
                                                    <div className="home-product-item__action">
                                                        <span className="home-product-item__like home-product-item__like--liked">
                                                            <i className="home-product-item__like-icon-empty far fa-heart"></i>
                                                            <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                                        </span>
                                                        <div className="home-product-item__rateting">
                                                            {/* Render sao dựa trên rating */}
                                                            {[...Array(4)].map((_, i) => (
                                                                <i className="home-product-item__star--gold fas fa-star" key={i}></i>
                                                            ))}
                                                            <i className="fas fa-star"></i>
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
                                                        <span className="home-product-item__sale-off-percent">
                                                            {item?.discountPercent ? `${item.discountPercent}%` : '43%'}
                                                        </span>
                                                        <span className="home-product-item__sale-off-label">GIẢM</span>
                                                    </div>
                                                </a>
                                            </div>
                                        )
                                    })}

                                           
                                    </div>
                                </div>
                                <ul class="pagination home-product__pagination">
                                    <li class="pagination-item">
                                        <a href="" class="pagination-item__link">
                                            <i class="pagination-item__icon fas fa-angle-left"></i>
                                        </a>
                                    </li>
                                    <li class="pagination-item pagination-item--active">
                                        <a href="" class="pagination-item__link">1</a>
                                    </li>
                                    <li class="pagination-item">
                                        <a href="" class="pagination-item__link">2</a>
                                    </li>
                                    <li class="pagination-item">
                                        <a href="" class="pagination-item__link">3</a>
                                    </li>
                                    <li class="pagination-item">
                                        <a href="" class="pagination-item__link">4</a>
                                    </li>
                                    <li class="pagination-item">
                                        <a href="" class="pagination-item__link">5</a>
                                    </li>
                                    <li class="pagination-item">
                                        <a href="" class="pagination-item__link">...</a>
                                    </li>
                                    <li class="pagination-item">
                                        <a href="" class="pagination-item__link">14</a>
                                    </li>
                                    <li class="pagination-item">
                                        <a href="" class="pagination-item__link">
                                            <i class="pagination-item__icon fas fa-angle-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
       
    )
}
export default ShopSellerPage;