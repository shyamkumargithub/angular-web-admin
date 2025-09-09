import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actor } from 'src/app/interface/Actor';
import { MasterService } from '../../master.service';
import { environment } from 'src/environments/environment';

export interface CastFormData { id?: number; username?: string; about?: string; thumbnail?: File | string; photo?: File | string; }

@Component({
  selector: 'CoreLab-manage-casts',
  templateUrl: './manage-casts.component.html',
  styleUrls: ['./manage-casts.component.scss']
})
export class ManageCastsComponent {
  baseUrl=environment.server
  castForm: FormGroup;
  thumbnailPreview: string | null = null;
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ManageCastsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: "UPDATE"|"CREATE", title: string, payload: Actor }
  ) {
    this.castForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      about: ['', Validators.required],
      thumbnail: [null],
      photo: [null]
    });

    if (data?.payload) {
      this.castForm.patchValue({
        username: data.payload.info.username,
        about: data.payload.info.about
      });
      if (data.payload?.profile?.thumbnail) this.thumbnailPreview =this.baseUrl+ data.payload?.profile?.thumbnail;
      if (data.payload?.profile?.url) this.photoPreview =this.baseUrl+ data.payload?.profile?.url;
    }
  }

  triggerFileInput(inputId: string): void {
    document.getElementById(inputId)?.click();
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      this.castForm.patchValue({ [field]: file });
      this.castForm.get(field)?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'thumbnail') {
          this.thumbnailPreview = reader.result as string;
        } else {
          this.photoPreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  clearFile(field: string): void {
    if (field === 'thumbnail') this.thumbnailPreview = null;
    else this.photoPreview = null;
    this.castForm.patchValue({ [field]: null });
  }

  // ✅ MAIN SUBMIT
 onSubmit(): void {
  if (this.castForm.invalid) {
    this.castForm.markAllAsTouched();
    return;
  }

  // 👉 Require thumbnail & photo only for CREATE
  if (this.data?.action !== 'UPDATE') {
    if (!this.castForm.value.thumbnail || !(this.castForm.value.thumbnail instanceof File)) {
      this._snackBar.open('Thumbnail is required', 'Close', {
        duration: 3000,
        panelClass: ['style-error'],
      });
      return;
    }
    if (!this.castForm.value.photo || !(this.castForm.value.photo instanceof File)) {
      this._snackBar.open('Photo is required', 'Close', {
        duration: 3000,
        panelClass: ['style-error'],
      });
      return;
    }
  }

  const formData = new FormData();


  // Build info object as JSON
  const info = {
    username: this.castForm.value.username.trim(),
    about: this.castForm.value.about.trim()
  };
  formData.append('info', JSON.stringify(info));

  // Attach files
  if (this.castForm.value.thumbnail instanceof File) {
     formData.append("profile.thumbnail", this.castForm.value.thumbnail);
     
  }
  if (this.castForm.value.photo instanceof File) {
   formData.append("profile.file", this.castForm.value.photo);
  }
    // if (this.castForm.value.photo instanceof File || this.castForm.value.thumbnail instanceof File) {
    //    formData.append('profile.id', this.data?.payload?.profile.id.toString());
    // }
formData.forEach((value, key) => {
  console.log(key, value);
});
  // Handle update
  if (this.data?.action === 'UPDATE') {
    formData.append('profile.id', this.data?.payload?.profile.id.toString());
    this.updateActor(this.data.payload.id, formData);
  } else {
    this.createActor(formData);
  }
}

  private createActor(formData: FormData): void {
    this.masterService.createActorApi(formData).subscribe({
      next: (actor: Actor) => {
        this._snackBar.open('Actor created successfully', 'Close', {
          duration: 3000,
          panelClass: ['style-success']
        });
        this.dialogRef.close(actor);
      },
      error: (err) => {
        this._snackBar.open(err.error?.message || 'Creation failed', 'Close', {
          duration: 5000,
          panelClass: ['style-error']
        });
      }
    });
  }

  private updateActor(id: number, formData: FormData): void {
    this.masterService.updateActorApi(id, formData).subscribe({
      next: (actor: Actor) => {
        this._snackBar.open('Actor updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['style-success']
        });
        this.dialogRef.close(actor);
      },
      error: (err) => {
        this._snackBar.open(err.error?.message || 'Update failed', 'Close', {
          duration: 5000,
          panelClass: ['style-error']
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
