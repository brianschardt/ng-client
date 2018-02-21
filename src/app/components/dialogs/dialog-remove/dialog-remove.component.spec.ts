import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemoveComponent } from './dialog-remove.component';

describe('DialogRemoveComponent', () => {
  let component: DialogRemoveComponent;
  let fixture: ComponentFixture<DialogRemoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRemoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
