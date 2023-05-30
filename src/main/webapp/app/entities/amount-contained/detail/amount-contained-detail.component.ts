import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAmountContained } from '../amount-contained.model';

@Component({
  selector: 'jhi-amount-contained-detail',
  templateUrl: './amount-contained-detail.component.html',
})
export class AmountContainedDetailComponent implements OnInit {
  amountContained: IAmountContained | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ amountContained }) => {
      this.amountContained = amountContained;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
