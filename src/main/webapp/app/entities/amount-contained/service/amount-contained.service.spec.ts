import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAmountContained } from '../amount-contained.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../amount-contained.test-samples';

import { AmountContainedService } from './amount-contained.service';

const requireRestSample: IAmountContained = {
  ...sampleWithRequiredData,
};

describe('AmountContained Service', () => {
  let service: AmountContainedService;
  let httpMock: HttpTestingController;
  let expectedResult: IAmountContained | IAmountContained[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AmountContainedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a AmountContained', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const amountContained = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(amountContained).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AmountContained', () => {
      const amountContained = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(amountContained).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AmountContained', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AmountContained', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AmountContained', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAmountContainedToCollectionIfMissing', () => {
      it('should add a AmountContained to an empty array', () => {
        const amountContained: IAmountContained = sampleWithRequiredData;
        expectedResult = service.addAmountContainedToCollectionIfMissing([], amountContained);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(amountContained);
      });

      it('should not add a AmountContained to an array that contains it', () => {
        const amountContained: IAmountContained = sampleWithRequiredData;
        const amountContainedCollection: IAmountContained[] = [
          {
            ...amountContained,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAmountContainedToCollectionIfMissing(amountContainedCollection, amountContained);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AmountContained to an array that doesn't contain it", () => {
        const amountContained: IAmountContained = sampleWithRequiredData;
        const amountContainedCollection: IAmountContained[] = [sampleWithPartialData];
        expectedResult = service.addAmountContainedToCollectionIfMissing(amountContainedCollection, amountContained);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(amountContained);
      });

      it('should add only unique AmountContained to an array', () => {
        const amountContainedArray: IAmountContained[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const amountContainedCollection: IAmountContained[] = [sampleWithRequiredData];
        expectedResult = service.addAmountContainedToCollectionIfMissing(amountContainedCollection, ...amountContainedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const amountContained: IAmountContained = sampleWithRequiredData;
        const amountContained2: IAmountContained = sampleWithPartialData;
        expectedResult = service.addAmountContainedToCollectionIfMissing([], amountContained, amountContained2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(amountContained);
        expect(expectedResult).toContain(amountContained2);
      });

      it('should accept null and undefined values', () => {
        const amountContained: IAmountContained = sampleWithRequiredData;
        expectedResult = service.addAmountContainedToCollectionIfMissing([], null, amountContained, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(amountContained);
      });

      it('should return initial array if no AmountContained is added', () => {
        const amountContainedCollection: IAmountContained[] = [sampleWithRequiredData];
        expectedResult = service.addAmountContainedToCollectionIfMissing(amountContainedCollection, undefined, null);
        expect(expectedResult).toEqual(amountContainedCollection);
      });
    });

    describe('compareAmountContained', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAmountContained(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAmountContained(entity1, entity2);
        const compareResult2 = service.compareAmountContained(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAmountContained(entity1, entity2);
        const compareResult2 = service.compareAmountContained(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAmountContained(entity1, entity2);
        const compareResult2 = service.compareAmountContained(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
