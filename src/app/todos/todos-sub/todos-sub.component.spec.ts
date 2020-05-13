import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosSubComponent } from './todos-sub.component';

describe('TodosSubComponent', () => {
  let component: TodosSubComponent;
  let fixture: ComponentFixture<TodosSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
