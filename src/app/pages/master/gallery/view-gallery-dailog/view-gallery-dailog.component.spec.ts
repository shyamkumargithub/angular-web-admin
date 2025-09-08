import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGalleryDailogComponent } from './view-gallery-dailog.component';

describe('ViewGalleryDailogComponent', () => {
  let component: ViewGalleryDailogComponent;
  let fixture: ComponentFixture<ViewGalleryDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewGalleryDailogComponent]
    });
    fixture = TestBed.createComponent(ViewGalleryDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
