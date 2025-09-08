import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviewDialogComponent } from './file-preview-dialog.component';

describe('FilePreviewDialogComponent', () => {
  let component: FilePreviewDialogComponent;
  let fixture: ComponentFixture<FilePreviewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilePreviewDialogComponent]
    });
    fixture = TestBed.createComponent(FilePreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
