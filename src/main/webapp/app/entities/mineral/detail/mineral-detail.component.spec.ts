import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MineralDetailComponent } from './mineral-detail.component';

describe('Mineral Management Detail Component', () => {
  let comp: MineralDetailComponent;
  let fixture: ComponentFixture<MineralDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MineralDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mineral: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MineralDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MineralDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mineral on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mineral).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
