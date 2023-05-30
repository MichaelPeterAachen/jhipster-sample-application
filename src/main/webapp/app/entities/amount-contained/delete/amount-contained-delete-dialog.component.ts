import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAmountContained } from '../amount-contained.model';
import { AmountContainedService } from '../service/amount-contained.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './amount-contained-delete-dialog.component.html',
})
export class AmountContainedDeleteDialogComponent {
  amountContained?: IAmountContained;

  constructor(protected amountContainedService: AmountContainedService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.amountContainedService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
