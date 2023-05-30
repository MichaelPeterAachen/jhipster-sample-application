import { Unit } from 'app/entities/enumerations/unit.model';
import { RecommendationPeriodTime } from 'app/entities/enumerations/recommendation-period-time.model';

import { IMineralRecommendation, NewMineralRecommendation } from './mineral-recommendation.model';

export const sampleWithRequiredData: IMineralRecommendation = {
  id: 79170,
};

export const sampleWithPartialData: IMineralRecommendation = {
  id: 65936,
  minAmount: 55145,
  unit: Unit['MG'],
  timePeriodDimension: RecommendationPeriodTime['MONTHS'],
};

export const sampleWithFullData: IMineralRecommendation = {
  id: 36871,
  minAmount: 87665,
  maxAmount: 84269,
  unit: Unit['G'],
  timePeriodLength: 18653,
  timePeriodDimension: RecommendationPeriodTime['DAYS'],
};

export const sampleWithNewData: NewMineralRecommendation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
