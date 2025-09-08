
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MasterRoutingModule } from "./master-routing.module";
import { MasterService } from "./master.service";
import { MaterialModule } from "src/@fury/shared/material-components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { FurySharedModule } from "src/@fury/fury-shared.module";
import { FuryCardModule } from "src/@fury/shared/card/card.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
import { GalleryComponent } from './gallery/gallery.component';
import { ManageGalleryDialogComponent } from './gallery/manage-gallery-dialog/manage-gallery-dialog.component';
import { QuestionComponent } from './question/question.component';
import { ManageQuestionComponent } from './question/manage-question/manage-question.component';
import { MusicComponent } from './music/music.component';
import { ManageMusicComponent } from './music/manage-music/manage-music.component';
import { CastsComponent } from './casts/casts.component';
import { ManageCastsComponent } from './casts/manage-casts/manage-casts.component';
import { ViewActorComponent } from './casts/view-actor/view-actor.component';
import { UploadMediaComponent } from './casts/upload-media/upload-media.component';
import { MusicVideoComponent } from './music-video/music-video.component';
import { ManageMusicVideoComponent } from './music-video/manage-music-video/manage-music-video.component';
import { ViewGalleryDailogComponent } from './gallery/view-gallery-dailog/view-gallery-dailog.component';
import { MatChipsModule } from "@angular/material/chips";

@NgModule({
  declarations: [

    GalleryComponent,
    ManageGalleryDialogComponent,
    QuestionComponent,
    ManageQuestionComponent,
    MusicComponent,
    ManageMusicComponent,
    CastsComponent,
    ManageCastsComponent,
    ViewActorComponent,
    UploadMediaComponent,
    MusicVideoComponent,
    ManageMusicVideoComponent,
    ViewGalleryDailogComponent ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    MaterialModule,
    MatCheckboxModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    FurySharedModule,
    FuryCardModule,
    MatChipsModule,
    SharedModule,
  ],
  providers: [MasterService],
})
export class MasterModule {}
