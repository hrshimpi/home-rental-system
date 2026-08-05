import { Pipe, PipeTransform } from '@angular/core';

// Replaces ng2-search-filter (last published 2019, no Angular 16+
// compatible version exists) - this reproduces the one behavior this
// app actually used its 'filter' pipe for: given an array of objects
// and a search term, keep items where any property's string form
// contains the term (case-insensitive). Used chained multiple times
// in templates, e.g. `properties | filter:a | filter:b`.
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], term: any): any[] {
    if (!items) {
      return items;
    }
    if (term === null || term === undefined || term === '') {
      return items;
    }

    const lowerTerm = term.toString().toLowerCase();

    return items.filter((item) =>
      Object.values(item).some(
        (value) => value !== null && value !== undefined && value.toString().toLowerCase().includes(lowerTerm)
      )
    );
  }
}
