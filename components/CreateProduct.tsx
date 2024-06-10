'use client'
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCreateProduct } from '@/hooks/useCreateProduct';
import { v4 as uuidv4 } from 'uuid';
import FileUploader from './FileUploader';

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

const CreateProduct = () => {
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [images, setImages] = useState<Image[]>([]);
  const createProductMutation = useCreateProduct();

  const onSubmit = () => {
    createProductMutation.mutate({
      id: uuidv4(), // Generate a unique id
      title,
      price,
      description,
      category,
      images,
      rating: {
        rate,
        count,
      },
    });
  };

  const handleFileUploadSuccess = (urls: string[] | string) => {
    if (Array.isArray(urls)) {
      const newImages = urls.map(url => ({ url }));
      setImages(prev => [...prev, ...newImages]);
    } else if (typeof urls === 'string') {
      const newImage = { url: urls };
      setImages(prev => [...prev, newImage]);
    } else {
      console.error('Invalid input: urls should be a string or an array of strings');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white">
      <h1 className="text-2xl font-semibold mb-4">Create Product</h1>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(parseFloat(e.target.value) || 0)}
            className="p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          <Label htmlFor="images">Images</Label>
          <div>
            <FileUploader onUploadSuccess={handleFileUploadSuccess} />
            <div className="flex flex-wrap mt-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  style={{ width: '100px', height: '100px', margin: '5px' }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          <Label htmlFor="rate">Rating (Rate)</Label>
          <Input
            id="rate"
            type="number"
            value={rate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRate(parseFloat(e.target.value) || 0)}
            className="p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          <Label htmlFor="count">Rating (Count)</Label>
          <Input
            id="count"
            type="number"
            value={count}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCount(parseFloat(e.target.value) || 0)}
            className="p-2 border rounded"
          />
        </div>
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={createProductMutation.status !== 'idle' && createProductMutation.status !== 'success'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {createProductMutation.status === 'idle' || createProductMutation.status === 'success' ? 'Submit' : 'Submitting...'}
        </Button>
      </div>
    </div>
  );
};

export default CreateProduct;
