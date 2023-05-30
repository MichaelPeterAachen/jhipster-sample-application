import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MineralComponent } from '../list/mineral.component';
import { MineralDetailComponent } from '../detail/mineral-detail.component';
import { MineralUpdateComponent } from '../update/mineral-update.component';
import { MineralRoutingResolveService } from './mineral-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mineralRoute: Routes = [
  {
    path: '',
    component: MineralComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MineralDetailComponent,
    resolve: {
      mineral: MineralRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MineralUpdateComponent,
    resolve: {
      mineral: MineralRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MineralUpdateComponent,
    resolve: {
      mineral: MineralRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mineralRoute)],
  exports: [RouterModule],
})
export class MineralRoutingModule {}
