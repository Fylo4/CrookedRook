import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceInfoPanelComponent } from './piece-info-panel.component';

describe('PieceInfoPanelComponent', () => {
  let component: PieceInfoPanelComponent;
  let fixture: ComponentFixture<PieceInfoPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PieceInfoPanelComponent]
    });
    fixture = TestBed.createComponent(PieceInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
