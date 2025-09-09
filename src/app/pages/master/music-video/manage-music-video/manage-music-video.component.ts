// manage-gallery-dialog.component.ts
import { Component, Inject, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MasterService } from "../../master.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'CoreLab-manage-music-video',
  templateUrl: './manage-music-video.component.html',
  styleUrls: ['./manage-music-video.component.scss']
})
export class ManageMusicVideoComponent implements OnInit {
  form: FormGroup;
  thumbnailPreview: string | null = null;
  filePreview: string | null = null;

  @ViewChild('thumbnailInput') thumbnailInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ManageMusicVideoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: "CREATE" | "UPDATE";
      payload: any;
      title: string;
    },
    private _snackBar: MatSnackBar,
    private masterService: MasterService
  ) {
    this.form = this.fb.group({
      caption: ["", [Validators.maxLength(200)]],
      thumbnail: [null],
      category:[null],
      file: [null]
    });
  }

  ngOnInit(): void {
    if (this.data?.action === "UPDATE" && this.data.payload) {
      this.form.patchValue({
        caption: this.data.payload?.videoMetadata?.caption || "",
        category: this.data.payload?.videoMetadata?.category || ""
      });

      // Set thumbnail if exists
      if (this.data.payload.thumbnail) {
        this.form.get("thumbnail")?.setValue(environment.server+ this.data.payload.thumbnail); 
      }

      // Set file if exists
      if (this.data.payload.url) {
        this.form.get("file")?.setValue(environment.server+this.data.payload.url);
      }
    }
  }

  // Handle thumbnail selection
  onThumbnailSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.form.get('thumbnail')?.setErrors({ fileType: true });
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      this.form.get('thumbnail')?.setErrors({ fileSize: true });
      return;
    }

    // Clear any previous errors
    this.form.get('thumbnail')?.setErrors(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.thumbnailPreview = reader.result as string;
      this.form.get('thumbnail')?.setValue(file);
    };
    reader.readAsDataURL(file);
  }

  // Handle file selection
// Handle file selection
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  // ✅ Only allow video files
  const validTypes = ["video/mp4", "video/webm", "video/ogg"];
  if (!validTypes.includes(file.type)) {
    this.form.get('file')?.setErrors({ fileType: true });
    return;
  }

  // ✅ Validate file size (50MB max)
  if (file.size > 50 * 1024 * 1024) {
    this.form.get('file')?.setErrors({ fileSize: true });
    return;
  }

  // ✅ Clear any previous errors
  this.form.get('file')?.setErrors(null);

  // Store video file (no preview as image)
  this.filePreview = null;
  this.form.get('file')?.setValue(file);
}


  // Check if file is an image
  isImageFile(file: any): boolean {
    if (file instanceof File) {
      return file.type.startsWith('image/');
    } else if (typeof file === 'string') {
      return /\.(jpg|jpeg|png|webp)$/i.test(file);
    }
    return false;
  }

  // Get file name for display
  getFileName(file: any): string {
    if (file instanceof File) {
      return file.name;
    } else if (typeof file === 'string') {
      return file.split('/').pop() || 'File';
    }
    return 'File';
  }

  // Remove thumbnail
  removeThumbnail(): void {
    this.thumbnailPreview = null;
    this.form.get('thumbnail')?.setValue(null);
    this.form.get('thumbnail')?.setErrors(null);
  }

  // Remove file
  removeFile(): void {
    this.filePreview = null;
    this.form.get('file')?.setValue(null);
    this.form.get('file')?.setErrors(null);
  }

  // Cancel dialog
  onCancel(): void {
    this.dialogRef.close();
  }

  // Submit form
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append('caption', this.form.value.caption || '');
    formData.append('category', this.form.value.category || '');
    // Append thumbnail if it's a file
    if (this.form.value.thumbnail instanceof File) {
      formData.append('thumbnail', this.form.value.thumbnail);
    } else if (this.form.value.thumbnail) {
      // If it's a URL (existing thumbnail), just send the URL
      formData.append('thumbnailUrl', this.form.value.thumbnail);
    }

    // Append file if it's a file
    if (this.form.value.file instanceof File) {
      formData.append('file', this.form.value.file);
    } else if (this.form.value.file) {
      // If it's a URL (existing file), just send the URL
      formData.append('fileUrl', this.form.value.file);
    }

    if (this.data.action === "UPDATE") {
      formData.append("id", this.data.payload.id);
      this.updateGalleryVideo(formData);
    } else {
      this.createGalleryVideo(formData);
    }
  }

  // API call to create gallery
  private createGalleryVideo(formData: FormData): void {
    this.masterService.uploadVideo(formData).subscribe({
      next: (data) => {
        this._snackBar.open("Gallery video item created successfully", "Close", {
          duration: 3000,
          panelClass: ["style-success"],
        });
        this.dialogRef.close(data);
      },
      error: (err) => {
        this._snackBar.open(err.error.message || "Creation failed", "Close", {
          duration: 5000,
          panelClass: ["style-error"],
        });
      },
    });
  }

  // API call to update gallery
  private updateGalleryVideo(formData: FormData): void {
    this.masterService.updateVideo(this.data.payload.id, formData).subscribe({
      next: (data) => {
        this._snackBar.open("Gallery video item updated successfully", "Close", {
          duration: 3000,
          panelClass: ["style-success"],
        });
        this.dialogRef.close(data);
      },
      error: (err) => {
        this._snackBar.open(err?.error?.message , "Close", {
          duration: 5000,
          panelClass: ["style-error"],
        });
         this.dialogRef.close(this.data);
      },
    });
  }
}