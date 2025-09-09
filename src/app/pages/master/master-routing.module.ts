import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GalleryComponent } from "./gallery/gallery.component";
import { CastsComponent } from "./casts/casts.component";
import { MusicComponent } from "./music/music.component";
import { QuestionComponent } from "./question/question.component";
import { MusicVideoComponent } from "./music-video/music-video.component";


const routes: Routes = [
    {
    path: "gallery",
    component: GalleryComponent,
    data: { breadcrumb: "Gallery" },
  },
   {
    path: "casts",
    component: CastsComponent,
    data: { breadcrumb: "Casts" },
  },
    {
    path: "music",
    component: MusicComponent,
    data: { breadcrumb: "Music" },
  },
    {
    path: "music-video",
    component: MusicVideoComponent,
    data: { breadcrumb: "Music Video" },
  },
    {
    path: "question",
    component: QuestionComponent,
    data: { breadcrumb: "Question" },
  },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
