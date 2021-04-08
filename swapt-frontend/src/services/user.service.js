import axios from 'axios';
import authHeader from './auth-header';
import serviceConfig from "../config/service.config";

const API_URL = "http://" + serviceConfig.getHost() + ":" + serviceConfig.getPort() + "/api/";

class UserService {

    getUserById(id) {
        return axios.get(API_URL + "user/getById/" + id, {headers: authHeader()});
    }

    updateUserData(userData) {
        return axios
            .post(API_URL + "user", userData,{headers: authHeader()})
            .then(response => {
                // put updated user data into local storage
                if (response.data) {
                    let userSession = JSON.parse(localStorage.getItem("user_session"));
                    userSession.activeUser = response.data;
                    localStorage.setItem("user_session", JSON.stringify(userSession));
                }
                return response;
            });
    }

    updateUserPassword(password,new_password) {
        return axios.post(API_URL + "user/updatepassword", {
            password,
            new_password
        },{headers: authHeader()});
    }

    updateUserPicture(formData) {
        return axios.post(API_URL + "user/updatepicture", formData, {headers: authHeader()}).then(response => {
            // put updated user data into local storage
            if (response.data.user) {
                let userSession = JSON.parse(localStorage.getItem("user_session"));
                userSession.activeUser = response.data.user;
                localStorage.setItem("user_session", JSON.stringify(userSession));
            }
            return response;
        });
    }

    uploadUserVerificationFile(formData) {
        return axios.post(API_URL + "user/uploadverification", formData, {headers: authHeader()}).then(response => {
            // put updated user data into local storage
            if (response.data.user) {
                let userSession = JSON.parse(localStorage.getItem("user_session"));
                userSession.activeUser = response.data.user;
                localStorage.setItem("user_session", JSON.stringify(userSession));
            }
            return response;
        });
    }

    getUserPremiumStatus() {
        return axios.get(API_URL + "user/premiumstatus", {headers: authHeader()})
    }

    setUserRole(user_role) {
        return axios.post(API_URL + "user/setrole/"+user_role, null,{headers: authHeader()})
    }

    getPublicContent() {
        return axios.get(API_URL + 'test/all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'test/user', {headers: authHeader()});
    }

    getPremiumUserBoard() {
        return axios.get(API_URL + 'test/premiumUser', {headers: authHeader()});
    }

    getUserNameById(id){
        return axios.get(API_URL + 'user/username/' + id);
    }


}

export default new UserService();
