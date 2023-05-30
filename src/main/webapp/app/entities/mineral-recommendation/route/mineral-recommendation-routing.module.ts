import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MineralRecommendationComponent } from '../list/mineral-recommendation.component';
import { MineralRecommendationDetailComponent } from '../detail/mineral-recommendation-detail.component';
import { MineralRecommendationUpdateComponent } from '../update/mineral-recommendation-update.component';
import { MineralRecommendationRoutingResolveService } from './mineral-recommendation-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mineralRecommendationRoute: Routes = [
  {
    path: '',
    component: MineralRecommendationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MineralRecommendationDetailComponent,
    resolve: {
      mineralRecommendation: MineralRecommendationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MineralRecommendationUpdateComponent,
    resolve: {
      mineralRecommendation: MineralRecommendationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MineralRecommendationUpdateComponent,
    resolve: {
      mineralRecommendation: MineralRecommendationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mineralRecommendationRoute)],
  exports: [RouterModule],
})
export class MineralRecommendationRoutingModule {}
