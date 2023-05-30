import { IMineral } from 'app/entities/mineral/mineral.model';
import { Unit } from 'app/entities/enumerations/unit.model';
import { RecommendationPeriodTime } from 'app/entities/enumerations/recommendation-period-time.model';

export interface IMineralRecommendation {
  id: number;
  minAmount?: number | null;
  maxAmount?: number | null;
  unit?: Unit | null;
  timePeriodLength?: number | null;
  timePeriodDimension?: RecommendationPeriodTime | null;
  mineral?: Pick<IMineral, 'id'> | null;
}

export type NewMineralRecommendation = Omit<IMineralRecommendation, 'id'> & { id: null };
