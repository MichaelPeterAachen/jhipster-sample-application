import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'mineral',
        data: { pageTitle: 'myApp.mineral.home.title' },
        loadChildren: () => import('./mineral/mineral.module').then(m => m.MineralModule),
      },
      {
        path: 'mineral-recommendation',
        data: { pageTitle: 'myApp.mineralRecommendation.home.title' },
        loadChildren: () => import('./mineral-recommendation/mineral-recommendation.module').then(m => m.MineralRecommendationModule),
      },
      {
        path: 'food',
        data: { pageTitle: 'myApp.food.home.title' },
        loadChildren: () => import('./food/food.module').then(m => m.FoodModule),
      },
      {
        path: 'amount-contained',
        data: { pageTitle: 'myApp.amountContained.home.title' },
        loadChildren: () => import('./amount-contained/amount-contained.module').then(m => m.AmountContainedModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
