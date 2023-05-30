import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMineral } from '../mineral.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mineral.test-samples';

import { MineralService } from './mineral.service';

const requireRestSample: IMineral = {
  ...sampleWithRequiredData,
};

describe('Mineral Service', () => {
  let service: MineralService;
  let httpMock: HttpTestingController;
  let expectedResult: IMineral | IMineral[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MineralService);
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

    it('should create a Mineral', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mineral = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mineral).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mineral', () => {
      const mineral = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mineral).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mineral', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mineral', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Mineral', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMineralToCollectionIfMissing', () => {
      it('should add a Mineral to an empty array', () => {
        const mineral: IMineral = sampleWithRequiredData;
        expectedResult = service.addMineralToCollectionIfMissing([], mineral);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mineral);
      });

      it('should not add a Mineral to an array that contains it', () => {
        const mineral: IMineral = sampleWithRequiredData;
        const mineralCollection: IMineral[] = [
          {
            ...mineral,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMineralToCollectionIfMissing(mineralCollection, mineral);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mineral to an array that doesn't contain it", () => {
        const mineral: IMineral = sampleWithRequiredData;
        const mineralCollection: IMineral[] = [sampleWithPartialData];
        expectedResult = service.addMineralToCollectionIfMissing(mineralCollection, mineral);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mineral);
      });

      it('should add only unique Mineral to an array', () => {
        const mineralArray: IMineral[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mineralCollection: IMineral[] = [sampleWithRequiredData];
        expectedResult = service.addMineralToCollectionIfMissing(mineralCollection, ...mineralArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mineral: IMineral = sampleWithRequiredData;
        const mineral2: IMineral = sampleWithPartialData;
        expectedResult = service.addMineralToCollectionIfMissing([], mineral, mineral2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mineral);
        expect(expectedResult).toContain(mineral2);
      });

      it('should accept null and undefined values', () => {
        const mineral: IMineral = sampleWithRequiredData;
        expectedResult = service.addMineralToCollectionIfMissing([], null, mineral, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mineral);
      });

      it('should return initial array if no Mineral is added', () => {
        const mineralCollection: IMineral[] = [sampleWithRequiredData];
        expectedResult = service.addMineralToCollectionIfMissing(mineralCollection, undefined, null);
        expect(expectedResult).toEqual(mineralCollection);
      });
    });

    describe('compareMineral', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMineral(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMineral(entity1, entity2);
        const compareResult2 = service.compareMineral(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMineral(entity1, entity2);
        const compareResult2 = service.compareMineral(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMineral(entity1, entity2);
        const compareResult2 = service.compareMineral(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
