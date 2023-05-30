import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IMineralRecommendation } from '../mineral-recommendation.model';
import { MineralRecommendationService } from '../service/mineral-recommendation.service';

import { MineralRecommendationRoutingResolveService } from './mineral-recommendation-routing-resolve.service';

describe('MineralRecommendation routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: MineralRecommendationRoutingResolveService;
  let service: MineralRecommendationService;
  let resultMineralRecommendation: IMineralRecommendation | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(MineralRecommendationRoutingResolveService);
    service = TestBed.inject(MineralRecommendationService);
    resultMineralRecommendation = undefined;
  });

  describe('resolve', () => {
    it('should return IMineralRecommendation returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMineralRecommendation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMineralRecommendation).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMineralRecommendation = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultMineralRecommendation).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IMineralRecommendation>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMineralRecommendation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMineralRecommendation).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
