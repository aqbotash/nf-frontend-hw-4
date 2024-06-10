import { CreateProduct } from '@/components/CreateProduct';
import Products from '@/components/Products';
import React from 'react';

const Home = () => {
  return (
    <div>
      <Products />
      <CreateProduct/>
    </div>
  );
};

export default Home;