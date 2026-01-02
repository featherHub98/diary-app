import axios from "axios"
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";

const getRealmSecret = (id) => {
  return  axios.get(`http://localhost:2000/secrets/${id}`)
}

const isExpired = (token) => {
  if (!token) return true;
  
  const parts = token.split('.');
  if (parts.length !== 3) return true;
  
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));

  // Return true if token IS expired (current time > expiration time)
  return payload.exp * 1000 < Date.now();

};
const verifyToken = async () => {
  let token = localStorage.getItem('access token');
  if (!token) return false;
  
  if (isExpired(token)) {
    let refreshToken = localStorage.getItem('refresh token');
    if (!refreshToken || isExpired(refreshToken)) {
      localStorage.removeItem('access token');
      localStorage.removeItem('refresh token');
      return false;
    }
    
    try {
      const res = await axios.post('http://localhost:2000/realms/users/refresh', {
        refreshToken: refreshToken
      });
      localStorage.setItem('access token', res.data.response.token);
      localStorage.setItem('refresh token', res.data.response.refreshToken);
      return true;
    } catch (err) {
      localStorage.removeItem('access token');
      localStorage.removeItem('refresh token');
      return false;
    }
  }
  return true;
}
const logOut = () => {
  localStorage.removeItem('access token');
  localStorage.removeItem('refresh token');
  localStorage.removeItem('isLogged');
  return true;
}

export {getRealmSecret, isExpired, verifyToken, logOut};