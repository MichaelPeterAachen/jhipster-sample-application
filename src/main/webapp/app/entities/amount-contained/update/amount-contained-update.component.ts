import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AmountContainedFormService, AmountContainedFormGroup } from './amount-contained-form.service';
import { IAmountContained } from '../amount-contained.model';
import { AmountContainedService } from '../service/amount-contained.service';
import { IMineral } from 'app/entities/mineral/mineral.model';
import { MineralService } from 'app/entities/mineral/service/mineral.service';
import { IFood } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';
import { Unit } from 'app/entities/enumerations/unit.model';

@Component({
  selector: 'jhi-amount-contained-update',
  templateUrl: './amount-contained-update.component.html',
})
export class AmountContainedUpdateComponent implements OnInit {
  isSaving = false;
  amountContained: IAmountContained | null = null;
  unitValues = Object.keys(Unit);

  mineralsSharedCollection: IMineral[] = [];
  foodsSharedCollection: IFood[] = [];

  editForm: AmountContainedFormGroup = this.amountContainedFormService.createAmountContainedFormGroup();

  constructor(
    protected amountContainedService: AmountContainedService,
    protected amountContainedFormService: AmountContainedFormService,
    protected mineralService: MineralService,
    protected foodService: FoodService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMineral = (o1: IMineral | null, o2: IMineral | null): boolean => this.mineralService.compareMineral(o1, o2);

  compareFood = (o1: IFood | null, o2: IFood | null): boolean => this.foodService.compareFood(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ amountContained }) => {
      this.amountContained = amountContained;
      if (amountContained) {
        this.updateForm(amountContained);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const amountContained = this.amountContainedFormService.getAmountContained(this.editForm);
    if (amountContained.id !== null) {
      this.subscribeToSaveResponse(this.amountContainedService.update(amountContained));
    } else {
      this.subscribeToSaveResponse(this.amountContainedService.create(amountContained));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAmountContained>>): void {
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

  protected updateForm(amountContained: IAmountContained): void {
    this.amountContained = amountContained;
    this.amountContainedFormService.resetForm(this.editForm, amountContained);

    this.mineralsSharedCollection = this.mineralService.addMineralToCollectionIfMissing<IMineral>(
      this.mineralsSharedCollection,
      amountContained.mineral
    );
    this.foodsSharedCollection = this.foodService.addFoodToCollectionIfMissing<IFood>(this.foodsSharedCollection, amountContained.food);
  }

  protected loadRelationshipsOptions(): void {
    this.mineralService
      .query()
      .pipe(map((res: HttpResponse<IMineral[]>) => res.body ?? []))
      .pipe(
        map((minerals: IMineral[]) =>
          this.mineralService.addMineralToCollectionIfMissing<IMineral>(minerals, this.amountContained?.mineral)
        )
      )
      .subscribe((minerals: IMineral[]) => (this.mineralsSharedCollection = minerals));

    this.foodService
      .query()
      .pipe(map((res: HttpResponse<IFood[]>) => res.body ?? []))
      .pipe(map((foods: IFood[]) => this.foodService.addFoodToCollectionIfMissing<IFood>(foods, this.amountContained?.food)))
      .subscribe((foods: IFood[]) => (this.foodsSharedCollection = foods));
  }
}
