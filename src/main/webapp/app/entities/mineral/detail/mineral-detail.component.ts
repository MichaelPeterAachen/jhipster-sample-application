import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMineral } from '../mineral.model';

@Component({
  selector: 'jhi-mineral-detail',
  templateUrl: './mineral-detail.component.html',
})
export class MineralDetailComponent implements OnInit {
  mineral: IMineral | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mineral }) => {
      this.mineral = mineral;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
