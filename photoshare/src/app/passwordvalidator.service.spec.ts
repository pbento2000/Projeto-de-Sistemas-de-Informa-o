import { TestBed } from '@angular/core/testing';

import { PasswordvalidatorService } from './passwordvalidator.service';

describe('PasswordvalidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PasswordvalidatorService = TestBed.get(PasswordvalidatorService);
    expect(service).toBeTruthy();
  });
});
