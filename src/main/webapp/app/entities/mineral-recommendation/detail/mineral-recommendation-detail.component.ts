import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMineralRecommendation } from '../mineral-recommendation.model';

@Component({
  selector: 'jhi-mineral-recommendation-detail',
  templateUrl: './mineral-recommendation-detail.component.html',
})
export class MineralRecommendationDetailComponent implements OnInit {
  mineralRecommendation: IMineralRecommendation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mineralRecommendation }) => {
      this.mineralRecommendation = mineralRecommendation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
