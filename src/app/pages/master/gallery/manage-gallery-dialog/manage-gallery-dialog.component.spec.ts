import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGalleryDialogComponent } from './manage-gallery-dialog.component';

describe('ManageGalleryDialogComponent', () => {
  let component: ManageGalleryDialogComponent;
  let fixture: ComponentFixture<ManageGalleryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageGalleryDialogComponent]
    });
    fixture = TestBed.createComponent(ManageGalleryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
