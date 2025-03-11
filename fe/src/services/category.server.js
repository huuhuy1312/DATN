import axios from "axios";
const API_URL = "http://localhost:8083/api/category";

class CategoryService {

    async getParentByCondition(name){
        const response = await axios.post(API_URL+`/find-category-parent-by-name?name=${name}`)
        return response.data;
    }
    async getCategoryByIdParent(idParent){
        const response = await axios.get(API_URL+`/find-by-id-parent?id=${idParent}`)
        return response.data;
    }
    async allCategoryAndChild(){
        const response = await axios.get(API_URL+`/all-category-and-child`)
        return response.data;
    }
    async addCategory(body){
        const response = await axios.post(API_URL+ "/add",body)
        return response;
    }

    async updateCategory(body){
        const response = await axios.post(API_URL+ "/edit",body)
        return response;
    }
    async deleteCategory(id){
        const response = await axios.delete(API_URL+ `/delete?id=${id}`)
        return response.data;
    }
}
export default new CategoryService();