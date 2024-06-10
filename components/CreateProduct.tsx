'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
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

export const CreateProduct = () => {
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
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Create Product
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create Product</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Fill in the product details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-sm sm:text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                className="col-span-3 p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-sm sm:text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(parseFloat(e.target.value) || 0)}
                className="col-span-3 p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-sm sm:text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                className="col-span-3 p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-sm sm:text-right">
                Category
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                className="col-span-3 p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-sm sm:text-right">
                Images
              </Label>
              <div className="col-span-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-sm sm:text-right">
                Rating (Rate)
              </Label>
              <Input
                id="rate"
                type="number"
                value={rate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRate(parseFloat(e.target.value) || 0)}
                className="col-span-3 p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="count" className="text-sm sm:text-right">
                Rating (Count)
              </Label>
              <Input
                id="count"
                type="number"
                value={count}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCount(parseFloat(e.target.value) || 0)}
                className="col-span-3 p-2 border rounded"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="submit"
                onClick={onSubmit}
                disabled={createProductMutation.status !== 'idle' && createProductMutation.status !== 'success'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {createProductMutation.status === 'idle' || createProductMutation.status === 'success' ? 'Submit' : 'Submitting...'}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
