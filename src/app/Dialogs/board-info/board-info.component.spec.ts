import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardInfoComponent } from './board-info.component';

describe('BoardInfoComponent', () => {
  let component: BoardInfoComponent;
  let fixture: ComponentFixture<BoardInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardInfoComponent]
    });
    fixture = TestBed.createComponent(BoardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
