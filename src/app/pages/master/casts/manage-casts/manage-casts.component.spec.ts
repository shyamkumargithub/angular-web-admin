import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCastsComponent } from './manage-casts.component';

describe('ManageCastsComponent', () => {
  let component: ManageCastsComponent;
  let fixture: ComponentFixture<ManageCastsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageCastsComponent]
    });
    fixture = TestBed.createComponent(ManageCastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
