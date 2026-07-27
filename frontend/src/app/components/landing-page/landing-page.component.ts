import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownConfig, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, filter, map, merge } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit{

  constructor(config: NgbDropdownConfig) {
    config.autoClose = 'outside';
  }

  ngOnInit(): void {
    
  }

  cities:any =[
    'Ahmadnagar',
    'Akola',
    'Amravati',
    'Aurangabad',
    'Bhandara',
    'Bhusawal',
    'Bid',
    'Buldhana',
    'Chandrapur',
    'Daulatabad',
    'Dhule',
    'Jalgaon',
    'Kalyan',
    'Karli',
    'Kolhapur',
    'Mahabaleshwar',
    'Malegaon',
    'Matheran',
    'Mumbai',
    'Nagpur',
    'Nanded',
    'Nashik',
    'Osmanabad',
    'Pandharpur',
    'Parbhani',
    'Pune',
    'Ratnagiri',
    'Sangli',
    'Satara',
    'Sevagram',
    'Solapur',
    'Thane',
    'Ulhasnagar',
    'Vasai-Virar',
    'Wardha',
    'Yavatmal',
  ]
  model: any;
  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
	focus$ = new Subject<string>();
	click$ = new Subject<string>();

	search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
		const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
		const inputFocus$ = this.focus$;

		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			map((term: string) =>
				(term === '' ? this.cities : this.cities.filter((v: string) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10),
			),
		);
	};

  dropdownValues: string[] = ['Anyone', 'Male', 'Female'];
  selectedValue!: string;

  dropdownValues2: string[] = ['One', 'Two', 'three','Four'];
  selectedValue2!: string;

  selectValue(value: string): void {
    this.selectedValue = value;
  }

  selectValue2(value: string): void {
    this.selectedValue2 = value;
  }
}
