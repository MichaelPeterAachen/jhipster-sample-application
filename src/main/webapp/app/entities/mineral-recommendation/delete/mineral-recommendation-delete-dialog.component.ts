import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMineralRecommendation } from '../mineral-recommendation.model';
import { MineralRecommendationService } from '../service/mineral-recommendation.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mineral-recommendation-delete-dialog.component.html',
})
export class MineralRecommendationDeleteDialogComponent {
  mineralRecommendation?: IMineralRecommendation;

  constructor(protected mineralRecommendationService: MineralRecommendationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mineralRecommendationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
