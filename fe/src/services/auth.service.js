import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  async login(body) {
    const response = await axios
      .post(API_URL + "signin", body);
    console.log(response.data)
    if (response.data.token) {
      console.log("abc")
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response;
  }

  logout() {
    localStorage.removeItem("user");
  }

  async register(body) {
    const response = await axios
      .post(API_URL + "signup", body);
    console.log(response.data)

    return response;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
  async checkOTPRegister(name,code){
    const response = await axios.post(API_URL+ `check-otp-register?name=${name}&code=${code}`);
    return response;
  }
  async findByIds(ids){
    try{
        const url = API_URL +`get-info-by-ids?ids=${ids}`
        console.log(url)
        const response = await axios.get(url)
        console.log(ids)
        console.log(response)
        return response.data;
    }catch (error) {
        console.error("Error find seller:", error);
        throw error;
    }
  }
}

export default new AuthService();
