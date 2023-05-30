import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mineral.test-samples';

import { MineralFormService } from './mineral-form.service';

describe('Mineral Form Service', () => {
  let service: MineralFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MineralFormService);
  });

  describe('Service methods', () => {
    describe('createMineralFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMineralFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing IMineral should create a new form with FormGroup', () => {
        const formGroup = service.createMineralFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getMineral', () => {
      it('should return NewMineral for default Mineral initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMineralFormGroup(sampleWithNewData);

        const mineral = service.getMineral(formGroup) as any;

        expect(mineral).toMatchObject(sampleWithNewData);
      });

      it('should return NewMineral for empty Mineral initial value', () => {
        const formGroup = service.createMineralFormGroup();

        const mineral = service.getMineral(formGroup) as any;

        expect(mineral).toMatchObject({});
      });

      it('should return IMineral', () => {
        const formGroup = service.createMineralFormGroup(sampleWithRequiredData);

        const mineral = service.getMineral(formGroup) as any;

        expect(mineral).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMineral should not enable id FormControl', () => {
        const formGroup = service.createMineralFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMineral should disable id FormControl', () => {
        const formGroup = service.createMineralFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
