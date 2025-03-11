class TypeOfProduct {
    id: number;
    label1: string;
    label2: string;
    quantity: number;
    price: number;
    cost: number;
    originalPrice:number;
    weight:number;
    constructor(
        id:number,
        label1: string,
        label2: string,
        quantity: number,
        price: number,
        cost: number,
        originalPrice:number,
        weight:number
    ) {
        this.id=id;
        this.label1 = label1;
        this.label2 = label2;
        this.price = price;
        this.cost = cost;
        this.quantity = quantity;
        this.originalPrice = originalPrice
        this.weight = weight
    }
}
export default TypeOfProduct;