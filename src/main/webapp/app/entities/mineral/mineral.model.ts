export interface IMineral {
  id: number;
  name?: string | null;
}

export type NewMineral = Omit<IMineral, 'id'> & { id: null };
