import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from '../../master.service';
import { environment } from 'src/environments/environment';
import { Actor } from 'src/app/interface/Actor';

@Component({
  selector: 'CoreLab-upload-media',
  templateUrl: './upload-media.component.html',
  styleUrls: ['./upload-media.component.scss']
})
export class UploadMediaComponent {
  baseUrl = environment.server;
  castForm: FormGroup;
  thumbnailPreview: string | null = null;
  filePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UploadMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: "IMAGE" | "VIDEO", id: number }
  ) {
    this.castForm = this.fb.group({
      caption: ['', [Validators.required, Validators.minLength(3)]],
      thumbnail: [null],
      file: [null]
    });
  }

  triggerFileInput(inputId: string): void {
    document.getElementById(inputId)?.click();
  }

onFileChange(event: any, field: 'thumbnail' | 'file'): void {
  const file = event.target.files[0];
  if (!file) return;

  let maxSize = 0;

  // Thumbnail is always an image
  if (field === 'thumbnail') {
    maxSize = 2 * 1024 * 1024; // 2MB
    if (!file.type.startsWith('image/')) {
      this._snackBar.open('Only image files are allowed for thumbnail', 'Close', { duration: 3000 });
      return;
    }
  }

  // File may be image or video based on this.data.type
  if (field === 'file') {
    if (this.data.type === 'IMAGE') {
      maxSize = 2 * 1024 * 1024; // 2MB
      if (!file.type.startsWith('image/')) {
        this._snackBar.open('Only image files are allowed', 'Close', { duration: 3000 });
        return;
      }
    } else if (this.data.type === 'VIDEO') {
      maxSize = 10 * 1024 * 1024; // 10MB
      if (!file.type.startsWith('video/')) {
        this._snackBar.open('Only video files are allowed', 'Close', { duration: 3000 });
        return;
      }
    }
  }

  // Size check
  if (file.size > maxSize) {
    this._snackBar.open(
      field === 'thumbnail'
        ? 'Thumbnail must be less than 2MB'
        : this.data.type === 'IMAGE'
          ? 'Image must be less than 2MB'
          : 'Video must be less than 10MB',
      'Close',
      { duration: 3000 }
    );
    return;
  }

  // Update form
  this.castForm.patchValue({ [field]: file });
  this.castForm.get(field)?.updateValueAndValidity();

  // Preview
  const reader = new FileReader();
  reader.onload = () => {
    if (field === 'thumbnail') {
      this.thumbnailPreview = reader.result as string;
    } else {
      this.filePreview = reader.result as string;
    }
  };
  reader.readAsDataURL(file);
}


  clearFile(field: 'thumbnail' | 'file'): void {
    if (field === 'thumbnail') this.thumbnailPreview = null;
    else this.filePreview = null;
    this.castForm.patchValue({ [field]: null });
  }

  onSubmit(): void {
    if (this.castForm.invalid) {
      this.castForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('caption', this.castForm.value.caption.trim());

    if (this.castForm.value.thumbnail instanceof File) {
      formData.append("thumbnail", this.castForm.value.thumbnail);
    }
    if (this.castForm.value.file instanceof File) {
      formData.append("file", this.castForm.value.file);
    }

    if (this.data.type === 'VIDEO') {
      this.addVideo(this.data.id, formData);
    } else {
      this.addImage(this.data.id, formData);
    }
  }

  private addImage(id: number, formData: FormData): void {
    this.masterService.addActorImage(id, formData).subscribe({
      next: (actor: Actor) => {
        this._snackBar.open('Cast image uploaded successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(actor);
      },
      error: (err) => {
        this._snackBar.open(err.error?.message || 'Image upload failed', 'Close', { duration: 5000 });
      }
    });
  }

  private addVideo(id: number, formData: FormData): void {
    this.masterService.addActorVideo(id, formData).subscribe({
      next: (actor: Actor) => {
        this._snackBar.open('Cast video uploaded successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(actor);
      },
      error: (err) => {
        this._snackBar.open(err.error?.message || 'Video upload failed', 'Close', { duration: 5000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
