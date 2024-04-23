import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcrHistoryComponent } from './tcr-history.component';

describe('TcrHistoryComponent', () => {
  let component: TcrHistoryComponent;
  let fixture: ComponentFixture<TcrHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcrHistoryComponent]
    });
    fixture = TestBed.createComponent(TcrHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
