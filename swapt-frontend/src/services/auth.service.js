import axios from "axios";
import serviceConfig from "../config/service.config";

const API_URL = "http://" + serviceConfig.getHost() + ":" + serviceConfig.getPort() + "/api/auth/";

class AuthService {
    login(email, password) {
        return axios
            .post(API_URL + "login", {
                email,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user_session", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user_session");
    }

    register(email, password, first_name, last_name) {
        return axios.post(API_URL + "signup", {
            email,
            password,
            first_name,
            last_name
        });
    }

    getUserSession() {
        return JSON.parse(localStorage.getItem('user_session'));
    }
}

export default new AuthService();
