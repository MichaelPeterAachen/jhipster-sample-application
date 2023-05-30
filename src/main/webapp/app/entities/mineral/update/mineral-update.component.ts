import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MineralFormService, MineralFormGroup } from './mineral-form.service';
import { IMineral } from '../mineral.model';
import { MineralService } from '../service/mineral.service';

@Component({
  selector: 'jhi-mineral-update',
  templateUrl: './mineral-update.component.html',
})
export class MineralUpdateComponent implements OnInit {
  isSaving = false;
  mineral: IMineral | null = null;

  editForm: MineralFormGroup = this.mineralFormService.createMineralFormGroup();

  constructor(
    protected mineralService: MineralService,
    protected mineralFormService: MineralFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mineral }) => {
      this.mineral = mineral;
      if (mineral) {
        this.updateForm(mineral);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mineral = this.mineralFormService.getMineral(this.editForm);
    if (mineral.id !== null) {
      this.subscribeToSaveResponse(this.mineralService.update(mineral));
    } else {
      this.subscribeToSaveResponse(this.mineralService.create(mineral));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMineral>>): void {
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

  protected updateForm(mineral: IMineral): void {
    this.mineral = mineral;
    this.mineralFormService.resetForm(this.editForm, mineral);
  }
}
