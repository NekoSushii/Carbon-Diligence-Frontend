import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImoDialogComponent } from './imo-dialog.component';

describe('ImoDialogComponent', () => {
  let component: ImoDialogComponent;
  let fixture: ComponentFixture<ImoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
