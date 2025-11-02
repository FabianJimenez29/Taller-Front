interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image_url: string | null;
  image_path: string | null;
  category_name: string | null;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  category_name: string;
}

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/categories`);
    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/products?category_id=${categoryId}`);
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getFeaturedProducts = async (): Promise<FeaturedProduct[]> => {
  try {
    const categories = await getCategories();
    const featuredProducts: FeaturedProduct[] = [];

    // Para cada categoría, obtener el primer producto disponible
    for (const category of categories.slice(0, 4)) { // Limitamos a 4 categorías máximo
      const products = await getProductsByCategory(category.id);
      
      if (products.length > 0) {
        const product = products[0]; // Tomar el primer producto
        featuredProducts.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          category_name: category.name,
        });
      }
    }

    return featuredProducts;
  } catch (error) {
    console.error('Error getting featured products:', error);
    return [];
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/products`);
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};