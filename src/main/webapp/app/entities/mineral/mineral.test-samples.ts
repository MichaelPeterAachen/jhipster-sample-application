import { IMineral, NewMineral } from './mineral.model';

export const sampleWithRequiredData: IMineral = {
  id: 56006,
};

export const sampleWithPartialData: IMineral = {
  id: 15593,
  name: 'Accounts',
};

export const sampleWithFullData: IMineral = {
  id: 88755,
  name: 'base Metal Beauty',
};

export const sampleWithNewData: NewMineral = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
