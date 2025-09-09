import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVideoDailogComponent } from './view-video-dailog.component';

describe('ViewVideoDailogComponent', () => {
  let component: ViewVideoDailogComponent;
  let fixture: ComponentFixture<ViewVideoDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewVideoDailogComponent]
    });
    fixture = TestBed.createComponent(ViewVideoDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
