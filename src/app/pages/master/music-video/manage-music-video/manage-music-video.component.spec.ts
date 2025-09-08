import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMusicVideoComponent } from './manage-music-video.component';

describe('ManageMusicVideoComponent', () => {
  let component: ManageMusicVideoComponent;
  let fixture: ComponentFixture<ManageMusicVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageMusicVideoComponent]
    });
    fixture = TestBed.createComponent(ManageMusicVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
