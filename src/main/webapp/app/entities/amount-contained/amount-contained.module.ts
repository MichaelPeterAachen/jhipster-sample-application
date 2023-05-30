import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AmountContainedComponent } from './list/amount-contained.component';
import { AmountContainedDetailComponent } from './detail/amount-contained-detail.component';
import { AmountContainedUpdateComponent } from './update/amount-contained-update.component';
import { AmountContainedDeleteDialogComponent } from './delete/amount-contained-delete-dialog.component';
import { AmountContainedRoutingModule } from './route/amount-contained-routing.module';

@NgModule({
  imports: [SharedModule, AmountContainedRoutingModule],
  declarations: [
    AmountContainedComponent,
    AmountContainedDetailComponent,
    AmountContainedUpdateComponent,
    AmountContainedDeleteDialogComponent,
  ],
})
export class AmountContainedModule {}
