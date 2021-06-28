import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadManyComponent } from './upload-many.component';

describe('UploadManyComponent', () => {
  let component: UploadManyComponent;
  let fixture: ComponentFixture<UploadManyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadManyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadManyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
