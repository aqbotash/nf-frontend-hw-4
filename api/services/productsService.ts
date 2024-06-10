import { axiosInstance } from "../apiClient"
import { Product } from "@/types"
import { AxiosRequestConfig } from "axios";

interface GetAllProductsParams {
    products: Product[];
}

const getAllProducts = ({ products }: GetAllProductsParams) => axiosInstance.get("/products", { params: products } as AxiosRequestConfig<Product>);

export {
    getAllProducts
}