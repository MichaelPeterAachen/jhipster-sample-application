import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MineralRecommendationFormService } from './mineral-recommendation-form.service';
import { MineralRecommendationService } from '../service/mineral-recommendation.service';
import { IMineralRecommendation } from '../mineral-recommendation.model';
import { IMineral } from 'app/entities/mineral/mineral.model';
import { MineralService } from 'app/entities/mineral/service/mineral.service';

import { MineralRecommendationUpdateComponent } from './mineral-recommendation-update.component';

describe('MineralRecommendation Management Update Component', () => {
  let comp: MineralRecommendationUpdateComponent;
  let fixture: ComponentFixture<MineralRecommendationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mineralRecommendationFormService: MineralRecommendationFormService;
  let mineralRecommendationService: MineralRecommendationService;
  let mineralService: MineralService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MineralRecommendationUpdateComponent],
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
      .overrideTemplate(MineralRecommendationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MineralRecommendationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mineralRecommendationFormService = TestBed.inject(MineralRecommendationFormService);
    mineralRecommendationService = TestBed.inject(MineralRecommendationService);
    mineralService = TestBed.inject(MineralService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Mineral query and add missing value', () => {
      const mineralRecommendation: IMineralRecommendation = { id: 456 };
      const mineral: IMineral = { id: 94924 };
      mineralRecommendation.mineral = mineral;

      const mineralCollection: IMineral[] = [{ id: 21767 }];
      jest.spyOn(mineralService, 'query').mockReturnValue(of(new HttpResponse({ body: mineralCollection })));
      const additionalMinerals = [mineral];
      const expectedCollection: IMineral[] = [...additionalMinerals, ...mineralCollection];
      jest.spyOn(mineralService, 'addMineralToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mineralRecommendation });
      comp.ngOnInit();

      expect(mineralService.query).toHaveBeenCalled();
      expect(mineralService.addMineralToCollectionIfMissing).toHaveBeenCalledWith(
        mineralCollection,
        ...additionalMinerals.map(expect.objectContaining)
      );
      expect(comp.mineralsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mineralRecommendation: IMineralRecommendation = { id: 456 };
      const mineral: IMineral = { id: 17340 };
      mineralRecommendation.mineral = mineral;

      activatedRoute.data = of({ mineralRecommendation });
      comp.ngOnInit();

      expect(comp.mineralsSharedCollection).toContain(mineral);
      expect(comp.mineralRecommendation).toEqual(mineralRecommendation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMineralRecommendation>>();
      const mineralRecommendation = { id: 123 };
      jest.spyOn(mineralRecommendationFormService, 'getMineralRecommendation').mockReturnValue(mineralRecommendation);
      jest.spyOn(mineralRecommendationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mineralRecommendation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mineralRecommendation }));
      saveSubject.complete();

      // THEN
      expect(mineralRecommendationFormService.getMineralRecommendation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mineralRecommendationService.update).toHaveBeenCalledWith(expect.objectContaining(mineralRecommendation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMineralRecommendation>>();
      const mineralRecommendation = { id: 123 };
      jest.spyOn(mineralRecommendationFormService, 'getMineralRecommendation').mockReturnValue({ id: null });
      jest.spyOn(mineralRecommendationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mineralRecommendation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mineralRecommendation }));
      saveSubject.complete();

      // THEN
      expect(mineralRecommendationFormService.getMineralRecommendation).toHaveBeenCalled();
      expect(mineralRecommendationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMineralRecommendation>>();
      const mineralRecommendation = { id: 123 };
      jest.spyOn(mineralRecommendationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mineralRecommendation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mineralRecommendationService.update).toHaveBeenCalled();
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
  });
});
