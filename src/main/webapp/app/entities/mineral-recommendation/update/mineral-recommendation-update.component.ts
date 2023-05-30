import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MineralRecommendationFormService, MineralRecommendationFormGroup } from './mineral-recommendation-form.service';
import { IMineralRecommendation } from '../mineral-recommendation.model';
import { MineralRecommendationService } from '../service/mineral-recommendation.service';
import { IMineral } from 'app/entities/mineral/mineral.model';
import { MineralService } from 'app/entities/mineral/service/mineral.service';
import { Unit } from 'app/entities/enumerations/unit.model';
import { RecommendationPeriodTime } from 'app/entities/enumerations/recommendation-period-time.model';

@Component({
  selector: 'jhi-mineral-recommendation-update',
  templateUrl: './mineral-recommendation-update.component.html',
})
export class MineralRecommendationUpdateComponent implements OnInit {
  isSaving = false;
  mineralRecommendation: IMineralRecommendation | null = null;
  unitValues = Object.keys(Unit);
  recommendationPeriodTimeValues = Object.keys(RecommendationPeriodTime);

  mineralsSharedCollection: IMineral[] = [];

  editForm: MineralRecommendationFormGroup = this.mineralRecommendationFormService.createMineralRecommendationFormGroup();

  constructor(
    protected mineralRecommendationService: MineralRecommendationService,
    protected mineralRecommendationFormService: MineralRecommendationFormService,
    protected mineralService: MineralService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMineral = (o1: IMineral | null, o2: IMineral | null): boolean => this.mineralService.compareMineral(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mineralRecommendation }) => {
      this.mineralRecommendation = mineralRecommendation;
      if (mineralRecommendation) {
        this.updateForm(mineralRecommendation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mineralRecommendation = this.mineralRecommendationFormService.getMineralRecommendation(this.editForm);
    if (mineralRecommendation.id !== null) {
      this.subscribeToSaveResponse(this.mineralRecommendationService.update(mineralRecommendation));
    } else {
      this.subscribeToSaveResponse(this.mineralRecommendationService.create(mineralRecommendation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMineralRecommendation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(mineralRecommendation: IMineralRecommendation): void {
    this.mineralRecommendation = mineralRecommendation;
    this.mineralRecommendationFormService.resetForm(this.editForm, mineralRecommendation);

    this.mineralsSharedCollection = this.mineralService.addMineralToCollectionIfMissing<IMineral>(
      this.mineralsSharedCollection,
      mineralRecommendation.mineral
    );
  }

  protected loadRelationshipsOptions(): void {
    this.mineralService
      .query()
      .pipe(map((res: HttpResponse<IMineral[]>) => res.body ?? []))
      .pipe(
        map((minerals: IMineral[]) =>
          this.mineralService.addMineralToCollectionIfMissing<IMineral>(minerals, this.mineralRecommendation?.mineral)
        )
      )
      .subscribe((minerals: IMineral[]) => (this.mineralsSharedCollection = minerals));
  }
}
