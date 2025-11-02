interface Promotion {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}


export default {
  getPromotions: async (): Promise<Promotion[]> => {
    return [];
  }
};