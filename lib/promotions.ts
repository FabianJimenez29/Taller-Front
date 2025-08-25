// Tipo para las imágenes promocionales
export interface PromotionImage {
  name: string;
  url: string;
}

// Función para obtener las imágenes promocionales desde el backend
export async function getPromotionImages(): Promise<PromotionImage[]> {
  try {
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || '';
    console.log(`Obteniendo promociones desde: ${backendUrl}/promotions`);
    
    const response = await fetch(`${backendUrl}/promotions`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener las promociones: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !Array.isArray(data.promotions)) {
      console.error('Formato de respuesta inesperado:', data);
      return [];
    }
    
    console.log(`Se encontraron ${data.promotions.length} imágenes promocionales`);
    return data.promotions;
  } catch (error) {
    console.error('Error al obtener las imágenes promocionales:', error);
    return [];
  }
}
