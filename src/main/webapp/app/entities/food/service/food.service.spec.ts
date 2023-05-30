import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFood } from '../food.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../food.test-samples';

import { FoodService } from './food.service';

const requireRestSample: IFood = {
  ...sampleWithRequiredData,
};

describe('Food Service', () => {
  let service: FoodService;
  let httpMock: HttpTestingController;
  let expectedResult: IFood | IFood[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FoodService);
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

    it('should create a Food', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const food = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(food).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Food', () => {
      const food = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(food).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Food', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Food', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Food', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFoodToCollectionIfMissing', () => {
      it('should add a Food to an empty array', () => {
        const food: IFood = sampleWithRequiredData;
        expectedResult = service.addFoodToCollectionIfMissing([], food);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(food);
      });

      it('should not add a Food to an array that contains it', () => {
        const food: IFood = sampleWithRequiredData;
        const foodCollection: IFood[] = [
          {
            ...food,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFoodToCollectionIfMissing(foodCollection, food);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Food to an array that doesn't contain it", () => {
        const food: IFood = sampleWithRequiredData;
        const foodCollection: IFood[] = [sampleWithPartialData];
        expectedResult = service.addFoodToCollectionIfMissing(foodCollection, food);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(food);
      });

      it('should add only unique Food to an array', () => {
        const foodArray: IFood[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const foodCollection: IFood[] = [sampleWithRequiredData];
        expectedResult = service.addFoodToCollectionIfMissing(foodCollection, ...foodArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const food: IFood = sampleWithRequiredData;
        const food2: IFood = sampleWithPartialData;
        expectedResult = service.addFoodToCollectionIfMissing([], food, food2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(food);
        expect(expectedResult).toContain(food2);
      });

      it('should accept null and undefined values', () => {
        const food: IFood = sampleWithRequiredData;
        expectedResult = service.addFoodToCollectionIfMissing([], null, food, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(food);
      });

      it('should return initial array if no Food is added', () => {
        const foodCollection: IFood[] = [sampleWithRequiredData];
        expectedResult = service.addFoodToCollectionIfMissing(foodCollection, undefined, null);
        expect(expectedResult).toEqual(foodCollection);
      });
    });

    describe('compareFood', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFood(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFood(entity1, entity2);
        const compareResult2 = service.compareFood(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFood(entity1, entity2);
        const compareResult2 = service.compareFood(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFood(entity1, entity2);
        const compareResult2 = service.compareFood(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
