import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AmountContainedComponent } from '../list/amount-contained.component';
import { AmountContainedDetailComponent } from '../detail/amount-contained-detail.component';
import { AmountContainedUpdateComponent } from '../update/amount-contained-update.component';
import { AmountContainedRoutingResolveService } from './amount-contained-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const amountContainedRoute: Routes = [
  {
    path: '',
    component: AmountContainedComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AmountContainedDetailComponent,
    resolve: {
      amountContained: AmountContainedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AmountContainedUpdateComponent,
    resolve: {
      amountContained: AmountContainedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AmountContainedUpdateComponent,
    resolve: {
      amountContained: AmountContainedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(amountContainedRoute)],
  exports: [RouterModule],
})
export class AmountContainedRoutingModule {}
