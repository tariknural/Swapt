import axios from "axios";
import authHeader from "./auth-header";
import serviceConfig from "../config/service.config";

const API_URL =
  "http://" +
  serviceConfig.getHost() +
  ":" +
  serviceConfig.getPort() +
  "/api/accommodation/detail/";

class AccommodationDetailService {

    async getAccommodationDetailById(id) {
        return axios.get(API_URL + id, { headers: authHeader() });
      }

}

export default new AccommodationDetailService();