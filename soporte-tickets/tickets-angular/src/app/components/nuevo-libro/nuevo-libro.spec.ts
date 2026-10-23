import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoLibro } from './nuevo-libro';

describe('NuevoLibro', () => {
  let component: NuevoLibro;
  let fixture: ComponentFixture<NuevoLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoLibro],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoLibro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
