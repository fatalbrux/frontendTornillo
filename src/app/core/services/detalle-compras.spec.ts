import { TestBed } from '@angular/core/testing';

import { DetalleCompras } from './detalle-compras';

describe('DetalleCompras', () => {
  let service: DetalleCompras;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleCompras);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
