import axios from "axios";
import { Host } from "@/utils/constants";

const apiClient = axios.create({
  baseURL: Host,
});

export default apiClient;
