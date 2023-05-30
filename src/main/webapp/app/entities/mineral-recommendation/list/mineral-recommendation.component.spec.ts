import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MineralRecommendationService } from '../service/mineral-recommendation.service';

import { MineralRecommendationComponent } from './mineral-recommendation.component';

describe('MineralRecommendation Management Component', () => {
  let comp: MineralRecommendationComponent;
  let fixture: ComponentFixture<MineralRecommendationComponent>;
  let service: MineralRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'mineral-recommendation', component: MineralRecommendationComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [MineralRecommendationComponent],
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
      .overrideTemplate(MineralRecommendationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MineralRecommendationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MineralRecommendationService);

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
    expect(comp.mineralRecommendations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mineralRecommendationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMineralRecommendationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMineralRecommendationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
