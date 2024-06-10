export type Product = {
    id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: Rating;
};

export type Rating = {
    rate: number;
    count: number;
}
