import { Unit } from 'app/entities/enumerations/unit.model';

import { IAmountContained, NewAmountContained } from './amount-contained.model';

export const sampleWithRequiredData: IAmountContained = {
  id: 40675,
  amount: 77997,
};

export const sampleWithPartialData: IAmountContained = {
  id: 94508,
  amount: 86844,
  unit: Unit['G'],
};

export const sampleWithFullData: IAmountContained = {
  id: 23066,
  amount: 42485,
  unit: Unit['G'],
};

export const sampleWithNewData: NewAmountContained = {
  amount: 34092,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
