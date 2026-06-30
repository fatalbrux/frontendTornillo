import { TestBed } from '@angular/core/testing';

import { UnidadesMedida } from './unidades-medida';

describe('UnidadesMedida', () => {
  let service: UnidadesMedida;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnidadesMedida);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
