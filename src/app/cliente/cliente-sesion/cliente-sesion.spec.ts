import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteSesion } from './cliente-sesion';

describe('ClienteSesion', () => {
  let component: ClienteSesion;
  let fixture: ComponentFixture<ClienteSesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteSesion],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteSesion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
