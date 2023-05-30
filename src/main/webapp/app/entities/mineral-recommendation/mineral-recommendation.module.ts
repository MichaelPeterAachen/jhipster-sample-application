import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MineralRecommendationComponent } from './list/mineral-recommendation.component';
import { MineralRecommendationDetailComponent } from './detail/mineral-recommendation-detail.component';
import { MineralRecommendationUpdateComponent } from './update/mineral-recommendation-update.component';
import { MineralRecommendationDeleteDialogComponent } from './delete/mineral-recommendation-delete-dialog.component';
import { MineralRecommendationRoutingModule } from './route/mineral-recommendation-routing.module';

@NgModule({
  imports: [SharedModule, MineralRecommendationRoutingModule],
  declarations: [
    MineralRecommendationComponent,
    MineralRecommendationDetailComponent,
    MineralRecommendationUpdateComponent,
    MineralRecommendationDeleteDialogComponent,
  ],
})
export class MineralRecommendationModule {}
