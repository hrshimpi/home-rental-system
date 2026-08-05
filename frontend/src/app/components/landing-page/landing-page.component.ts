import { Component } from '@angular/core';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css'],
    standalone: false
})
export class LandingPageComponent {

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
  model = '';
  filteredCities: string[] = this.cities;

  filterCities(): void {
    const term = (this.model || '').toLowerCase();
    this.filteredCities = term
      ? this.cities.filter((city: string) => city.toLowerCase().includes(term))
      : this.cities;
  }

  dropdownValues: string[] = ['Anyone', 'Male', 'Female'];
  selectedValue!: string;

  dropdownValues2: string[] = ['One', 'Two', 'three','Four'];
  selectedValue2!: string;
}
