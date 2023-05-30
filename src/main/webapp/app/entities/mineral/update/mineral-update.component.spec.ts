import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MineralFormService } from './mineral-form.service';
import { MineralService } from '../service/mineral.service';
import { IMineral } from '../mineral.model';

import { MineralUpdateComponent } from './mineral-update.component';

describe('Mineral Management Update Component', () => {
  let comp: MineralUpdateComponent;
  let fixture: ComponentFixture<MineralUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mineralFormService: MineralFormService;
  let mineralService: MineralService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MineralUpdateComponent],
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
      .overrideTemplate(MineralUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MineralUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mineralFormService = TestBed.inject(MineralFormService);
    mineralService = TestBed.inject(MineralService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mineral: IMineral = { id: 456 };

      activatedRoute.data = of({ mineral });
      comp.ngOnInit();

      expect(comp.mineral).toEqual(mineral);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMineral>>();
      const mineral = { id: 123 };
      jest.spyOn(mineralFormService, 'getMineral').mockReturnValue(mineral);
      jest.spyOn(mineralService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mineral });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mineral }));
      saveSubject.complete();

      // THEN
      expect(mineralFormService.getMineral).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mineralService.update).toHaveBeenCalledWith(expect.objectContaining(mineral));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMineral>>();
      const mineral = { id: 123 };
      jest.spyOn(mineralFormService, 'getMineral').mockReturnValue({ id: null });
      jest.spyOn(mineralService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mineral: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mineral }));
      saveSubject.complete();

      // THEN
      expect(mineralFormService.getMineral).toHaveBeenCalled();
      expect(mineralService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMineral>>();
      const mineral = { id: 123 };
      jest.spyOn(mineralService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mineral });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mineralService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
