/**
 * Servicio para obtener imágenes del banner
 */

// Tipo para las imágenes del banner
export interface BannerImage {
  name: string;
  url: string;
}

// Lista de imágenes estáticas para el banner (mientras se soluciona el problema con Supabase)
// En una implementación completa, estas vendrían de Supabase Storage
const staticBannerImages: BannerImage[] = [
  { 
    name: 'promocion1',
    url: 'https://via.placeholder.com/1200x400/E51514/FFFFFF/?text=Promocion+1:+Cambio+de+aceite+con+15%+de+descuento'
  },
  { 
    name: 'promocion2',
    url: 'https://via.placeholder.com/1200x400/76B414/FFFFFF/?text=Promocion+2:+Revision+de+frenos+gratis'
  },
  { 
    name: 'promocion3',
    url: 'https://via.placeholder.com/1200x400/333333/FFFFFF/?text=Promocion+3:+50%+de+descuento+en+alineacion'
  },
  { 
    name: 'promocion4',
    url: 'https://via.placeholder.com/1200x400/0066CC/FFFFFF/?text=Promocion+4:+Diagnostico+computarizado+gratuito'
  },
];

/**
 * Obtiene las imágenes para el banner desde el backend.
 * Si no puede conectar con el backend, usa imágenes estáticas.
 */
export async function getBannerImages(): Promise<BannerImage[]> {
  try {
    // Obtener imágenes del backend
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://backend-login-one.vercel.app/api';
    
    // Timeout para evitar bloquear la UI
    const timeoutPromise = new Promise<Response>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout al conectar con el backend')), 5000);
    });
    
    const fetchPromise = fetch(`${backendUrl}/banner-images`);
    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Si hay imágenes válidas, usarlas
    if (data.bannerImages && Array.isArray(data.bannerImages) && data.bannerImages.length > 0) {
      const validImages = data.bannerImages.filter((img: any) => 
        img && typeof img.url === 'string' && img.url.trim() !== ''
      );
      
      if (validImages.length > 0) {
        return validImages;
      }
    }
    
    // Fallback a imágenes estáticas
    return staticBannerImages;
    
  } catch (error) {
    // En caso de error, usar imágenes estáticas
    return staticBannerImages;
  }
}
