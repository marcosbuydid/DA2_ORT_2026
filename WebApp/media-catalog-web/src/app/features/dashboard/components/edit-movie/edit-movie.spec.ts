import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMovie } from './edit-movie';

describe('EditMovie', () => {
  let component: EditMovie;
  let fixture: ComponentFixture<EditMovie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMovie],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMovie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
