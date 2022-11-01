import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export const API_URL = import.meta.env.REACT_APP_BACKEND_URL;

interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface IPaginationResult {
  count: number;
  next: string;
  prev: string;
  results: Object[];
}

declare global {
  interface Window {
    localStorage: IStorage;
  }

  interface Object {
    entries: Function;
  }
}

const ISSERVER = typeof window === "undefined";

class HTTPService {
  token: string;

  constructor(url: string) {
    axios.defaults.baseURL = url;
    axios.defaults.headers.common.Accept = "application/json";
    if (!ISSERVER) {
      this.token = localStorage.getItem(STORAGE_KEY) || "";

      if (this.token) {
        this.setAuthHeader(this.token);
      }
    } else {
      this.token = "";
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    return axios
      .get<T>(url, config)
      .then((res) => this.handleSuccess<T>(res))
      .catch((err) => this.handleError<T>(err));
  }

  async post<T>(url: string, data: Object, config?: AxiosRequestConfig) {
    return axios
      .post<T>(url, data, config)
      .then((res) => this.handleSuccess<T>(res))
      .catch((err) => this.handleError<T>(err));
  }

  async put<T>(url: string, data: Object, config?: AxiosRequestConfig) {
    return axios
      .put<T>(url, data, config)
      .then((res) => this.handleSuccess<T>(res))
      .catch(this.handleError);
  }

  async patch<T>(url: string, data: Object, config?: AxiosRequestConfig) {
    return axios
      .patch<T>(url, data, config)
      .then((res) => this.handleSuccess<T>(res))
      .catch(this.handleError);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    return axios
      .delete<T>(url, config)
      .then((res) => this.handleSuccess<T>(res))
      .catch(this.handleError);
  }

  handleSuccess<T>(response: AxiosResponse<T>) {
    return response.data;
  }

  handleError<T>(error: Error | AxiosError): T {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        this.removeAuthHeader();
        window.location.reload();
      }
      throw error.response?.data;
    }
    throw error;
  }

  setAuthHeader(token: string) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem(STORAGE_KEY, token);
  }

  removeAuthHeader() {
    axios.defaults.headers.common.Authorization = "";
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const STORAGE_KEY = "token";

export default new HTTPService(API_URL);
