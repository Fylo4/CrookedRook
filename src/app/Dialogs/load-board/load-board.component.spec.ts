import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBoardComponent } from './load-board.component';

describe('LoadBoardComponent', () => {
  let component: LoadBoardComponent;
  let fixture: ComponentFixture<LoadBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadBoardComponent]
    });
    fixture = TestBed.createComponent(LoadBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
