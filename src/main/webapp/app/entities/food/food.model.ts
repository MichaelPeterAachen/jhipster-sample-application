export interface IFood {
  id: number;
  name?: string | null;
}

export type NewFood = Omit<IFood, 'id'> & { id: null };
