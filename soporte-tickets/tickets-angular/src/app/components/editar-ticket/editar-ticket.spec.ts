import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EditarTicket } from './editar-ticket';

describe('EditarTicket', () => {
  let component: EditarTicket;
  let fixture: ComponentFixture<EditarTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTicket],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
