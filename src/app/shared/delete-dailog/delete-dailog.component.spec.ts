import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDailogComponent } from './delete-dailog.component';

describe('DeleteDailogComponent', () => {
  let component: DeleteDailogComponent;
  let fixture: ComponentFixture<DeleteDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteDailogComponent]
    });
    fixture = TestBed.createComponent(DeleteDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
