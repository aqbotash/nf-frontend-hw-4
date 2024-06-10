'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { axiosInstance } from '@/api/apiClient';

const fetchData = async () => {
  const { data } = await axiosInstance.get('https://fakestoreapi.com/products');
  return data;
};

const Products: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchData,
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {(error as Error).message}</div>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-center mb-8">Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((product: any) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <img src={product.image} alt={product.title} className="w-full h-48 object-contain p-4" />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-700 mb-2">${product.price.toFixed(2)}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
