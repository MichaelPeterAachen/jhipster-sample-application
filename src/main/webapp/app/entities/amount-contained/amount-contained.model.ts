import { IMineral } from 'app/entities/mineral/mineral.model';
import { IFood } from 'app/entities/food/food.model';
import { Unit } from 'app/entities/enumerations/unit.model';

export interface IAmountContained {
  id: number;
  amount?: number | null;
  unit?: Unit | null;
  mineral?: Pick<IMineral, 'id'> | null;
  food?: Pick<IFood, 'id'> | null;
}

export type NewAmountContained = Omit<IAmountContained, 'id'> & { id: null };
