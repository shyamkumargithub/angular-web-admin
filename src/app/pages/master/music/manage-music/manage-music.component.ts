import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MasterService } from "../../master.service";
import { Media, MetadataResponse } from "src/app/interface/Media";
import { environment } from "src/environments/environment";

@Component({
  selector: 'CoreLab-manage-music',
  templateUrl: './manage-music.component.html',
  styleUrls: ['./manage-music.component.scss']
})
export class ManageMusicComponent {
  baseUrl=environment.server
  musicForm: FormGroup;
  metaData: MetadataResponse;
  thumbnailPreview: string | ArrayBuffer | null = null;
  audioPreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ManageMusicComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: "CREATE" | "UPDATE";
      title: string;
      payload: Media;
    },
    private _snackBar: MatSnackBar,
    private masterService: MasterService
  ) {
    this.musicForm = this.fb.group({
      title: ["", Validators.required],
      genre: ["", Validators.required],
      year: [undefined],
      language: ['', Validators.required],
      thumbnail: [null, this.data.action === "CREATE" ? Validators.required : []],
      file: [null, this.data.action === "CREATE" ? Validators.required : []],
      artist: [undefined],
      composer: [undefined],
    });

    if (data.payload) {
      this.musicForm.patchValue({
        title: data.payload?.audioMetadata?.title,
        genre: data.payload?.audioMetadata?.genre,
        year: data.payload?.audioMetadata?.year,
        language: data.payload?.audioMetadata?.language,
        artist: data.payload?.audioMetadata?.artist,
        composer: data.payload?.audioMetadata?.composer,
      });
      this.thumbnailPreview =this.baseUrl+ data.payload?.thumbnail;
      this.audioPreview = this.baseUrl+data.payload?.url;
    }

    this.getMetadata();
  }

  onThumbnailSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        this._snackBar.open("Only image files are allowed", "Close", { duration: 3000 });
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2 MB max
        this._snackBar.open("Thumbnail max size is 2MB", "Close", { duration: 3000 });
        return;
      }
      this.musicForm.patchValue({ thumbnail: file });
      const reader = new FileReader();
      reader.onload = () => this.thumbnailPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (!file.type.startsWith("audio/")) {
        this._snackBar.open("Only audio files are allowed", "Close", { duration: 3000 });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10 MB max
        this._snackBar.open("Audio max size is 10MB", "Close", { duration: 3000 });
        return;
      }
      this.musicForm.patchValue({ file: file });
      const reader = new FileReader();
      reader.onload = () => this.audioPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.musicForm.markAllAsTouched();
    if (this.musicForm.invalid) {
      this._snackBar.open("Invalid form", "Close", {
        duration: 3000,
        panelClass: ["style-error"],
      });
      return;
    }

    const formData = new FormData();
    Object.keys(this.musicForm.value).forEach((key) => {
      if (this.musicForm.value[key] !== null) {
        formData.append(key, this.musicForm.value[key]);
      }
    });

    if (this.data.action === "CREATE") {
      this.createMusic(formData);
    } else {
      formData.append("id", this.data.payload.id);
      this.updateMusic(formData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private createMusic(payload: FormData): void {
    this.masterService.uploadMusicApi(payload).subscribe({
      next: (data) => {
        this._snackBar.open("Music created successfully", "Close", {
          duration: 3000,
          panelClass: ["style-success"],
        });
        this.dialogRef.close(data);
      },
      error: (err) => {
        this._snackBar.open(err.error?.message || "Creation failed", "Close", {
          duration: 5000,
          panelClass: ["style-error"],
        });
      },
    });
  }

  private updateMusic(payload: FormData): void {
    this.masterService.updateMusicApi(this.data.payload.id, payload).subscribe({
      next: (data) => {
        this._snackBar.open("Music updated successfully", "Close", {
          duration: 3000,
          panelClass: ["style-success"],
        });
        this.dialogRef.close(data);
      },
      error: (err) => {
        this._snackBar.open(err.error?.message || "Update failed", "Close", {
          duration: 5000,
          panelClass: ["style-error"],
        });
      },
    });
  }

  getMetadata() {
    this.masterService.getMetadataApi().subscribe({
      next: (data) => this.metaData = data,
      error: (error) => console.log(error),
    });
  }
}
