import { TestBed } from '@angular/core/testing';

import { Diagnosticos } from './diagnosticos';

describe('Diagnosticos', () => {
  let service: Diagnosticos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Diagnosticos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
