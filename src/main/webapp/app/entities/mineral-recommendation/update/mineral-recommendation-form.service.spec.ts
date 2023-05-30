import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mineral-recommendation.test-samples';

import { MineralRecommendationFormService } from './mineral-recommendation-form.service';

describe('MineralRecommendation Form Service', () => {
  let service: MineralRecommendationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MineralRecommendationFormService);
  });

  describe('Service methods', () => {
    describe('createMineralRecommendationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMineralRecommendationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            minAmount: expect.any(Object),
            maxAmount: expect.any(Object),
            unit: expect.any(Object),
            timePeriodLength: expect.any(Object),
            timePeriodDimension: expect.any(Object),
            mineral: expect.any(Object),
          })
        );
      });

      it('passing IMineralRecommendation should create a new form with FormGroup', () => {
        const formGroup = service.createMineralRecommendationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            minAmount: expect.any(Object),
            maxAmount: expect.any(Object),
            unit: expect.any(Object),
            timePeriodLength: expect.any(Object),
            timePeriodDimension: expect.any(Object),
            mineral: expect.any(Object),
          })
        );
      });
    });

    describe('getMineralRecommendation', () => {
      it('should return NewMineralRecommendation for default MineralRecommendation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMineralRecommendationFormGroup(sampleWithNewData);

        const mineralRecommendation = service.getMineralRecommendation(formGroup) as any;

        expect(mineralRecommendation).toMatchObject(sampleWithNewData);
      });

      it('should return NewMineralRecommendation for empty MineralRecommendation initial value', () => {
        const formGroup = service.createMineralRecommendationFormGroup();

        const mineralRecommendation = service.getMineralRecommendation(formGroup) as any;

        expect(mineralRecommendation).toMatchObject({});
      });

      it('should return IMineralRecommendation', () => {
        const formGroup = service.createMineralRecommendationFormGroup(sampleWithRequiredData);

        const mineralRecommendation = service.getMineralRecommendation(formGroup) as any;

        expect(mineralRecommendation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMineralRecommendation should not enable id FormControl', () => {
        const formGroup = service.createMineralRecommendationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMineralRecommendation should disable id FormControl', () => {
        const formGroup = service.createMineralRecommendationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
