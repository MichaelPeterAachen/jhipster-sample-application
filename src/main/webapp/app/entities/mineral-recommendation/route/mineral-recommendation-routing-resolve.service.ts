import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMineralRecommendation } from '../mineral-recommendation.model';
import { MineralRecommendationService } from '../service/mineral-recommendation.service';

@Injectable({ providedIn: 'root' })
export class MineralRecommendationRoutingResolveService implements Resolve<IMineralRecommendation | null> {
  constructor(protected service: MineralRecommendationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMineralRecommendation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mineralRecommendation: HttpResponse<IMineralRecommendation>) => {
          if (mineralRecommendation.body) {
            return of(mineralRecommendation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
