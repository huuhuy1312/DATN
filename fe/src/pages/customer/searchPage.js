import React, { useState, useEffect } from 'react';
import "../../css/homepage/bootstrap.min.css";
import "../../css/homepage/plugin.css";
import "../../css/homepage/bundle.css";
import "../../css/homepage/style.css";
import "../../css/homepage/responsive.css";
import logoEnglish from "../../css/homepage/img/logo/fontlogo.jpg"
import logoFrench from "../../css/homepage/img/logo/fontlogo2.jpg"
import logoShop from "../../css/homepage/img/logo/logo.jpg.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faAngleRight, faSearch, faAngleDown, faShoppingCart, faTimesCircle, faThLarge, faThList, faWifi, faEnvelope, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import cartService from '../../services/cart.service';
import productService from '../../services/product.service';
import categoryServer from '../../services/category.server';
import { useLocation, useNavigate } from 'react-router-dom';



function SearchPage() {
  //Get data
  const [cartData, setCartData] = useState(null);
  const [listProduct, setListProduct] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword');
    console.log(keyword)
    //Get Cart
    // cartService.getByID(1)
    //   .then(data => {
    //     setCartData(data["items"]);
    //     console.log(data);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   })
    //Get Products
    productService.getProductByName(keyword)
      .then(data => {
        setListProduct(data)
        console.log(data)
        console.log(listProduct)
      })
    categoryServer.getAll()
      .then(data => {
        setListCategory(data);
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [location]);
  //Show MiniCart
  const [showMiniCart, setShowMiniCart] = useState(false);
  const toogleMiniCart = () => {
    setShowMiniCart(!showMiniCart);
  }
  //Sort Products
  const [sortBy, setSortBy] = useState('position');
  const MyComponent = ({ transparency }) => {
    const starStyle = {
      maskImage: `linear-gradient(270deg, transparent ${(1 - transparency) * 100}%, gray ${(1 - transparency) * 100}%)`,
    };

    return (
      <a>
        <FontAwesomeIcon icon={faStar} style={starStyle} />
      </a>
    );
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  const sortProducts = (productList, sortBy) => {
    const sortFunctions = {
      idAscending: (a, b) => a.id - b.id,
      priceAscending: (a, b) => a.price - b.price,
      priceDescending: (a, b) => b.price - a.price,
      nameAscending: (a, b) => a.name.localeCompare(b.name),
      nameDescending: (a, b) => b.name.localeCompare(a.name),
      rateStarAscending: (a, b) => a.rateStar - b.rateStar,
      rateStarDescending: (a, b) => b.rateStar - a.rateStar,
      soldQuantityAscending: (a, b) => a.soldQuantity - b.soldQuantity,
      soldQuantityDescending: (a, b) => b.soldQuantity - a.soldQuantity,
    };

    const sortFunction = sortFunctions[sortBy] || sortFunctions.idAscending;

    return productList.slice().sort(sortFunction);
  };

  //Add To Cart
  const addToCart = (idProduct) => {

  }
  // Search product by Name
  const [searchName, setSearchName] = useState(null);
  const updateSearchName = (e) => {
    setSearchName(e.target.value);
  }
  const handleClickSearchName = (e) => {
    e.preventDefault();
    navigate(`/search?keyword=${searchName}`)
    console.log(searchName);
  }
  return (
    <div className='pos_page'>
      <div className='container'>
        <div className='pos_page_inner'>
          <div className='header_area'>
            <div className='header_top'>
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-6">
                  <div className="switcher">
                    <ul>
                      <li className="languages"><a href="#"><img src={logoEnglish} alt="" /> English <FontAwesomeIcon icon={faAngleDown} /></a>
                        <ul className="dropdown_languages">
                          <li><a href="#"><img src={logoEnglish} alt="" /> English</a></li>
                          <li><a href="#"><img src={logoFrench} alt="" /> French </a></li>
                        </ul>
                      </li>

                      <li className="currency"><a href="#"> Currency : $ <FontAwesomeIcon icon={faAngleDown} /></a>
                        <ul className="dropdown_currency">
                          <li><a href="#"> Dollar (USD)</a></li>
                          <li><a href="#"> Euro (EUR)  </a></li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="header_links">
                    <ul>
                      <li><a href="contact.html" title="Contact">Contact</a></li>
                      <li><a href="wishlist.html" title="wishlist">My wishlist</a></li>
                      <li><a href="my-account.html" title="My account">My account</a></li>
                      <li><a href="cart.html" title="My cart">My cart</a></li>
                      <li><a href="login.html" title="Login">Login</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="header_middel">
              <div className="row align-items-center">
                <div className="col-lg-3 col-md-3">
                  <div className="logo">
                    <a href="index.html"><img src={logoShop} alt="" /></a>
                  </div>
                </div>
                <div className="col-lg-9 col-md-9">
                  <div className="header_right_info">
                    <div className="search_bar">
                      <form>
                        <input placeholder="Search..." type="text" onChange={(e) => updateSearchName(e)} />
                        <button type="submit" onClick={(e) => handleClickSearchName(e)}><FontAwesomeIcon icon={faSearch} /></button>
                      </form>
                    </div>

                    <div className="shopping_cart">
                      <a href="#" onClick={toogleMiniCart}><FontAwesomeIcon icon={faShoppingCart} /> 2Items - $209.44 <FontAwesomeIcon icon={faAngleDown} /></a>
                      <div style={{ display: showMiniCart ? 'block' : 'none' }} className="mini_cart">
                        {cartData ? (
                          <>
                            {cartData.map(item => (
                              <div className="cart_item" key={item.id}>
                                <div className="cart_img">
                                  <a href="#"><img src={process.env.PUBLIC_URL + item.product.linkImage} alt="" /></a>
                                </div>
                                <div className="cart_info">
                                  <a href="#">{item.product.name}</a>
                                  <span className="cart_price">{item.totalPrice} VNĐ</span>
                                  <span className="quantity">Quantity: {item.quantity}</span>
                                </div>
                                <div className="cart_remove">
                                  <a title="Remove this item" href="#"><FontAwesomeIcon icon={faTimesCircle} /></a>
                                </div>
                              </div>
                            ))}
                            <div className="shipping_price">
                              <span> Shipping </span>
                              <span>  $7.00  </span>
                            </div>
                            <div className="total_price">
                              <span> total </span>
                              <span className="prices">  $227.00  </span>
                            </div>
                            <div className="cart_button">
                              <a href="checkout.html"> Check out</a>
                            </div>
                          </>) : (<p>Loading cart data...</p>)}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className="header_bottom">
              <div className="row">
                <div className="col-12">
                  <div className="main_menu_inner">
                    <div className="main_menu d-none d-lg-block">
                      <nav>
                        <ul>
                          <li className="active"><a href="index.html">Home</a>
                            <div className="mega_menu jewelry">
                              <div className="mega_items jewelry">
                                <ul>
                                  <li><a href="index.html">Home 1</a></li>
                                  <li><a href="index-2.html">Home 2</a></li>
                                </ul>
                              </div>
                            </div>
                          </li>
                          <li><a href="shop.html">shop</a>
                            <div className="mega_menu jewelry">
                              <div className="mega_items jewelry">
                                <ul>
                                  <li><a href="shop-list.html">shop list</a></li>
                                  <li><a href="shop-fullwidth.html">shop Full Width Grid</a></li>
                                  <li><a href="shop-fullwidth-list.html">shop Full Width list</a></li>
                                  <li><a href="shop-sidebar.html">shop Right Sidebar</a></li>
                                  <li><a href="shop-sidebar-list.html">shop list Right Sidebar</a></li>
                                  <li><a href="single-product.html">Product Details</a></li>
                                  <li><a href="single-product-sidebar.html">Product sidebar</a></li>
                                  <li><a href="single-product-video.html">Product Details video</a></li>
                                  <li><a href="single-product-gallery.html">Product Details Gallery</a></li>
                                </ul>
                              </div>
                            </div>
                          </li>
                          <li><a href="#">women</a>
                            <div className="mega_menu">
                              <div className="mega_top fix">
                                <div className="mega_items">
                                  <h3><a href="#">Accessories</a></h3>
                                  <ul>
                                    <li><a href="#">Cocktai</a></li>
                                    <li><a href="#">day</a></li>
                                    <li><a href="#">Evening</a></li>
                                    <li><a href="#">Sundresses</a></li>
                                    <li><a href="#">Belts</a></li>
                                    <li><a href="#">Sweets</a></li>
                                  </ul>
                                </div>
                                <div className="mega_items">
                                  <h3><a href="#">HandBags</a></h3>
                                  <ul>
                                    <li><a href="#">Accessories</a></li>
                                    <li><a href="#">Hats and Gloves</a></li>
                                    <li><a href="#">Lifestyle</a></li>
                                    <li><a href="#">Bras</a></li>
                                    <li><a href="#">Scarves</a></li>
                                    <li><a href="#">Small Leathers</a></li>
                                  </ul>
                                </div>
                                <div className="mega_items">
                                  <h3><a href="#">Tops</a></h3>
                                  <ul>
                                    <li><a href="#">Evening</a></li>
                                    <li><a href="#">Long Sleeved</a></li>
                                    <li><a href="#">Shrot Sleeved</a></li>
                                    <li><a href="#">Tanks and Camis</a></li>
                                    <li><a href="#">Sleeveless</a></li>
                                    <li><a href="#">Sleeveless</a></li>
                                  </ul>
                                </div>
                              </div>
                              <div className="mega_bottom fix">
                                <div className="mega_thumb">
                                  <a href="#"><img src={process.env.PUBLIC_URL + "img/banner/banner1.jpg"} alt="" /></a>
                                </div>
                                <div className="mega_thumb">
                                  <a href="#"><img src={process.env.PUBLIC_URL + "img/banner/banner2.jpg"} alt="" /></a>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li><a href="#">men</a>
                            <div className="mega_menu">
                              <div className="mega_top fix">
                                <div className="mega_items">
                                  <h3><a href="#">Rings</a></h3>
                                  <ul>
                                    <li><a href="#">Platinum Rings</a></li>
                                    <li><a href="#">Gold Ring</a></li>
                                    <li><a href="#">Silver Ring</a></li>
                                    <li><a href="#">Tungsten Ring</a></li>
                                    <li><a href="#">Sweets</a></li>
                                  </ul>
                                </div>
                                <div className="mega_items">
                                  <h3><a href="#">Bands</a></h3>
                                  <ul>
                                    <li><a href="#">Platinum Bands</a></li>
                                    <li><a href="#">Gold Bands</a></li>
                                    <li><a href="#">Silver Bands</a></li>
                                    <li><a href="#">Silver Bands</a></li>
                                    <li><a href="#">Sweets</a></li>
                                  </ul>
                                </div>
                                <div className="mega_items">
                                  <a href="#"><img src={process.env.PUBLIC_URL + "img/banner/banner3.jpg"} alt="" /></a>
                                </div>
                              </div>

                            </div>
                          </li>
                          <li><a href="#">pages</a>
                            <div className="mega_menu">
                              <div className="mega_top fix">
                                <div className="mega_items">
                                  <h3><a href="#">Column1</a></h3>
                                  <ul>
                                    <li><a href="portfolio.html">Portfolio</a></li>
                                    <li><a href="portfolio-details.html">single portfolio </a></li>
                                    <li><a href="about.html">About Us </a></li>
                                    <li><a href="about-2.html">About Us 2</a></li>
                                    <li><a href="services.html">Service </a></li>
                                    <li><a href="my-account.html">my account </a></li>
                                  </ul>
                                </div>
                                <div className="mega_items">
                                  <h3><a href="#">Column2</a></h3>
                                  <ul>
                                    <li><a href="blog.html">Blog </a></li>
                                    <li><a href="blog-details.html">Blog  Details </a></li>
                                    <li><a href="blog-fullwidth.html">Blog FullWidth</a></li>
                                    <li><a href="blog-sidebar.html">Blog  Sidebar</a></li>
                                    <li><a href="faq.html">Frequently Questions</a></li>
                                    <li><a href="404.html">404</a></li>
                                  </ul>
                                </div>
                                <div className="mega_items">
                                  <h3><a href="#">Column3</a></h3>
                                  <ul>
                                    <li><a href="contact.html">Contact</a></li>
                                    <li><a href="cart.html">cart</a></li>
                                    <li><a href="checkout.html">Checkout  </a></li>
                                    <li><a href="wishlist.html">Wishlist</a></li>
                                    <li><a href="login.html">Login</a></li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>

                          <li><a href="blog.html">blog</a>
                            <div className="mega_menu jewelry">
                              <div className="mega_items jewelry">
                                <ul>
                                  <li><a href="blog-details.html">blog details</a></li>
                                  <li><a href="blog-fullwidth.html">blog fullwidth</a></li>
                                  <li><a href="blog-sidebar.html">blog sidebar</a></li>
                                </ul>
                              </div>
                            </div>
                          </li>
                          <li><a href="contact.html">contact us</a></li>

                        </ul>
                      </nav>
                    </div>
                    <div className="mobile-menu d-lg-none">
                      <nav>
                        <ul>
                          <li><a href="index.html">Home</a>
                            <div>
                              <div>
                                <ul>
                                  <li><a href="index.html">Home 1</a></li>
                                  <li><a href="index-2.html">Home 2</a></li>
                                </ul>
                              </div>
                            </div>
                          </li>
                          <li><a href="shop.html">shop</a>
                            <div>
                              <div>
                                <ul>
                                  <li><a href="shop-list.html">shop list</a></li>
                                  <li><a href="shop-fullwidth.html">shop Full Width Grid</a></li>
                                  <li><a href="shop-fullwidth-list.html">shop Full Width list</a></li>
                                  <li><a href="shop-sidebar.html">shop Right Sidebar</a></li>
                                  <li><a href="shop-sidebar-list.html">shop list Right Sidebar</a></li>
                                  <li><a href="single-product.html">Product Details</a></li>
                                  <li><a href="single-product-sidebar.html">Product sidebar</a></li>
                                  <li><a href="single-product-video.html">Product Details video</a></li>
                                  <li><a href="single-product-gallery.html">Product Details Gallery</a></li>
                                </ul>
                              </div>
                            </div>
                          </li>
                          <li><a href="#">women</a>
                            <div>
                              <div>
                                <div>
                                  <h3><a href="#">Accessories</a></h3>
                                  <ul>
                                    <li><a href="#">Cocktai</a></li>
                                    <li><a href="#">day</a></li>
                                    <li><a href="#">Evening</a></li>
                                    <li><a href="#">Sundresses</a></li>
                                    <li><a href="#">Belts</a></li>
                                    <li><a href="#">Sweets</a></li>
                                  </ul>
                                </div>
                                <div>
                                  <h3><a href="#">HandBags</a></h3>
                                  <ul>
                                    <li><a href="#">Accessories</a></li>
                                    <li><a href="#">Hats and Gloves</a></li>
                                    <li><a href="#">Lifestyle</a></li>
                                    <li><a href="#">Bras</a></li>
                                    <li><a href="#">Scarves</a></li>
                                    <li><a href="#">Small Leathers</a></li>
                                  </ul>
                                </div>
                                <div>
                                  <h3><a href="#">Tops</a></h3>
                                  <ul>
                                    <li><a href="#">Evening</a></li>
                                    <li><a href="#">Long Sleeved</a></li>
                                    <li><a href="#">Shrot Sleeved</a></li>
                                    <li><a href="#">Tanks and Camis</a></li>
                                    <li><a href="#">Sleeveless</a></li>
                                    <li><a href="#">Sleeveless</a></li>
                                  </ul>
                                </div>
                              </div>
                              <div>
                                <div>
                                  <a href="#"><img src={process.env.PUBLIC_URL + "img/banner/banner1.jpg"} alt="" /></a>
                                </div>
                                <div>
                                  <a href="#"><img src={process.env.PUBLIC_URL + "img/banner/banner2.jpg"} alt="" /></a>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li><a href="#">men</a>
                            <div>
                              <div>
                                <div>
                                  <h3><a href="#">Rings</a></h3>
                                  <ul>
                                    <li><a href="#">Platinum Rings</a></li>
                                    <li><a href="#">Gold Ring</a></li>
                                    <li><a href="#">Silver Ring</a></li>
                                    <li><a href="#">Tungsten Ring</a></li>
                                    <li><a href="#">Sweets</a></li>
                                  </ul>
                                </div>
                                <div>
                                  <h3><a href="#">Bands</a></h3>
                                  <ul>
                                    <li><a href="#">Platinum Bands</a></li>
                                    <li><a href="#">Gold Bands</a></li>
                                    <li><a href="#">Silver Bands</a></li>
                                    <li><a href="#">Silver Bands</a></li>
                                    <li><a href="#">Sweets</a></li>
                                  </ul>
                                </div>
                                <div>
                                  <a href="#"><img src={process.env.PUBLIC_URL + "img/banner/banner3.jpg"} alt="" /></a>
                                </div>
                              </div>

                            </div>
                          </li>
                          <li><a href="#">pages</a>
                            <div>
                              <div>
                                <div>
                                  <h3><a href="#">Column1</a></h3>
                                  <ul>
                                    <li><a href="portfolio.html">Portfolio</a></li>
                                    <li><a href="portfolio-details.html">single portfolio </a></li>
                                    <li><a href="about.html">About Us </a></li>
                                    <li><a href="about-2.html">About Us 2</a></li>
                                    <li><a href="services.html">Service </a></li>
                                    <li><a href="my-account.html">my account </a></li>
                                  </ul>
                                </div>
                                <div>
                                  <h3><a href="#">Column2</a></h3>
                                  <ul>
                                    <li><a href="blog.html">Blog </a></li>
                                    <li><a href="blog-details.html">Blog  Details </a></li>
                                    <li><a href="blog-fullwidth.html">Blog FullWidth</a></li>
                                    <li><a href="blog-sidebar.html">Blog  Sidebar</a></li>
                                    <li><a href="faq.html">Frequently Questions</a></li>
                                    <li><a href="404.html">404</a></li>
                                  </ul>
                                </div>
                                <div>
                                  <h3><a href="#">Column3</a></h3>
                                  <ul>
                                    <li><a href="contact.html">Contact</a></li>
                                    <li><a href="cart.html">cart</a></li>
                                    <li><a href="checkout.html">Checkout  </a></li>
                                    <li><a href="wishlist.html">Wishlist</a></li>
                                    <li><a href="login.html">Login</a></li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>

                          <li><a href="blog.html">blog</a>
                            <div>
                              <div>
                                <ul>
                                  <li><a href="blog-details.html">blog details</a></li>
                                  <li><a href="blog-fullwidth.html">blog fullwidth</a></li>
                                  <li><a href="blog-sidebar.html">blog sidebar</a></li>
                                </ul>
                              </div>
                            </div>
                          </li>
                          <li><a href="contact.html">contact us</a></li>

                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="breadcrumbs_area">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb_content">
                  <ul>
                    <li><a href="index.html">home</a></li>
                    <li><FontAwesomeIcon icon={faAngleRight} /></li>
                    <li>shop</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='pos_home_section'>
            <div className='row pos_home'>
              <div className="col-lg-3 col-md-12">
                <div className="sidebar_widget shop_c">
                  <div className="categorie__titile">
                    <h4>Categories</h4>
                  </div>
                  <div className="layere_categorie">
                    <ul>
                      <li>
                        <input id="acces" type="checkbox" />
                        <label >Accessories<span>(1)</span></label>
                      </li>
                      <li>
                        <input id="dress" type="checkbox" />
                        <label >Dresses <span>(2)</span></label>
                      </li>
                      <li>
                        <input id="tops" type="checkbox" />
                        <label >Tops<span>(3)</span></label>
                      </li>
                      <li>
                        <input id="bag" type="checkbox" />
                        <label >HandBags<span>(4)</span></label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="sidebar_widget color">
                  <h2>Color</h2>
                  <div className="widget_color">
                    <ul>

                      <li><a href="#">Black <span>(10)</span></a></li>

                      <li><a href="#">Orange <span>(12)</span></a></li>

                      <li> <a href="#">Blue <span>(14)</span></a></li>

                      <li><a href="#">Yellow <span>(15)</span></a></li>

                      <li><a href="#">pink <span>(16)</span></a></li>

                      <li><a href="#">green <span>(11)</span></a></li>

                    </ul>
                  </div>
                </div>
                <div className="sidebar_widget price">
                  <h2>Price</h2>
                  <div className="ca_search_filters">

                    <input type="text" name="text" id="amount" />
                    <div id="slider-range"></div>
                  </div>
                </div>
                <div className="sidebar_widget tags  mb-30">
                  <div className="block_title">
                    <h3>popular tags</h3>
                  </div>
                  <div className="block_tags">
                    <a href="#">ipod</a>
                    <a href="#">samsung</a>
                    <a href="#">apple</a>
                    <a href="#">iphone5s</a>
                    <a href="#">superdrive</a>
                    <a href="#">shuffle</a>
                    <a href="#">nano</a>
                    <a href="#">iphone4s</a>
                    <a href="#">canon</a>
                  </div>
                </div>
                <div className="sidebar_widget newsletter mb-30">
                  <div className="block_title">
                    <h3>newsletter</h3>
                  </div>
                  <form action="#">
                    <p>Sign up for your newsletter</p>
                    <input placeholder="Your email address" type="text" />
                    <button type="submit">Subscribe</button>
                  </form>
                </div>
                <div className="sidebar_widget special">
                  <div className="block_title">
                    <h3>Special Products</h3>
                  </div>
                  <div className="special_product_inner mb-20">
                    <div className="special_p_thumb">
                      <a href="single-product.html"><img src={process.env.PUBLIC_URL + "img/cart/cart3.jpg"} alt="" /></a>
                    </div>
                    <div className="small_p_desc">
                      <div className="product_ratting">
                        <ul>
                          <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                          <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                          <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                          <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                          <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                        </ul>
                      </div>
                      <h3><a href="single-product.html">Lorem ipsum dolor</a></h3>
                      <div className="special_product_proce">
                        <span className="old_price">$124.58</span>
                        <span className="new_price">$118.35</span>
                      </div>
                    </div>
                  </div>
                  <div className="special_product_inner">
                    <div className="special_p_thumb">
                      <a href="single-product.html"><img src={process.env.PUBLIC_URL + "img/cart/cart18.jpg"} alt="" /></a>
                    </div>
                    <div className="small_p_desc">
                      <div className="product_ratting">
                        <ul>
                          <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                          <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                          <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                          <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                          <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                        </ul>
                      </div>
                      <h3><a href="single-product.html">Printed Summer</a></h3>
                      <div className="special_product_proce">
                        <span className="old_price">$124.58</span>
                        <span className="new_price">$118.35</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-9 col-md-12'>
                <div className="banner_slider mb-35">
                  <img src={process.env.PUBLIC_URL + "img/banner/bannner10.jpg"} alt="" />
                </div>
                <div className="shop_toolbar mb-35">
                  <div className="list_button">
                    <ul className="nav" role="tablist">
                      <li>
                        <a className="active" data-toggle="tab" href="#large" role="tab" aria-controls="large" aria-selected="true"><FontAwesomeIcon icon={faThLarge} /></a>
                      </li>
                      <li>
                        <a data-toggle="tab" href="#list" role="tab" aria-controls="list" aria-selected="false"><FontAwesomeIcon icon={faThList} /></a>
                      </li>
                    </ul>
                  </div>
                  <div className="page_amount">
                    <p>{listProduct.length < 9 ? `Showing 1-${listProduct.length} of ${listProduct.length} results` : `Showing 1-9 of ${listProduct.length} results`}</p>
                  </div>

                  <div className="select_option">
                    <form action="#" style={{ display: 'flex' }}>
                      <label style={{ width: "100px" }}>Sort By</label>
                      <select name="orderby" id="short">
                        <option selected="" value="1">Position</option>
                        <option value="1">Price: Lowest</option>
                        <option value="1">Price: Highest</option>
                        <option value="1">Product Name:Z</option>
                        <option value="1">Sort by price:low</option>
                        <option value="1">Product Name: Z</option>
                        <option value="1">In stock</option>
                        <option value="1">Product Name: A</option>
                        <option value="1">In stock</option>
                      </select>
                    </form>
                  </div>
                </div>
                <div className="shop_tab_product">
                  <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="large" role="tabpanel">
                      <div className="row">
                        {listProduct ? (
                          <>
                            {listProduct.map((item) => {
                              // Định dạng số theo định dạng tiền tệ Việt Nam (VND)
                              const formattedPrice = new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(item.price);

                              return (
                                <div className="col-lg-4 col-md-6">
                                  <div className="single_product" key={item.id}>
                                    <div className="product_thumb">
                                      <a href="single-product.html"><img src={process.env.PUBLIC_URL + item.linkImage} alt="" /></a>
                                      <div className="img_icone">
                                        <img src={process.env.PUBLIC_URL + "img/cart/span-new.png"} alt="" />
                                      </div>
                                      <div className="product_action">
                                        <a href="#"> <FontAwesomeIcon icon={faShoppingCart} /> Add to cart</a>
                                      </div>
                                    </div>
                                    <div className="product_content">
                                      <span className="product_price">{formattedPrice}</span>
                                      <h3 className="product_title"><a href="single-product.html">{item.name}</a></h3>
                                      <div className="product_ratting">
                                        {item.rateStar == 1 ? "No ratings yet" :
                                          <ul>
                                            <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                                            <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                                            <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                                            <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                                            <li><a href="#"><MyComponent transparency={0.3}></MyComponent></a></li>
                                          </ul>
                                        }
                                        <p>Sold Quantity:{item.soldQuantity}</p>
                                      </div>
                                    </div>
                                    <div className="product_info">
                                      <ul>
                                        <li><a href="#" title=" Add to Wishlist ">Add to Wishlist</a></li>
                                        <li><a href="#" data-toggle="modal" data-target="#modal_box" title="Quick view">View Detail</a></li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <p>Loading Product...</p>
                        )}
                      </div>
                    </div>
                    {/* <div className="tab-pane fade" id="list" role="tabpanel">
                      <div className="product_list_item mb-35">
                        <div className="row align-items-center">
                          <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="product_thumb">
                              <a href="single-product.html"><img src={process.env.PUBLIC_URL + "img/product/product2.jpg"} alt="" /></a>
                              <div className="hot_img">
                                <img src={process.env.PUBLIC_URL + "img/cart/span-hot.png"} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-8 col-md-6 col-sm-6">
                            <div className="list_product_content">
                              <div className="product_ratting">
                                <ul>
                                  <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                                  <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                                  <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                                  <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                                  <li><a href="#"><FontAwesomeIcon icon={faStar} /></a></li>
                                </ul>
                              </div>
                              <div className="list_title">
                                <h3><a href="single-product.html">Lorem ipsum dolor</a></h3>
                              </div>
                              <p className="design"> in quibusdam accusantium qui nostrum consequuntur, officia, quidem ut placeat. Officiis, incidunt eos recusandae! Facilis aliquam vitae blanditiis quae perferendis minus eligendi</p>

                              <p className="compare">
                                <input id="select" type="checkbox" />
                                <label for="select">Select to compare</label>
                              </p>
                              <div className="content_price">
                                <span>$118.00</span>
                                <span className="old-price">$130.00</span>
                              </div>
                              <div className="add_links">
                                <ul>
                                  <li><a href="#" title="add to cart"><FontAwesomeIcon icon={faShoppingCart} aria-hidden="true" /></a></li>
                                  <li><a href="#" title="add to wishlist"><FontAwesomeIcon icon={faHeart} aria-hidden="true" /></a></li>
                                  <li><a href="#" data-toggle="modal" data-target="#modal_box" title="Quick view"><FontAwesomeIcon icon={faEye} aria-hidden="true" /></a></li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className="pagination_style">
                      <div className="item_page">
                        <form action="#">
                          <label for="page_select">Show</label>
                          <select id="page_select">
                            <option value="1">9</option>
                            <option value="2">10</option>
                            <option value="3">11</option>
                          </select>
                          <span>Products by page</span>
                        </form>
                      </div>
                      <div className="page_number">
                        <span>Pages: </span>
                        <ul>
                          <li>«</li>
                          <li className="current_number">1</li>
                          <li><a href="#">2</a></li>
                          <li>»</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer_area">
        <div class="footer_top">
          <div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="footer_widget">
                  <h3>About us</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.</p>
                  <div class="footer_widget_contect">
                    <p><FontAwesomeIcon icon={faMapMarker} />19 Interpro Road Madison, AL
                      35758, USA</p>

                    <p><i class="fa fa-mobile" aria-hidden="true"></i> (012) 234 432 3568</p>
                    <a href="#"><FontAwesomeIcon icon={faEnvelope} /> Contact@plazathemes.com
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="footer_widget">
                  <h3>My Account</h3>
                  <ul>
                    <li><a href="#">Your Account</a></li>
                    <li><a href="#">My orders</a></li>
                    <li><a href="#">My credit slips</a></li>
                    <li><a href="#">My addresses</a></li>
                    <li><a href="#">Login</a></li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="footer_widget">
                  <h3>Informations</h3>
                  <ul>
                    <li><a href="#">Specials</a></li>
                    <li><a href="#">Our store(s)!</a></li>
                    <li><a href="#">My credit slips</a></li>
                    <li><a href="#">Terms and conditions</a></li>
                    <li><a href="#">About us</a></li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="footer_widget">
                  <h3>extras</h3>
                  <ul>
                    <li><a href="#"> Brands</a></li>
                    <li><a href="#"> Gift Vouchers </a></li>
                    <li><a href="#"> Affiliates </a></li>
                    <li><a href="#"> Specials </a></li>
                    <li><a href="#"> Privacy policy </a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer_bottom">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6 col-md-6">
                <div class="copyright_area">
                  <ul>
                    <li><a href="#"> about us </a></li>
                    <li><a href="#"> Customer Service </a></li>
                    <li><a href="#"> Privacy Policy </a></li>
                  </ul>
                  <p>Copyright &copy; 2018 <a href="#">Pos Coron</a>. All rights reserved. </p>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="footer_social text-right">
                  <ul>
                    <li><a href="#">FaceBook</a></li>
                    <li><a href="#">Twitter</a></li>
                    <li><a href="#">Google</a></li>
                    <li><a class="pinterest" href="#">Pinterest</a></li>

                    <li><a href="#"><FontAwesomeIcon icon={faWifi} /></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >

  );
}

export default SearchPage;
