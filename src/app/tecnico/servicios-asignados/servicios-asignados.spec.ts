import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosAsignados } from './servicios-asignados';

describe('ServiciosAsignados', () => {
  let component: ServiciosAsignados;
  let fixture: ComponentFixture<ServiciosAsignados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosAsignados],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosAsignados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
