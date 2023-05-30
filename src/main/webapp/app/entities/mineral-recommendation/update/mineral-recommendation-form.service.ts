import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMineralRecommendation, NewMineralRecommendation } from '../mineral-recommendation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMineralRecommendation for edit and NewMineralRecommendationFormGroupInput for create.
 */
type MineralRecommendationFormGroupInput = IMineralRecommendation | PartialWithRequiredKeyOf<NewMineralRecommendation>;

type MineralRecommendationFormDefaults = Pick<NewMineralRecommendation, 'id'>;

type MineralRecommendationFormGroupContent = {
  id: FormControl<IMineralRecommendation['id'] | NewMineralRecommendation['id']>;
  minAmount: FormControl<IMineralRecommendation['minAmount']>;
  maxAmount: FormControl<IMineralRecommendation['maxAmount']>;
  unit: FormControl<IMineralRecommendation['unit']>;
  timePeriodLength: FormControl<IMineralRecommendation['timePeriodLength']>;
  timePeriodDimension: FormControl<IMineralRecommendation['timePeriodDimension']>;
  mineral: FormControl<IMineralRecommendation['mineral']>;
};

export type MineralRecommendationFormGroup = FormGroup<MineralRecommendationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MineralRecommendationFormService {
  createMineralRecommendationFormGroup(
    mineralRecommendation: MineralRecommendationFormGroupInput = { id: null }
  ): MineralRecommendationFormGroup {
    const mineralRecommendationRawValue = {
      ...this.getFormDefaults(),
      ...mineralRecommendation,
    };
    return new FormGroup<MineralRecommendationFormGroupContent>({
      id: new FormControl(
        { value: mineralRecommendationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      minAmount: new FormControl(mineralRecommendationRawValue.minAmount),
      maxAmount: new FormControl(mineralRecommendationRawValue.maxAmount),
      unit: new FormControl(mineralRecommendationRawValue.unit),
      timePeriodLength: new FormControl(mineralRecommendationRawValue.timePeriodLength),
      timePeriodDimension: new FormControl(mineralRecommendationRawValue.timePeriodDimension),
      mineral: new FormControl(mineralRecommendationRawValue.mineral),
    });
  }

  getMineralRecommendation(form: MineralRecommendationFormGroup): IMineralRecommendation | NewMineralRecommendation {
    return form.getRawValue() as IMineralRecommendation | NewMineralRecommendation;
  }

  resetForm(form: MineralRecommendationFormGroup, mineralRecommendation: MineralRecommendationFormGroupInput): void {
    const mineralRecommendationRawValue = { ...this.getFormDefaults(), ...mineralRecommendation };
    form.reset(
      {
        ...mineralRecommendationRawValue,
        id: { value: mineralRecommendationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MineralRecommendationFormDefaults {
    return {
      id: null,
    };
  }
}
