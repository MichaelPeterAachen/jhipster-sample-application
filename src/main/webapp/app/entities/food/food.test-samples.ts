import { IFood, NewFood } from './food.model';

export const sampleWithRequiredData: IFood = {
  id: 57781,
};

export const sampleWithPartialData: IFood = {
  id: 88230,
  name: 'Louisiana Plastic primary',
};

export const sampleWithFullData: IFood = {
  id: 51310,
  name: 'Chicken Bedfordshire',
};

export const sampleWithNewData: NewFood = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
