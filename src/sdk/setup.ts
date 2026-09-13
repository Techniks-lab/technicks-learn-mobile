import { BASE_PATH } from "./auth/base";
import axios from "axios";

export let serverPath =
  process.env.NODE_ENV === "production"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL ?? BASE_PATH;

console.log(serverPath);

const defaultConfig = {
  baseURL: serverPath,
  timeout: 15000,
};

export const axiosInstance = axios.create(defaultConfig);
