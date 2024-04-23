import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcrCanvasContainerComponent } from './tcr-canvas-container.component';

describe('TcrCanvasContainerComponent', () => {
  let component: TcrCanvasContainerComponent;
  let fixture: ComponentFixture<TcrCanvasContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcrCanvasContainerComponent]
    });
    fixture = TestBed.createComponent(TcrCanvasContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
