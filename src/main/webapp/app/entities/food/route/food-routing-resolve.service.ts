import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFood } from '../food.model';
import { FoodService } from '../service/food.service';

@Injectable({ providedIn: 'root' })
export class FoodRoutingResolveService implements Resolve<IFood | null> {
  constructor(protected service: FoodService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFood | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((food: HttpResponse<IFood>) => {
          if (food.body) {
            return of(food.body);
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
