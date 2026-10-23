import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarLibro } from './editar-libro';

describe('EditarLibro', () => {
  let component: EditarLibro;
  let fixture: ComponentFixture<EditarLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarLibro],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarLibro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
