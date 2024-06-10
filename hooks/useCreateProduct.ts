import { axiosInstance } from "@/api/apiClient";
import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";

export type Product = {
    id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    images: Image[];
    rating: Rating;
  };
  
  export type Image = {
    url: string;
  }
  
  export type Rating = {
    rate: number;
    count: number;
  };

const createProduct = async (ProductData: Product): Promise<Product> => {
    const res = await axiosInstance.post<Product>('/products', ProductData);
    return res.data;
}

const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<Product, Error, Product>({
      mutationFn: createProduct,
      onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['products']});
      },
  });
}

export { useCreateProduct };