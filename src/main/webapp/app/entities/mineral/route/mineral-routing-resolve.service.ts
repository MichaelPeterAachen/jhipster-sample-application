import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMineral } from '../mineral.model';
import { MineralService } from '../service/mineral.service';

@Injectable({ providedIn: 'root' })
export class MineralRoutingResolveService implements Resolve<IMineral | null> {
  constructor(protected service: MineralService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMineral | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mineral: HttpResponse<IMineral>) => {
          if (mineral.body) {
            return of(mineral.body);
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
