import axios from "axios";
const API_URL = "http://localhost:8085/api/item/";

class ItemService {
    async addItem(topId, quantity, cartid) {
        const body= {
            "typeOfProductId": topId,
            "quantity": quantity,
            "customerId": cartid
        }
        console.log(body)
        const response = await axios.post(API_URL + "add",body )
        return response.data;
    }
    async deleteItemById(itemid) {
        const response = await axios.delete(API_URL + `delete?itemId=${itemid}`)
        return response.data;
    }
    async getByIds(ids){
        const response = await axios.get(API_URL+`find-by-ids?ids=${ids.join(',')}`)
        return response.data;
    }
    async getByCustomerId(customerId){
        const response = await axios.get(API_URL + `cart-details?customer_id=${customerId}`)
        console.log(response.data);
        return response.data;
    }
    async updateItem(id,productId,label1,label2,customerId,quantity){
        const body = {
            "id":id,
            "productId":productId,
            "label1":label1,
            "label2":label2,
            "customerId":customerId,
            "quantity": quantity,
        };
        console.log(body)
        const response = await axios.post(API_URL+ "update",body)
        return response;
    }
    async updateIsRated(id,isRated){
        const body ={
            "id":id,
            "isRated": isRated
        }
        const response = await axios.post(API_URL+ "update",body)
        return response;
    }
    async getBySellerId(sellerId){
        const response = await axios.get(API_URL+`find-by-seller-id?seller_id=${sellerId}`)
        console.log(response.data)
        return response.data;
    }

}
export default new ItemService();