import { TestBed } from '@angular/core/testing';

import { Electrodomesticos } from './electrodomesticos';

describe('Electrodomesticos', () => {
  let service: Electrodomesticos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Electrodomesticos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
