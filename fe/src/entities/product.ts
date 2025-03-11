import Category from "./category";
import TypeOfProduct from "./typeOfProduct";
import ImageClassification from "./imageClassification";
class Product {
    name: string;
    description: File;
    image: string[];
    title1: string;
    title2: string;
    listTypeOfProduct: TypeOfProduct[];
    categoryId: number;
    supplierId:number;
    sellerId:number;
    imageClassifications: ImageClassification[];
    

    constructor(
        name: string,
        description: File,
        image: string[]=[],
        title1: string,
        title2: string,
        listTypeOfProduct: TypeOfProduct[] = [],
        categoryId: number,
        supplierId: number,
        sellerId:number,
        imageClassifications: ImageClassification[]=[]
    ) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.title1 = title1;
        this.title2 = title2;
        this.listTypeOfProduct = listTypeOfProduct;
        this.categoryId = categoryId;
        this.supplierId = supplierId;
        this.sellerId= sellerId;
        this.imageClassifications = imageClassifications;
    }
    
    
}
export default Product;
