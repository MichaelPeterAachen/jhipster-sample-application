import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MineralRecommendationDetailComponent } from './mineral-recommendation-detail.component';

describe('MineralRecommendation Management Detail Component', () => {
  let comp: MineralRecommendationDetailComponent;
  let fixture: ComponentFixture<MineralRecommendationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MineralRecommendationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mineralRecommendation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MineralRecommendationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MineralRecommendationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mineralRecommendation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mineralRecommendation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
