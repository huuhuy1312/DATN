import React, { useEffect, useState } from 'react';
import './ChooseCategory.css';
import categoryServer from '../../../../../services/category.server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
const ChooseCategory = ({setShowChooseCategory,setCategoryChoose}) => {
    const [textSearch,setTextSearch] = useState("");
    const [listCategoryParent,setListCategoryParent] = useState([]);
    const [listSubCategoryParent,setListSubCategoryParent] = useState([]);
    const [listSubSubCategoryParent,setListSubSubCategoryParent] = useState([]);
    const [listSubSubSubCategoryParent,setListSubSubSubCategoryParent] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedSubsubcategory, setSelectedSubsubcategory] = useState(null);
    const [selectedSubsubsubcategory, setSelectedSubsubsubcategory] = useState(null);
    const [finalCategory,setFinalCategory] = useState(null); 
    const getCategoryParent=async ()=>{
        const response = await categoryServer.getParentByCondition(textSearch);
        console.log(response)
        setListCategoryParent(response);
    }
    const getSubCategory = async()=>{
        const response = await categoryServer.getCategoryByIdParent(selectedCategory?.id);
        setListSubCategoryParent(response);
    }
    const getSubSubCategory = async()=>{
        const response = await categoryServer.getCategoryByIdParent(selectedSubcategory?.id);
        setListSubSubCategoryParent(response);
    }
    const getSubSubSubCategory = async()=>{
        const response = await categoryServer.getCategoryByIdParent(selectedSubsubcategory?.id);
        setListSubSubSubCategoryParent(response);
    }
    useEffect(()=>{
        getCategoryParent();
        setSelectedCategory(null);
        setSelectedSubcategory(null)
    },[textSearch])
    
    useEffect(()=>{
        if(selectedCategory!=null)
        {
            getSubCategory();
            
            if(selectedCategory?.countChild == 0)
            {
                selectedSubcategory(null)
                setFinalCategory(selectedCategory)
            }
        }
    },[selectedCategory])

    useEffect(()=>{
        if(selectedSubcategory!=null)
        {
            getSubSubCategory();
            
            if(selectedSubcategory?.countChild == 0)
            {
                setSelectedSubsubcategory(null)
                setFinalCategory(selectedSubcategory)
            }
        }
    },[selectedSubcategory])

    useEffect(()=>{
        if(selectedSubsubcategory!=null)
        {
            getSubSubSubCategory();
            
            if(selectedSubsubcategory?.countChild == 0)
            {
                setSelectedSubsubsubcategory(null)
                setFinalCategory(selectedSubsubcategory)
            }
        }
    },[selectedSubsubcategory])
    useEffect(()=>{
        console.log(listSubCategoryParent)
    },[listSubCategoryParent])
    const handleSubmit =() =>{
        setShowChooseCategory(false)
        setCategoryChoose(finalCategory)
    }
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <h2 style={{color:"#3498db"}}>Chỉnh sửa ngành hàng</h2>
                    <span className="close-btn">&times;</span>
                </div>
                <div className="popup-search">
                    <input type="text" placeholder="Vui lòng nhập tối thiểu 1 ký tự..." onChange={(e)=>setTextSearch(e.target.value)} value={textSearch}/>
                </div>
                <div className="popup-categories">
                    <div className="category-column">
                        <ul>
                            {listCategoryParent.map((category, index) => (
                                <li
                                    key={index}
                                    className={selectedCategory?.id === category.id ? 'selected' : ''}
                                    onClick={() => setSelectedCategory(category)}
                                    style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}
                                >
                                    <div>{category.name}</div>
                                    {category.countChild>0 &&<FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="subcategory-column">
                        <ul>

                            {listSubCategoryParent.map((subcategory, index) => (
                                <li
                                    key={index}
                                    className={selectedSubcategory?.id === subcategory.id ? 'selected' : ''}
                                    onClick={() => setSelectedSubcategory(subcategory)}
                                    style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}
                                >
                                    <div>{subcategory.name}</div>
                                    {subcategory.countChild>0 &&<FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="subsubcategory-column">
                        <ul>
                            {listSubSubCategoryParent.map((subcategory, index) => (
                                    <li
                                        key={index}
                                        className={selectedSubsubcategory?.id === subcategory.id ? 'selected' : ''}
                                        onClick={() => setSelectedSubsubcategory(subcategory)}
                                        style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}
                                    >
                                        <div>{subcategory.name}</div>
                                        {subcategory.countChild>0 &&<FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>}
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div className="subsubcategory-column">
                        <ul>
                            {['Kính mắt', 'Gọng kính', 'Hộp kính và phụ kiện', 'Khác'].map((subsubcategory, index) => (
                                <li
                                    key={index}
                                    className={selectedSubsubcategory === subsubcategory ? 'selected' : ''}
                                    onClick={() => setSelectedSubsubcategory(subsubcategory)}
                                >
                                    {subsubcategory}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="popup-footer">
                    <span>{`Đã chọn: ${selectedCategory?.name} > ${selectedSubcategory?.name} > ${selectedSubsubcategory?.name}`}</span>
                    {finalCategory !=null && <div>{finalCategory?.name}</div>}
                    <button className="cancel-btn" onClick={()=>setShowChooseCategory(false)}>Hủy</button>
                    <button className="confirm-btn" onClick={()=>{handleSubmit()}}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default ChooseCategory;
