import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMusicDailogComponent } from './view-music-dailog.component';

describe('ViewMusicDailogComponent', () => {
  let component: ViewMusicDailogComponent;
  let fixture: ComponentFixture<ViewMusicDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMusicDailogComponent]
    });
    fixture = TestBed.createComponent(ViewMusicDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
