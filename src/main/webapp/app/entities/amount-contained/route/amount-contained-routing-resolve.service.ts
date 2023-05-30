import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAmountContained } from '../amount-contained.model';
import { AmountContainedService } from '../service/amount-contained.service';

@Injectable({ providedIn: 'root' })
export class AmountContainedRoutingResolveService implements Resolve<IAmountContained | null> {
  constructor(protected service: AmountContainedService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAmountContained | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((amountContained: HttpResponse<IAmountContained>) => {
          if (amountContained.body) {
            return of(amountContained.body);
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
