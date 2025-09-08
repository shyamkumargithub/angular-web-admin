import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterService } from '../../master.service';
import { environment } from 'src/environments/environment';

export interface QuestionDialogData {
  categories: string[];
  defaultValues?: any | null;
}

@Component({
  selector: 'CoreLab-manage-question',
  templateUrl: './manage-question.component.html',
  styleUrls: ['./manage-question.component.scss']
})
export class ManageQuestionComponent implements OnInit {
  baseUrl = environment.server;
  form: FormGroup;
  audioPreview: string | null = null;
  categories: string[] = [];
  errorMessage: string | null = null;

  readonly maxFileSize = 20 * 1024 * 1024; // 20 MB
  readonly allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ManageQuestionComponent>,
    private masterService: MasterService,
    @Inject(MAT_DIALOG_DATA) public data: QuestionDialogData
  ) {
    const isUpdate = !!data.defaultValues?.id;

    this.form = this.fb.group({
      text: [data.defaultValues?.text || '', Validators.required],
      category: [data.defaultValues?.category || '', Validators.required],
      options: this.fb.array(
        (data.defaultValues?.options || ['', '', '', '']).map((opt: string) =>
          this.fb.control(opt, Validators.required)
        )
      ),
      correctOptionIndex: [data.defaultValues?.correctOptionIndex ?? 0, Validators.required],
      audio: [null, isUpdate ? [] : [Validators.required]], // ✅ required only in create
      existingAudioUrl: [null]
    });

    if (data.defaultValues?.audio) {
      this.audioPreview = this.baseUrl + data.defaultValues.audio?.url;
      this.form.patchValue({ existingAudioUrl: this.audioPreview });
    }
  }

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.masterService.getQuizCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  triggerFileInput() {
    const input = document.getElementById('audio-input') as HTMLInputElement;
    input?.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!this.allowedTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Allowed: mp3, wav, ogg, mpeg';
        this.resetFile();
        return;
      }

      if (file.size > this.maxFileSize) {
        this.errorMessage = `File is too large. Max size is ${this.maxFileSize / (1024 * 1024)} MB`;
        this.resetFile();
        return;
      }

      this.errorMessage = null;
      this.form.patchValue({ audio: file, existingAudioUrl: null });

      const reader = new FileReader();
      reader.onload = () => {
        this.audioPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  private resetFile() {
    this.form.patchValue({ audio: null });
    this.audioPreview = this.form.get('existingAudioUrl')?.value || null;
  }

  submit() {
    if (this.form.invalid) return;

    const values = this.form.value;
    const formData = new FormData();

    formData.append('text', values.text);
    formData.append('category', values.category);
    formData.append('correctOptionIndex', values.correctOptionIndex.toString());

    values.options.forEach((option: string, index: number) => {
      formData.append(`options[${index}]`, option);
    });

    if (values.audio instanceof File) {
      formData.append('audio', values.audio);
    }

    if (this.data.defaultValues?.id) {
      this.masterService.updateQuiz(this.data.defaultValues.id, formData).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => console.error(err)
      });
    } else {
      this.masterService.createQuiz(formData).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => console.error(err)
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
