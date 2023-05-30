import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AmountContainedDetailComponent } from './amount-contained-detail.component';

describe('AmountContained Management Detail Component', () => {
  let comp: AmountContainedDetailComponent;
  let fixture: ComponentFixture<AmountContainedDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmountContainedDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ amountContained: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AmountContainedDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AmountContainedDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load amountContained on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.amountContained).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
