import { TestBed } from '@angular/core/testing';

import { Lotes } from './lotes';

describe('Lotes', () => {
  let service: Lotes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lotes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
