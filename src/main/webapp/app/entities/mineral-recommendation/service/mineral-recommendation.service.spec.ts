import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMineralRecommendation } from '../mineral-recommendation.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../mineral-recommendation.test-samples';

import { MineralRecommendationService } from './mineral-recommendation.service';

const requireRestSample: IMineralRecommendation = {
  ...sampleWithRequiredData,
};

describe('MineralRecommendation Service', () => {
  let service: MineralRecommendationService;
  let httpMock: HttpTestingController;
  let expectedResult: IMineralRecommendation | IMineralRecommendation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MineralRecommendationService);
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

    it('should create a MineralRecommendation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mineralRecommendation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mineralRecommendation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MineralRecommendation', () => {
      const mineralRecommendation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mineralRecommendation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MineralRecommendation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MineralRecommendation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MineralRecommendation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMineralRecommendationToCollectionIfMissing', () => {
      it('should add a MineralRecommendation to an empty array', () => {
        const mineralRecommendation: IMineralRecommendation = sampleWithRequiredData;
        expectedResult = service.addMineralRecommendationToCollectionIfMissing([], mineralRecommendation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mineralRecommendation);
      });

      it('should not add a MineralRecommendation to an array that contains it', () => {
        const mineralRecommendation: IMineralRecommendation = sampleWithRequiredData;
        const mineralRecommendationCollection: IMineralRecommendation[] = [
          {
            ...mineralRecommendation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMineralRecommendationToCollectionIfMissing(mineralRecommendationCollection, mineralRecommendation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MineralRecommendation to an array that doesn't contain it", () => {
        const mineralRecommendation: IMineralRecommendation = sampleWithRequiredData;
        const mineralRecommendationCollection: IMineralRecommendation[] = [sampleWithPartialData];
        expectedResult = service.addMineralRecommendationToCollectionIfMissing(mineralRecommendationCollection, mineralRecommendation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mineralRecommendation);
      });

      it('should add only unique MineralRecommendation to an array', () => {
        const mineralRecommendationArray: IMineralRecommendation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mineralRecommendationCollection: IMineralRecommendation[] = [sampleWithRequiredData];
        expectedResult = service.addMineralRecommendationToCollectionIfMissing(
          mineralRecommendationCollection,
          ...mineralRecommendationArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mineralRecommendation: IMineralRecommendation = sampleWithRequiredData;
        const mineralRecommendation2: IMineralRecommendation = sampleWithPartialData;
        expectedResult = service.addMineralRecommendationToCollectionIfMissing([], mineralRecommendation, mineralRecommendation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mineralRecommendation);
        expect(expectedResult).toContain(mineralRecommendation2);
      });

      it('should accept null and undefined values', () => {
        const mineralRecommendation: IMineralRecommendation = sampleWithRequiredData;
        expectedResult = service.addMineralRecommendationToCollectionIfMissing([], null, mineralRecommendation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mineralRecommendation);
      });

      it('should return initial array if no MineralRecommendation is added', () => {
        const mineralRecommendationCollection: IMineralRecommendation[] = [sampleWithRequiredData];
        expectedResult = service.addMineralRecommendationToCollectionIfMissing(mineralRecommendationCollection, undefined, null);
        expect(expectedResult).toEqual(mineralRecommendationCollection);
      });
    });

    describe('compareMineralRecommendation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMineralRecommendation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMineralRecommendation(entity1, entity2);
        const compareResult2 = service.compareMineralRecommendation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMineralRecommendation(entity1, entity2);
        const compareResult2 = service.compareMineralRecommendation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMineralRecommendation(entity1, entity2);
        const compareResult2 = service.compareMineralRecommendation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
