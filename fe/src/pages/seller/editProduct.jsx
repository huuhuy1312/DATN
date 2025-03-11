import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import "../../css/seller/main.css"
import CurrencyInput from 'react-currency-input-field';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import TypeOfProduct from "../../entities/typeOfProduct.ts";
import axios from "axios";
import RichTextEditor from "./components/RichTextEditor.jsx";
import ChooseCategory from "../sellerPage/add_product_page/component/choose_category/ChooseCategory.jsx";
import productService from "../../services/product.service.js";
function EditProductPage() {
    const { id } = useParams();
    const [showForm, setShowForm] = useState(null);
    const [titleNumber, setTitleNumber]=useState(0);
    const [categories, setCategories] = useState(null);
    const [nameNewCategory, setNameNewCategory] = useState(null);
    const [suppliers, setSuppliers] = useState(null);
    const [nameNewSupplier, setNameNewSupplier] = useState(null);
    const [oldImageList,setOldImageList] = useState([]);
    const [imageInput, setImageInput] = useState([]);
    const [cntError, setCntError] = useState(0);
    const [label1s, setLabel1s] = useState(['']);
    const [label2s, setLabels2] = useState(['']);
    const [title1, setTitle1] = useState(null)
    const [title2, setTitle2] = useState(null)
    const [nameProductInput,setNameProductInput] = useState("");
    const [categoryChoose,setCategoryChoose]= useState(null);
    const [supplierInput,setSupplierInput]= useState(null);
    const [priceInput,setPriceInput]= useState(null);
    const [costInput,setCostInput]= useState(null);
    const [quantityInput,setQuantityInput]= useState(0);
    const [originalPriceInput,setOriginalPriceInput]= useState(0);
    const [weightInput,setWeightInput]= useState(0);
    const [imageLabel1s,setImageLabel1s]= useState([]);
    const [editorContent, setEditorContent] = useState('');
    const [TOPInfos,setTOPInfos] = useState([]);
    const [TOPInfosTitle2Null,setTOPInfosTitle2Null] = useState([]);
    const[userInfo,setUserInfo] = useState(null);
    const [showChooseCategory,setShowChooseCategory] = useState(false);
    const [initialDescription,setinitialDescription] = useState(null)
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user)
        if(user){
            setUserInfo(user);
        }
    },[])
    function groupByLabel1(data) {
        const result = [];
      
        // Nhóm dữ liệu theo label1
        data.forEach(item => {
          // Tìm kiếm nhóm tương ứng với label1
          const index = result.findIndex(group => group[0].label1 === item.label1);
      
          // Nếu nhóm chưa có, tạo một nhóm mới
          if (index === -1) {
            result.push([item]);
          } else {
            // Nếu nhóm đã có, thêm item vào nhóm đó
            result[index].push(item);
          }
        });
      
        return result;
      }

    const getProductDefault=async ()=>{
        const response = await productService.getProductById(id);
        console.log(response);
        setNameProductInput(response.name)
        setEditorContent(response.description)
        setOldImageList(response.imageProducts)
        setCategoryChoose(response.category)
        setSupplierInput(response.supplier.id)
        setinitialDescription(response.description)
        if(response.title1 == null && response.title2 == null )
        {
            setPriceInput(response.typeOfProducts[0].price)
            setOriginalPriceInput(response.typeOfProducts[0].originalPrice)
            setQuantityInput(response.typeOfProducts[0].quantity)
            setWeightInput(response.typeOfProducts[0].weight)
            setCostInput(response.typeOfProducts[0].cost)
        }else if(response.title1 !=null && response.title2 ==null)
        {
            setTitle1(response.title1)
            setTitleNumber(1)
            setLabel1s([...response.listLabel1,""])
            const imageContentList = response.imageClassifications.map(
                (classification) => classification.image.content
              );
              setImageLabel1s(imageContentList);
            console.log(response.typeOfProducts)
            setTOPInfosTitle2Null(response.typeOfProducts)
        }else{
            setTitle1(response.title1)
            setTitle2(response.title2)
            setTitleNumber(2)
            setLabels2([...response.listLabel2,""])
            setLabel1s([...response.listLabel1,""])
            const imageContentList = response.imageClassifications.map(
                (classification) => classification.image.content
              );
              setImageLabel1s(imageContentList);

            setTOPInfos(groupByLabel1(response.typeOfProducts))
        }
    }
    useEffect(()=>{
        getProductDefault()
    },[])
    // Convert image to base64
    const handleImageChange = (event) => {
        console.log("da vao");
        return new Promise((resolve, reject) => {
            const file = event.target.files[0];
            if (!file) {
                reject("No file selected");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target.result;
                
                resolve(base64Image);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    };
    //Get categories
    const getCategoris = async () => {
        try {
            const response = await fetch("http://localhost:8083/api/category/all-child", {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error("Network reponse was not ok");
            }
            const data = await response.json();
            setCategories(data);

        } catch (error) {
            console.error(error)
        }
    }
    const deleteImageProduct = (index) => {
        console.log(index)
        // Tạo một bản sao của mảng imageInput
        const updatedImageInput = [...imageInput];
        // Xóa phần tử ở vị trí index
        updatedImageInput.splice(index, 1);
        // Cập nhật mảng imageInput mới
        setImageInput(updatedImageInput); // Giả sử setImageInput là hàm để cập nhật state
    }
    //Add categories
    const addCategory = async () => {
        if (nameNewCategory !== null) {
            try {
                const response = await fetch(`http://localhost:8083/api/category/add?nameCategory=${nameNewCategory}`, {
                    method: "POST",
                });
                if (response.ok) {
                    const data = await response.text();
                    getCategoris();
                } else {
                    const errorText = await response.text();
                    console.error(errorText);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
    const handleButtonClick = (e) => {
        e.preventDefault();
        setTitleNumber(2);
    };      
    //Get suppliers
    const getSupplier = async () => {
        try {
            const response = await fetch("http://localhost:8083/api/supplier/all", {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error("Network reponse was not ok");
            }
            const data = await response.json();
            setSuppliers(data);

        } catch (error) {
            console.error(error)
        }
    }
    //Add Supllier
    const addSupplier = async () => {
        if (nameNewSupplier !== null) {
            try {
                const response = await fetch(`http://localhost:8083/api/supplier/add?nameSupplier=${nameNewSupplier}`, {
                    method: "POST",
                });
                if (response.ok) {
                    const data = await response.text();
                    console.log(data);
                    getSupplier();
                } else {
                    const errorText = await response.text();
                    console.error(errorText);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
    useEffect(()=>{
        console.log(label1s)
    },[label1s])
    useEffect(()=>{
        console.log(label2s)
    },[label2s])
    useEffect(() => {
        setCntError(document.getElementsByClassName("error").length)
        getCategoris();
        getSupplier();
    }, [])
    const handleLabel1Change = (index, event) => {
        const values = [...label1s];
        values[index] = event.target.value;
        setCntError(document.getElementsByClassName("error").length)
        const position = label1s.findIndex(item => item === values[index]);
        setLabel1s(values);
        if (event.target.value !== '' && index === values.length - 1) {
            setLabel1s([...values, '']);
        }
        
    };
    const handleDelete = (index) => {
        const values = [...label1s];
        values.splice(index, 1);
        setLabel1s(values);
    };
    const handleLabel2Change = (index, event) => {
        const values = [...label2s];
        values[index] = event.target.value;
        setLabels2(values);
        if (event.target.value !== '' && index === values.length - 1) {
            setLabels2([...values, '']);
        }
    };
    const handleDelete2 = (index) => {
        const values = [...label2s];
        values.splice(index, 1);
        setLabels2(values);
    }
    useEffect(()=>{
        console.log(imageLabel1s)
    },[imageLabel1s])
    ///Change TopInfo
        //Image
        const handleImagelabel1Change=async (e, index1)=>{
            let base64Image= await handleImageChange(e);
            let imageArr = [...imageLabel1s];
            imageArr[index1]=base64Image
            setImageLabel1s(imageArr)
        }
        useEffect(()=>{
            console.log(TOPInfos)
        },[TOPInfos])
        useEffect(()=>{
            console.log(TOPInfosTitle2Null)
        },[TOPInfosTitle2Null])
        //Price
        const handleInfoTOPChange = (value, index1, index2, type) => {
            let TOPInfoTmp = [...TOPInfos];
          
            // Kiểm tra xem hàng index1 đã tồn tại chưa, nếu chưa khởi tạo hàng mới
            if (!TOPInfoTmp[index1]) {
              TOPInfoTmp[index1] = [];
            }
          
            // Kiểm tra xem ô index2 trong hàng index1 đã tồn tại chưa, nếu chưa khởi tạo ô mới
            if (!TOPInfoTmp[index1][index2]) {
              TOPInfoTmp[index1][index2] = {};
            }
          
            // Gán giá trị cho thuộc tính type
            TOPInfoTmp[index1][index2][type] = value;
          
            // Cập nhật state
            setTOPInfos(TOPInfoTmp);
        };
        const handleInfoTOPChangeTitle2Null = (value, index1, type) => {
            let TOPInfoTmp = [...TOPInfosTitle2Null];
            if (!TOPInfoTmp[index1]) {
              TOPInfoTmp[index1] ={};
            }
            TOPInfoTmp[index1][type] = value;
            console.log(TOPInfoTmp)
            setTOPInfosTitle2Null(TOPInfoTmp);
        };
    useEffect(()=>{
        console.log(editorContent)
    },[editorContent])
    useEffect(()=>{
        console.log(label2s)
    },[label2s])
    const handleRenderClassfications=()=>{
        const rows = [];
            for (let i = 0; i < label1s.length-1; i++) {
            const value1 = label1s[i];
            if(title2!==null)
                {
                    for (let j = 0; j < label2s.length-1; j++) {
                        const value2 = label2s[j];
                        rows.push(
                            <tr class= "info_classification" key={`${i}-${j}`}>
                                {j === 0 && (
                                    <td rowSpan={label2s.length-1} >
                                    <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                                        <div style={{textTransform:"capitalize"}}>{value1}</div>
                                        <img src={imageLabel1s[i]?.image?.content || imageLabel1s[i]} style={{maxWidth:100}}></img>
                                        <input type="file" style={{ width: "100%" }} accept="image/*" onChange={(e)=>handleImagelabel1Change(e,i)}/>
                                    </div>
                                    </td>
                                )}
                                <td><div style={{textTransform:"capitalize"}}>{value2}</div></td>
                                <td>
                                <CurrencyInput intlConfig={{ locale: 'vi-VN', currency: 'VND' }}  onValueChange={(value)=>handleInfoTOPChange(value,i,j,"originalPrice")} value={TOPInfos[i]?.[j]?.originalPrice || 0}
                                />                                                                                    
                                </td>
                                <td>
                                <CurrencyInput
                                    intlConfig={{ locale: 'vi-VN', currency: 'VND' }} onValueChange={(value)=>handleInfoTOPChange(value,i,j,"price")} value={TOPInfos[i]?.[j]?.originalPrice || 0}

                                />
                                </td>
                                <td>
                                <CurrencyInput intlConfig={{ locale: 'vi-VN', currency: 'VND' }}  onValueChange={(value)=>handleInfoTOPChange(value,i,j,"cost")} value={TOPInfos[i]?.[j]?.originalPrice || 0}
                                />                                                                                    
                                </td>
                                <td>
                                    <input type="number" min={0} onChange={(e)=>handleInfoTOPChange(e.target.value,i,j,"weight")} value={TOPInfos[i]?.[j]?.originalPrice || 0}
                                    />
                                </td>
                                <td>
                                    <input className="form-control" type="number" min={0} onChange={(e)=>handleInfoTOPChange(e.target.value,i,j,"quantity")} value={TOPInfos[i]?.[j]?.originalPrice || 0}
                                    />
                                </td>
                            </tr>
                            
                        );
                    }
                }
                else{
                    rows.push(
                            
                        <tr class= "info_classification" key={`${i}-${0}`}>
                            <td  >
                                <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                                    <div style={{textTransform:"capitalize"}}>{value1}</div>
                                    <img style={{maxWidth:100}} src={imageLabel1s[i]?.image?.content || imageLabel1s[i]}></img>
                                    <input type="file" style={{ width: "100%" }} accept="image/*" onChange={(e)=>handleImagelabel1Change(e,i)}/>
                                </div>
                            </td>
                            <td style={{display:"none"}}>null</td>
                            
                            <td>
                            <CurrencyInput
                                intlConfig={{ locale: 'vi-VN', currency: 'VND' }} onValueChange={(value)=>handleInfoTOPChangeTitle2Null(value,i,"originalPrice")} value={TOPInfosTitle2Null[i]?.originalPrice}
                            />
                            </td>
                            <td>
                            <CurrencyInput
                                intlConfig={{ locale: 'vi-VN', currency: 'VND' }} onValueChange={(value)=>handleInfoTOPChangeTitle2Null(value,i,"price")} value={TOPInfosTitle2Null[i]?.price}
                            />
                            </td>
                            <td>
                            <CurrencyInput intlConfig={{ locale: 'vi-VN', currency: 'VND' }} onValueChange={(value)=>handleInfoTOPChangeTitle2Null(value,i,"cost")} value={TOPInfosTitle2Null[i]?.cost}/>                                                                                    
                            </td>
                            
                            <td>
                                <input className="form-control" type="number" min={0} onChange={(e)=>handleInfoTOPChangeTitle2Null(e.target.value,i,"weight")} value={TOPInfosTitle2Null[i]?.weight}/>
                            </td>
                            <td>
                                <input className="form-control" type="number" min={0} onChange={(e)=>handleInfoTOPChangeTitle2Null(e.target.value,i,"quantity")} value={TOPInfosTitle2Null[i]?.quantity}/>
                            </td>

                        </tr>
                        
                        );
                }   
            }
        return rows;
    }
    useEffect(() => {
        
          
    }, [label1s,label2s])
    
    const handleImageInput=async (e)=>{
        const base64Image = await handleImageChange(e);
        let arrImage = [...imageInput];
        arrImage.push(base64Image);
        setImageInput(arrImage);
    }
    const addProduct = async () => {
        let product = new FormData();
        product.append("id",id);
        product.append('name',nameProductInput);
        product.append('categoryId',categoryChoose?.id);
        product.append('supplierId',supplierInput);
        product.append('sellerId',userInfo?.id);
        
        if(initialDescription!= editorContent)
        {
            const descriptionBlob = new Blob([editorContent], { type: 'text/html;charset=utf-8' })
            const descriptionFile = new File([descriptionBlob], "description.html", { type: "text/html" });
            product.append('description', descriptionFile);
        }
        if(titleNumber == 0){
            const top = new TypeOfProduct(null,null,null,quantityInput,priceInput,costInput,originalPriceInput,weightInput);
            product.append('listTypeOfProduct', JSON.stringify([top]));
        }else{
            product.append('title1',title1);
            imageLabel1s.forEach((value,index)=>{
                const byteCharacters = atob(value.split(",")[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for(let i=0;i<byteCharacters.length;i++){
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const byteArrayBlob = new Blob([byteArray],{type:"image/png"});
                const imageClassFile = new File([byteArrayBlob],`image${index}.png`,{type:"image/png"});
                product.append("imageLabel1s",imageClassFile);
            })
            
            if(titleNumber ==1)
            {
                let listTOP=[];
                for(let i=0;i<TOPInfosTitle2Null.length;i++)
                {
                    const TOPTmp = new TypeOfProduct(null,label1s[i],null,TOPInfosTitle2Null[i]["quantity"],TOPInfosTitle2Null[i]["price"],TOPInfosTitle2Null[i]["cost"],TOPInfosTitle2Null[i]["originalPrice"],TOPInfosTitle2Null[i]["weight"])
                    listTOP.push(TOPTmp)
                }
                product.append('listTypeOfProduct',JSON.stringify(listTOP))
            }else if(titleNumber ==2)
            {
                product.append('title2', title2);
                let listTOP=[]
                for(let i=0;i<TOPInfos.length;i++)
                {
                    for(let j=0;j<TOPInfos[i].length;j++)
                    {
                        const TOPTmp = new TypeOfProduct(null,label1s[i],label2s[j],TOPInfos[i][j]["quantity"],TOPInfos[i][j]["price"],TOPInfos[i][j]["cost"],TOPInfos[i][j]["originalPrice"],TOPInfos[i][j]["weight"])
                        listTOP.push(TOPTmp)
                    }
                }
                product.append('listTypeOfProduct',JSON.stringify(listTOP))
            }
            
            
        }
        imageInput.forEach((value, index) => {
            const byteCharacters = atob(value.split(',')[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const imageProductBlob = new Blob([byteArray], { type: "image/png" });
                const imageProductFile = new File([imageProductBlob], `image${index}.png`, { type: "image/png" });
                product.append("imageProducts",imageProductFile)
        });
        for (let [key, value] of product.entries()) {
            console.log(`${key}: ${value}`);
        }
        try {
            // Send product FormData
            console.log(product)
            const response = await axios.post('http://localhost:8083/api/product/update', product, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    const handlePriceInputChange = (value) => {
        
        console.log(value)
        setPriceInput(value)
    };
    const handleOriginalPriceInputChange = (value) => {
        
        console.log(value)
        setOriginalPriceInput(value)
    };
    useEffect(()=>{
        console.log(titleNumber)
    },[titleNumber])
    useEffect(()=>{
        console.log(title2)
    },[title2])
    useEffect(()=>{
        console.log(title1)
    },[title1])
    return (
        <div>
            
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css" />
            <link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css" />
            <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css" />
            <body className="app sidebar-mini rtl">
                {showChooseCategory == true && <ChooseCategory setShowChooseCategory={setShowChooseCategory} setCategoryChoose= {setCategoryChoose}/>}
                <header className="app-header">
                    <a className="app-sidebar__toggle" href="#" data-toggle="sidebar"
                        aria-label="Hide Sidebar"></a>
                    <ul className="app-nav">
                        <li><a className="app-nav__item" href="/index.html"><i className='bx bx-log-out bx-rotate-180'></i> </a>

                        </li>
                    </ul>
                </header>
                <div className="app-sidebar__overlay" data-toggle="sidebar"></div>
                <main className="app-content">
                    
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tile">
                                <h3 className="tile-title">Thêm sản phẩm mới</h3>
                                <div className="tile-body">
                                    <div className="row element-button">
                                        <div className="col-sm-2">
                                            <a className="btn btn-add btn-sm" onClick={() => setShowForm("supplier")}><i
                                                className="fas fa-folder-plus"></i> Thêm nhà cung cấp</a>
                                        </div>
                                        <div className="col-sm-2">
                                            <a className="btn btn-add btn-sm" onClick={() => setShowForm("category")} data-toggle="modal" data-target="#adddanhmuc"><i
                                                className="fas fa-folder-plus"></i> Thêm danh mục</a>
                                        </div>
                                    </div>
                                    <form className="row">
                                        <div className="form-group col-md-4">
                                            <label className="control-label">Tên sản phẩm </label>
                                            <input
                                                className="form-control name_product"
                                                type="text"
                                                onChange={(e)=>setNameProductInput(e.target.value)}
                                                value={nameProductInput}
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label className="control-label">Danh mục</label>
                                            <button className="form-control category_input" id="exampleSelect1" onClick={(e)=> {e.preventDefault();setShowChooseCategory(true)}}> 
                                                {categoryChoose == null ?`-- Chọn danh mục --`: categoryChoose.name}
                                            </button>

                                        </div>
                                        <div className="form-group col-md-4 ">
                                            <label className="control-label">Nhà cung cấp</label>
                                            <select className="form-control supplier_input" id="exampleSelect1" onChange={(e)=>setSupplierInput(e.target.value)} value={supplierInput}>
                                                <option key={-1} value={-1}>-- Chọn nhà cung cấp --</option>
                                                {
                                                    suppliers && suppliers.map(supplier => (
                                                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group-add-product col-md-12" style={{marginBottom:10}}>
                                            <div style={{display:"flex"}}>
                                                {
                                                imageInput.map((value, index) => (
                                                    <div style={{width: `${100 / (imageInput.length+oldImageList.length)}%`, maxWidth:300, position:"relative", padding:"15px 30px", border: '2px solid black'}}>
                                                        <img key={index} src={value} alt={`image-${index}`} style={{paddingBottom:35,objectFit:"contain"}} />
                                                        <FontAwesomeIcon icon={faTrash} onClick={()=>deleteImageProduct(index)}style={{position:"absolute", right:"0%",bottom:"3%",borderTop: '2px solid black', width:"100%",paddingTop:5}}/>
                                                    </div>
                                                    

                                                ))
                                                }
                                                {
                                                oldImageList.map((value, index) => (
                                                    <div style={{width: `${100 / (imageInput.length+oldImageList.length)}%`, maxWidth:300, position:"relative", padding:"15px 30px", border: '2px solid black'}}>
                                                        <img key={index} src={value.content} alt={`image-${index}`} style={{paddingBottom:35,objectFit:"contain"}} />
                                                        <FontAwesomeIcon icon={faTrash} onClick={()=>deleteImageProduct(index)}style={{position:"absolute", right:"0%",bottom:"3%",borderTop: '2px solid black', width:"100%",paddingTop:5}}/>
                                                    </div>
                                                    

                                                ))
                                                }
                                            </div>
                                            <label className="control-label">Ảnh sản phẩm</label>
                                            <div id="myfileupload">
                                            <input type="file" onChange={(e)=>handleImageInput(e)} accept="image/*" />
                                            </div>
                                            <div id="thumbbox" style={{marginBottom:5}}>
                                                <img height="450" width="400" alt="Thumb image" id="thumbimage" style={{ display: "none" }} />
                                                <a className="removeimg" ></a>
                                            </div>
                                            <div id="boxchoice">
                                                <a className="Choicefile"><i className="fas fa-cloud-upload-alt"></i> Chọn ảnh</a>
                                                <p style={{ clear: "both" }}></p>
                                            </div>

                                        </div>
                                        <div className="form-group col-md-12">
                                            <label className="control-label">Mô tả sản phẩm</label>
                                            <RichTextEditor
                                                editorContent={editorContent}
                                                setEditorContent={setEditorContent}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tile">
                                <h3 className="tile-title">Thông tin bán hàng</h3>
                                <div className="tile-body">
                                    <form className="row">
                                        <div style={{ width: "100%" }}>
                                            
                                            <div className="classification" style={{ width: "100%", padding: "5px ", margin: "auto", position: "relative",border:"none"}}>
                                                {titleNumber === 0 ? (
                                                    <>
                                                        <div style={{ display: "flex", margin: "10px 0px" }}>
                                                            <label className="col-md-1">Giá nhập:</label>
                                                            <CurrencyInput
                                                                className="col-md-3 cost_input"
                                                                style={{ "backgroundColor": "#f1f1f1" }}
                                                                intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                                                                defaultValue={null}
                                                                value={costInput}
                                                                onValueChange={(value, name) => setCostInput(value)}
                                                            />
                                                        </div>
                                                        <div style={{ display: "flex", margin: "10px 0px" }}>
                                                            <label className="col-md-1">Giá bán:</label>
                                                            <CurrencyInput
                                                                className="col-md-3 cost_input"
                                                                style={{ "backgroundColor": "#f1f1f1" }}
                                                                intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                                                                defaultValue={null}
                                                                value={priceInput}
                                                                onValueChange={(value) => handlePriceInputChange(value)}
                                                            />
                                                        </div>
                                                        <div style={{ display: "flex", margin: "10px 0px" }}>
                                                            <label className="col-md-1">Giá nguyên bản:</label>
                                                            <CurrencyInput
                                                                className="col-md-3 cost_input"
                                                                style={{ "backgroundColor": "#f1f1f1" }}
                                                                intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                                                                defaultValue={null}
                                                                value={originalPriceInput}
                                                                onValueChange={(value) => handleOriginalPriceInputChange(value)}
                                                            />
                                                        </div>
                                                        <div style={{ display: "flex", margin: "10px 0px" }}>
                                                            <label className="col-md-1">Kho hàng:</label>
                                                            <input className="form-control col-md-3 quantity_input" type="number" min={0} value={quantityInput} onChange={(e)=>setQuantityInput(e.target.value)}/>
                                                        </div>
                                                        <div style={{ display: "flex", margin: "10px 0px" }}>
                                                            <label className="col-md-1">Cân nặng:</label>
                                                            <input className="form-control col-md-3 quantity_input" type="number" min={0} value={weightInput} onChange={(e)=>setWeightInput(e.target.value)}/>
                                                        </div>

                                                        <button className="col-md-6" style={{ fontSize: "20px" }} onClick={() => {setTitleNumber(1)}}> + Thêm nhóm phân loại</button>
                                                    </>
                                                ) : (
                                                    <div>
                                                        <div style={{display:"flex"}}>
                                                            <div style={{ fontFamily: "sans-serif", fontSize: "15px",width:"15%" }}>Phân loại hàng</div>
                                                            <div style={{width:"85%"}}>
                                                                <div style={{ backgroundColor: "#f6f6f6", marginBottom: "5px",position:"relative",borderRadius:5,padding:20 }}>
                                                                    <FontAwesomeIcon icon={faXmark} style={{ position: "absolute", right: "3%",top:"3%", fontSize: "20px" }} onClick={() => { setTitleNumber(0);setTitle1("") }} />
                                                                    <div className="form-group classification-1" style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                                        <label className="control-label col-md-3" style={{ fontWeight: 400, margin: 0, flexShrink: 0 }}>Phân loại 1</label>
                                                                        <input className="form-control col-md-4" onChange={(e) => { setTitle1(e.target.value) }} value={title1} style={{ height: 35 }} type="text" />
                                                                    </div>
                                                                    <div style={{ display: "flex",width:"100%",padding:0}}>
                                                                        <label className="control-label col-md-3" style={{fontWeight: 400}}>Phân loại hàng</label>
                                                                        <div className="col-md-9" style={{display:"flex",padding:0,flexWrap:"wrap"}}>
                                                                            {label1s.map((value, index) => (
                                                                                <div key={index} className="form-group classification-2 col-md-6" style={{padding:0}}>
                                                                                    <div className="classification_child" style={{ display: "flex",padding:0 }}>
                                                                                        <input
                                                                                            className="form-control col-md-6"
                                                                                            type="text"
                                                                                            value={value}
                                                                                            onChange={(event) => handleLabel1Change(index, event)}
                                                                                            style={{height: 35}}
                                                                                        />
                                                                                        {index < label1s.length - 1 && (
                                                                                            <FontAwesomeIcon
                                                                                                icon={faTrash}
                                                                                                className="col-md-1"
                                                                                                style={{ alignSelf: "center", fontSize: "20px", marginLeft: "10px", cursor: 'pointer' }}
                                                                                                onClick={() => handleDelete(index)}
                                                                                            />
                                                                                        )}
                                                                                        {label1s.findIndex(item => item === label1s[index]) !== index && (
                                                                                            <span className="col-md-4 error" style={{ color: 'red', alignSelf: "center" }}>Giá trị trùng lặp</span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {titleNumber ==2 ? (
                                                                    <div style={{ backgroundColor: "#f6f6f6", marginBottom: "5px", position: "relative", borderRadius: 5, padding: 20 }}>
                                                                    <FontAwesomeIcon icon={faXmark} style={{ position: "absolute", right: "3%", top: "3%", fontSize: "20px" }} onClick={() => { setTitle2(null); setTitleNumber(1); }} />
                                                                    <div className="form-group classification-1" style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                                        <label className="control-label col-md-3" style={{ fontWeight: 400, margin: 0, flexShrink: 0 }}>Phân loại 2</label>
                                                                        <input className="form-control col-md-4" type="text" onChange={(e) => { setTitle2(e.target.value); }} value={title2} style={{ height: 35 }} />
                                                                    </div>
                                                                    <div style={{ display: "flex", width: "100%", padding: 0 }}>
                                                                        <label className="control-label col-md-3" style={{ fontWeight: 400 }}>Phân loại hàng</label>
                                                                        <div className="col-md-9" style={{ display: "flex", padding: 0, flexWrap: "wrap" }}>
                                                                            {label2s.map((value, index) => (
                                                                                <div key={index} className="form-group classification-2 col-md-6" style={{ padding: 0 }}>
                                                                                    <div className="classification_child" style={{ display: "flex", padding: 0 }}>
                                                                                        <input
                                                                                            className="form-control col-md-6"
                                                                                            type="text"
                                                                                            value={value}
                                                                                            onChange={(event) => handleLabel2Change(index, event)}
                                                                                            style={{ height: 35 }}
                                                                                        />
                                                                                        {index < label2s.length - 1 && (
                                                                                            <FontAwesomeIcon
                                                                                                icon={faTrash}
                                                                                                className="col-md-1"
                                                                                                style={{ alignSelf: "center", fontSize: "20px", marginLeft: "10px", cursor: 'pointer' }}
                                                                                                onClick={() => handleDelete2(index)}
                                                                                            />
                                                                                        )}
                                                                                        {label2s.findIndex(item => item === label2s[index]) !== index && (
                                                                                            <span className="col-md-4 error" style={{ color: 'red', alignSelf: "center" }}>Giá trị trùng lặp</span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                

                                                                ) : (
                                                                    <button 
                                                                        className="col-md-6" 
                                                                        style={{ fontSize: "15px" }} 
                                                                        onClick={handleButtonClick}
                                                                        >
                                                                        + Thêm nhóm phân loại 2
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="classification-table" style={{display:"flex"}}>
                                                            <div style={{width:"15%"}}>Danh sách phân loại</div>
                                                            <table style={{width:"85%"}}>
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{width:"15%"}}>{title1==null?"Phân loại 1":title1}</th>
                                                                        {title2 && <th style={{width:"15%"}}>{title2==null?"Phân loại 1":title2}</th>}
                                                                        <th style={{width:"14%"}}>Giá nguyên bản</th>
                                                                        <th style={{width:"14%"}}>Giá bán</th>
                                                                        <th style={{width:"14%"}}>Giá nhập</th>
                                                                        <th style={{width:"14%"}}>Cân nặng</th>
                                                                        <th>Kho hàng</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        handleRenderClassfications()
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    </form>
                                </div>
                                <div style={{display:"flex", justifyContent:"space-around"}}>
                                    <button style={{fontSize:"14px"}} className="btn btn-save" type="button" onClick={addProduct}>Lưu lại</button>
                                    <button style={{fontSize:"14px"}} className="btn btn-cancel" >Hủy bỏ</button>
                                </div>
                            </div>
                        </div>
                    </div >
                    
                </main >
                <div className={`modal fade ${showForm === "supplier" ? "show" : ""}`} id="exampleModalCenter" role="dialog" aria-labelledby="exampleModalCenterTitle"
                    data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className="form-group  col-md-12">
                                        <span className="thong-tin-thanh-toan">
                                            <h5>Thêm mới nhà cung cấp</h5>
                                        </span>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="control-label">Nhập tên nhà cung cấp mới</label>
                                        <input className="form-control" type="text" required onChange={(e) => { setNameNewSupplier(e.target.value) }} />
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="control-label">Nhà cung cấp hiện đang có</label>
                                        <ul style={{ paddingLeft: "20px" }}>

                                            {suppliers && suppliers.map(supplier => (
                                                <li key={supplier.id} style={{ listStyle: "inside" }}>{supplier.name}</li>
                                            ))}

                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn btn-save" onClick={addSupplier} type="button">Lưu lại</button>
                                    <a className="btn btn-cancel" onClick={() => setShowForm(null)}>Hủy bỏ</a>
                                </div>
                                <div className="modal-footer"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <form className="row">
                                                            <div style={{ width: "100%" }}>
                                                                <div style={{ fontFamily: "sans-serif", fontWeight: "700", fontSize: "20px", marginLeft: "30px", marginBottom: "10px" }}>Phân loại 1</div>
                                                                <div className="classification" style={{ backgroundColor: "#f6f6f6", width: "95%", margin: "auto", display: "flex" }}>
                                                                    <div className="form-group col-md-3" >
                                                                        <label className="control-label">Giá bán</label>
                                                                        <CurrencyInput intlConfig={{ locale: 'vi-VN', currency: 'VND' }} onValueChange={(value) => { setPriceInput(value) }} />
                                                                    </div>
                                                                    <div className="form-group col-md-3">
                                                                        <label className="control-label">Giá vốn</label>
                                                                        <CurrencyInput intlConfig={{ locale: 'vi-VN', currency: 'VND' }} onValueChange={(value) => { setCostInput(value) }} />
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label className="control-label">Ảnh sản phẩm</label>
                                                                        <div id="myfileupload">
                                                                            <input type="file" onChange={handleImageChange} accept="image/*" />
                                                                        </div>
                                                                        <div id="thumbbox">
                                                                            <img height="450" width="400" alt="Thumb image" id="thumbimage" style={{ display: "none" }} />
                                                                            <a className="removeimg" ></a>
                                                                        </div>
                                                                        <div id="boxchoice">
                                                                            <a className="Choicefile"><i className="fas fa-cloud-upload-alt"></i> Chọn ảnh</a>
                                                                            <p style={{ clear: "both" }}></p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group col-md-2">
                                                                        <label className="control-label">Số lượng</label>
                                                                        <input className="form-control" type="number" min={0} />
                                                                    </div>
                                                                </div>
                                                            </div>


                                                        </form> */}
                <div className={`modal fade ${showForm === "category" ? "show" : ""}`} id="adddanhmuc" role="dialog" aria-labelledby="exampleModalCenterTitle"
                    data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className="form-group  col-md-12">
                                        <span className="thong-tin-thanh-toan">
                                            <h5>Thêm mới danh mục </h5>
                                        </span>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="control-label">Nhập tên danh mục mới</label>
                                        <input className="form-control" type="text" required onChange={(e) => { setNameNewCategory(e.target.value) }} />
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="control-label">Danh mục sản phẩm hiện đang có</label>
                                        <ul style={{ paddingLeft: "20px" }}>

                                            {categories && categories.map(category => (
                                                <li key={category.id} style={{ listStyle: "inside" }}>{category.name}</li>
                                            ))}

                                        </ul>
                                    </div>
                                </div>
                                <button className="btn btn-save" type="button" onClick={addCategory}>Lưu lại</button>
                                <a className="btn btn-cancel" onClick={() => setShowForm(null)}>Hủy bỏ</a>
                            </div>
                            <div className="modal-footer">
                            </div>
                        </div>
                    </div>
                </div>


            </body >
        </div >
    );

}
export default EditProductPage;