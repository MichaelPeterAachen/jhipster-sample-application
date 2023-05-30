import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FoodService } from '../service/food.service';

import { FoodComponent } from './food.component';

describe('Food Management Component', () => {
  let comp: FoodComponent;
  let fixture: ComponentFixture<FoodComponent>;
  let service: FoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'food', component: FoodComponent }]), HttpClientTestingModule],
      declarations: [FoodComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(FoodComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FoodComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FoodService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.foods?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to foodService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFoodIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFoodIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
