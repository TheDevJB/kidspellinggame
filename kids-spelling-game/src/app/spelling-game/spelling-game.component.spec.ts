import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellingGameComponent } from './spelling-game.component';

describe('SpellingGameComponent', () => {
  let component: SpellingGameComponent;
  let fixture: ComponentFixture<SpellingGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpellingGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
