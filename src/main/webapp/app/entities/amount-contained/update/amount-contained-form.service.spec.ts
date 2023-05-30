import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../amount-contained.test-samples';

import { AmountContainedFormService } from './amount-contained-form.service';

describe('AmountContained Form Service', () => {
  let service: AmountContainedFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmountContainedFormService);
  });

  describe('Service methods', () => {
    describe('createAmountContainedFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAmountContainedFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            unit: expect.any(Object),
            mineral: expect.any(Object),
            food: expect.any(Object),
          })
        );
      });

      it('passing IAmountContained should create a new form with FormGroup', () => {
        const formGroup = service.createAmountContainedFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            unit: expect.any(Object),
            mineral: expect.any(Object),
            food: expect.any(Object),
          })
        );
      });
    });

    describe('getAmountContained', () => {
      it('should return NewAmountContained for default AmountContained initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAmountContainedFormGroup(sampleWithNewData);

        const amountContained = service.getAmountContained(formGroup) as any;

        expect(amountContained).toMatchObject(sampleWithNewData);
      });

      it('should return NewAmountContained for empty AmountContained initial value', () => {
        const formGroup = service.createAmountContainedFormGroup();

        const amountContained = service.getAmountContained(formGroup) as any;

        expect(amountContained).toMatchObject({});
      });

      it('should return IAmountContained', () => {
        const formGroup = service.createAmountContainedFormGroup(sampleWithRequiredData);

        const amountContained = service.getAmountContained(formGroup) as any;

        expect(amountContained).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAmountContained should not enable id FormControl', () => {
        const formGroup = service.createAmountContainedFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAmountContained should disable id FormControl', () => {
        const formGroup = service.createAmountContainedFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
