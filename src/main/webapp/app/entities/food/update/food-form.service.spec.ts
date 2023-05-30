import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../food.test-samples';

import { FoodFormService } from './food-form.service';

describe('Food Form Service', () => {
  let service: FoodFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodFormService);
  });

  describe('Service methods', () => {
    describe('createFoodFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFoodFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing IFood should create a new form with FormGroup', () => {
        const formGroup = service.createFoodFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getFood', () => {
      it('should return NewFood for default Food initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFoodFormGroup(sampleWithNewData);

        const food = service.getFood(formGroup) as any;

        expect(food).toMatchObject(sampleWithNewData);
      });

      it('should return NewFood for empty Food initial value', () => {
        const formGroup = service.createFoodFormGroup();

        const food = service.getFood(formGroup) as any;

        expect(food).toMatchObject({});
      });

      it('should return IFood', () => {
        const formGroup = service.createFoodFormGroup(sampleWithRequiredData);

        const food = service.getFood(formGroup) as any;

        expect(food).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFood should not enable id FormControl', () => {
        const formGroup = service.createFoodFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFood should disable id FormControl', () => {
        const formGroup = service.createFoodFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
