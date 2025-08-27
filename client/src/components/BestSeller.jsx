import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <div className='mt-16 px-4'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      
      <div className='grid mt-6 gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {products
          .filter((product) => product.inStock)
          .slice(0, 6) // show up to 6 for balance
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
