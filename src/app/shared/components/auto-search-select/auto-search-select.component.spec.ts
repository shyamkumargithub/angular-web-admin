import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSearchSelectComponent } from './auto-search-select.component';

describe('AutoSearchSelectComponent', () => {
  let component: AutoSearchSelectComponent;
  let fixture: ComponentFixture<AutoSearchSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoSearchSelectComponent]
    });
    fixture = TestBed.createComponent(AutoSearchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
