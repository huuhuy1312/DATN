import React, { useEffect, useState } from 'react';
import './RateProduct.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ratesService from '../../../../../services/rates.service';
import itemService from '../../../../../services/item.service';
function RateProduct({ item, setChooseItem }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const [rating, setRating] = useState(0);
    const [images, setImages] = useState([]);
    const [content, setContent] = useState(""); 
    const itemId = 1; 
    const customerId = 1; 
    useEffect(()=>{
        console.log(item)
    },[])
    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setImages(prevImages => [...prevImages, ...files]);
    };

    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('itemId', item?.id);
        formData.append('customerId', user?.id);
        formData.append('content', content);
        formData.append('rateStar', rating);
        formData.append("typeOfProductId",item?.topId)
        images.forEach((image, index) => {
            formData.append('files', image);
        });
        console.log(formData)
        const response = await ratesService.addRate(formData);
        console.log(response);
        if(response.status==200)
        {
            const response2 = await itemService.updateIsRated(item?.id,true);
        }
        setChooseItem(null)
    };

    return (
        <div className="rp-layout">
            <div className="rp-review-container">
                <FontAwesomeIcon 
                    style={{ position: "absolute", right: "1rem", top: "1rem", fontSize: 20, color: "#5883c7" }} 
                    icon={faClose} 
                    onClick={() => { setChooseItem(null) }} 
                />
                <h2 className="rp-title">Đánh giá sản phẩm</h2>
                <div style={{ display: "flex" }}>
                    <div style={{ width: "20%", marginRight: "1rem" }}>
                        <img src={item.image} alt="product" />
                    </div>
                    <div style={{ width: "80%", margin: "auto" }}>
                        <div className="rp-product-name">{item.productName}</div>
                        {(item.label1 || item.label2) && (
                            <div style={{ textAlign: "start", fontSize: 15, fontWeight: 400, color: "rgba(0,0,0,0.4)" }}>
                                {`Phân loại hàng: ${item.label1 || ''}${item.label2 ? `, ${item.label2}` : ''}`}
                            </div>
                        )}
                    </div>
                </div>

                <div className="rp-rating">
                    {[...Array(5)].map((_, index) => (
                        <span
                            key={index}
                            className={`rp-star ${index < rating ? 'filled' : ''}`}
                            onClick={() => handleStarClick(index)}
                        >
                            &#9733;
                        </span>
                    ))}
                </div>

                <div className="rp-uploaded-images">
                    {images.map((image, index) => (
                        <div key={index} className="rp-uploaded-image-container">
                            <img src={URL.createObjectURL(image)} alt={`uploaded-${index}`} className="rp-uploaded-image" />
                            <FontAwesomeIcon 
                                icon={faClose} 
                                className="rp-remove-image" 
                                onClick={() => handleRemoveImage(index)} 
                            />
                        </div>
                    ))}
                </div>

                <div className="rp-media-buttons">
                    <label className="rp-media-button">
                        Thêm Hình ảnh
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleImageUpload} 
                            style={{ display: "none" }}
                        />
                    </label>
                </div>

                <textarea
                    className="rp-review-text"
                    placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này nhé."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>

                <div className="rp-product-quality">
                    <button className="rp-submit-button" onClick={handleSubmit}>Gửi đánh giá</button>
                </div>
            </div>
        </div>
    );
}

export default RateProduct;
