import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MyPropertiesComponent } from './my-properties.component';
import { FilterPipe } from 'src/app/pipes/filter.pipe';

describe('MyPropertiesComponent', () => {
  let component: MyPropertiesComponent;
  let fixture: ComponentFixture<MyPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule, HttpClientTestingModule, NgbModule ],
      declarations: [ MyPropertiesComponent, FilterPipe ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
