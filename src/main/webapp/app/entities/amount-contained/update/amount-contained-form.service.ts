import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAmountContained, NewAmountContained } from '../amount-contained.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAmountContained for edit and NewAmountContainedFormGroupInput for create.
 */
type AmountContainedFormGroupInput = IAmountContained | PartialWithRequiredKeyOf<NewAmountContained>;

type AmountContainedFormDefaults = Pick<NewAmountContained, 'id'>;

type AmountContainedFormGroupContent = {
  id: FormControl<IAmountContained['id'] | NewAmountContained['id']>;
  amount: FormControl<IAmountContained['amount']>;
  unit: FormControl<IAmountContained['unit']>;
  mineral: FormControl<IAmountContained['mineral']>;
  food: FormControl<IAmountContained['food']>;
};

export type AmountContainedFormGroup = FormGroup<AmountContainedFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AmountContainedFormService {
  createAmountContainedFormGroup(amountContained: AmountContainedFormGroupInput = { id: null }): AmountContainedFormGroup {
    const amountContainedRawValue = {
      ...this.getFormDefaults(),
      ...amountContained,
    };
    return new FormGroup<AmountContainedFormGroupContent>({
      id: new FormControl(
        { value: amountContainedRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      amount: new FormControl(amountContainedRawValue.amount, {
        validators: [Validators.required],
      }),
      unit: new FormControl(amountContainedRawValue.unit),
      mineral: new FormControl(amountContainedRawValue.mineral),
      food: new FormControl(amountContainedRawValue.food),
    });
  }

  getAmountContained(form: AmountContainedFormGroup): IAmountContained | NewAmountContained {
    return form.getRawValue() as IAmountContained | NewAmountContained;
  }

  resetForm(form: AmountContainedFormGroup, amountContained: AmountContainedFormGroupInput): void {
    const amountContainedRawValue = { ...this.getFormDefaults(), ...amountContained };
    form.reset(
      {
        ...amountContainedRawValue,
        id: { value: amountContainedRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AmountContainedFormDefaults {
    return {
      id: null,
    };
  }
}
