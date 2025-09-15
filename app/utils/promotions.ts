interface Promotion {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

// Default export para resolver el warning
export default {
  getPromotions: async (): Promise<Promotion[]> => {
    // Implementar lógica para obtener promociones
    return [];
  }
};