import { jwtDecode } from 'jwt-decode'; 
class TokenService{
    decodeJwt(token){
        const response = jwtDecode(token);
        return response;
    }
}
export default new TokenService();