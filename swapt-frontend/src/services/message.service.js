import axios from 'axios';
import authHeader from './auth-header';
import serviceConfig from "../config/service.config";

const API_URL = "http://" + serviceConfig.getHost() + ":" + serviceConfig.getPort() + "/api/message/";

class Message {

    getMessages(fromUser, toUser) {
        return axios.get(API_URL+ "getMessages/" + fromUser + "/" + toUser, { headers: authHeader() });
    }

    getOtherUsers(id) {
        return axios.get(API_URL+ "getUsers/" + id, { headers: authHeader() });
    }

    sendMessage(fromId, fromName, toId, toName, message) {
        return axios.post(API_URL + "sendMessage",{
            fromId,
            fromName,
            toId,
            toName,
            message
        }, { headers: authHeader() });
    }
}

export default new Message();