import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MineralService } from '../service/mineral.service';

import { MineralComponent } from './mineral.component';

describe('Mineral Management Component', () => {
  let comp: MineralComponent;
  let fixture: ComponentFixture<MineralComponent>;
  let service: MineralService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'mineral', component: MineralComponent }]), HttpClientTestingModule],
      declarations: [MineralComponent],
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
      .overrideTemplate(MineralComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MineralComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MineralService);

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
    expect(comp.minerals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mineralService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMineralIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMineralIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
