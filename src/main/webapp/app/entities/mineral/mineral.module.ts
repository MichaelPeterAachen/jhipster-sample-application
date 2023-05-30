import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MineralComponent } from './list/mineral.component';
import { MineralDetailComponent } from './detail/mineral-detail.component';
import { MineralUpdateComponent } from './update/mineral-update.component';
import { MineralDeleteDialogComponent } from './delete/mineral-delete-dialog.component';
import { MineralRoutingModule } from './route/mineral-routing.module';

@NgModule({
  imports: [SharedModule, MineralRoutingModule],
  declarations: [MineralComponent, MineralDetailComponent, MineralUpdateComponent, MineralDeleteDialogComponent],
})
export class MineralModule {}
