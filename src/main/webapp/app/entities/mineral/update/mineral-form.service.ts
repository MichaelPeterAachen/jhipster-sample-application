import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMineral, NewMineral } from '../mineral.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMineral for edit and NewMineralFormGroupInput for create.
 */
type MineralFormGroupInput = IMineral | PartialWithRequiredKeyOf<NewMineral>;

type MineralFormDefaults = Pick<NewMineral, 'id'>;

type MineralFormGroupContent = {
  id: FormControl<IMineral['id'] | NewMineral['id']>;
  name: FormControl<IMineral['name']>;
};

export type MineralFormGroup = FormGroup<MineralFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MineralFormService {
  createMineralFormGroup(mineral: MineralFormGroupInput = { id: null }): MineralFormGroup {
    const mineralRawValue = {
      ...this.getFormDefaults(),
      ...mineral,
    };
    return new FormGroup<MineralFormGroupContent>({
      id: new FormControl(
        { value: mineralRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(mineralRawValue.name),
    });
  }

  getMineral(form: MineralFormGroup): IMineral | NewMineral {
    return form.getRawValue() as IMineral | NewMineral;
  }

  resetForm(form: MineralFormGroup, mineral: MineralFormGroupInput): void {
    const mineralRawValue = { ...this.getFormDefaults(), ...mineral };
    form.reset(
      {
        ...mineralRawValue,
        id: { value: mineralRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MineralFormDefaults {
    return {
      id: null,
    };
  }
}
