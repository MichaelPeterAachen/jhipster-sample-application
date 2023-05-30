import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AmountContainedFormService } from './amount-contained-form.service';
import { AmountContainedService } from '../service/amount-contained.service';
import { IAmountContained } from '../amount-contained.model';
import { IMineral } from 'app/entities/mineral/mineral.model';
import { MineralService } from 'app/entities/mineral/service/mineral.service';
import { IFood } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';

import { AmountContainedUpdateComponent } from './amount-contained-update.component';

describe('AmountContained Management Update Component', () => {
  let comp: AmountContainedUpdateComponent;
  let fixture: ComponentFixture<AmountContainedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let amountContainedFormService: AmountContainedFormService;
  let amountContainedService: AmountContainedService;
  let mineralService: MineralService;
  let foodService: FoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AmountContainedUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AmountContainedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AmountContainedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    amountContainedFormService = TestBed.inject(AmountContainedFormService);
    amountContainedService = TestBed.inject(AmountContainedService);
    mineralService = TestBed.inject(MineralService);
    foodService = TestBed.inject(FoodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Mineral query and add missing value', () => {
      const amountContained: IAmountContained = { id: 456 };
      const mineral: IMineral = { id: 93289 };
      amountContained.mineral = mineral;

      const mineralCollection: IMineral[] = [{ id: 67105 }];
      jest.spyOn(mineralService, 'query').mockReturnValue(of(new HttpResponse({ body: mineralCollection })));
      const additionalMinerals = [mineral];
      const expectedCollection: IMineral[] = [...additionalMinerals, ...mineralCollection];
      jest.spyOn(mineralService, 'addMineralToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ amountContained });
      comp.ngOnInit();

      expect(mineralService.query).toHaveBeenCalled();
      expect(mineralService.addMineralToCollectionIfMissing).toHaveBeenCalledWith(
        mineralCollection,
        ...additionalMinerals.map(expect.objectContaining)
      );
      expect(comp.mineralsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Food query and add missing value', () => {
      const amountContained: IAmountContained = { id: 456 };
      const food: IFood = { id: 68070 };
      amountContained.food = food;

      const foodCollection: IFood[] = [{ id: 86231 }];
      jest.spyOn(foodService, 'query').mockReturnValue(of(new HttpResponse({ body: foodCollection })));
      const additionalFoods = [food];
      const expectedCollection: IFood[] = [...additionalFoods, ...foodCollection];
      jest.spyOn(foodService, 'addFoodToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ amountContained });
      comp.ngOnInit();

      expect(foodService.query).toHaveBeenCalled();
      expect(foodService.addFoodToCollectionIfMissing).toHaveBeenCalledWith(
        foodCollection,
        ...additionalFoods.map(expect.objectContaining)
      );
      expect(comp.foodsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const amountContained: IAmountContained = { id: 456 };
      const mineral: IMineral = { id: 34716 };
      amountContained.mineral = mineral;
      const food: IFood = { id: 25132 };
      amountContained.food = food;

      activatedRoute.data = of({ amountContained });
      comp.ngOnInit();

      expect(comp.mineralsSharedCollection).toContain(mineral);
      expect(comp.foodsSharedCollection).toContain(food);
      expect(comp.amountContained).toEqual(amountContained);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAmountContained>>();
      const amountContained = { id: 123 };
      jest.spyOn(amountContainedFormService, 'getAmountContained').mockReturnValue(amountContained);
      jest.spyOn(amountContainedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amountContained });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: amountContained }));
      saveSubject.complete();

      // THEN
      expect(amountContainedFormService.getAmountContained).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(amountContainedService.update).toHaveBeenCalledWith(expect.objectContaining(amountContained));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAmountContained>>();
      const amountContained = { id: 123 };
      jest.spyOn(amountContainedFormService, 'getAmountContained').mockReturnValue({ id: null });
      jest.spyOn(amountContainedService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amountContained: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: amountContained }));
      saveSubject.complete();

      // THEN
      expect(amountContainedFormService.getAmountContained).toHaveBeenCalled();
      expect(amountContainedService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAmountContained>>();
      const amountContained = { id: 123 };
      jest.spyOn(amountContainedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amountContained });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(amountContainedService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMineral', () => {
      it('Should forward to mineralService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(mineralService, 'compareMineral');
        comp.compareMineral(entity, entity2);
        expect(mineralService.compareMineral).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareFood', () => {
      it('Should forward to foodService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(foodService, 'compareFood');
        comp.compareFood(entity, entity2);
        expect(foodService.compareFood).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
