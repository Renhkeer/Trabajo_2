import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoTicket } from './nuevo-ticket';

describe('NuevoTicket', () => {
  let component: NuevoTicket;
  let fixture: ComponentFixture<NuevoTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
