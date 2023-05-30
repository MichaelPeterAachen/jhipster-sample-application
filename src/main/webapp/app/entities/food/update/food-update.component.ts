import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FoodFormService, FoodFormGroup } from './food-form.service';
import { IFood } from '../food.model';
import { FoodService } from '../service/food.service';

@Component({
  selector: 'jhi-food-update',
  templateUrl: './food-update.component.html',
})
export class FoodUpdateComponent implements OnInit {
  isSaving = false;
  food: IFood | null = null;

  editForm: FoodFormGroup = this.foodFormService.createFoodFormGroup();

  constructor(protected foodService: FoodService, protected foodFormService: FoodFormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ food }) => {
      this.food = food;
      if (food) {
        this.updateForm(food);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const food = this.foodFormService.getFood(this.editForm);
    if (food.id !== null) {
      this.subscribeToSaveResponse(this.foodService.update(food));
    } else {
      this.subscribeToSaveResponse(this.foodService.create(food));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFood>>): void {
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

  protected updateForm(food: IFood): void {
    this.food = food;
    this.foodFormService.resetForm(this.editForm, food);
  }
}
