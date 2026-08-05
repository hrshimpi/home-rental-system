import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-star-rating',
    templateUrl: './star-rating.component.html',
    styleUrls: ['./star-rating.component.css'],
    standalone: false,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => StarRatingComponent),
            multi: true,
        },
    ],
})
export class StarRatingComponent implements ControlValueAccessor {
  @Input() max = 5;
  @Input() readonly = false;
  @Input() rate = 0;

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  get stars(): number[] {
    return Array.from({ length: this.max }, (_, i) => i + 1);
  }

  select(star: number): void {
    if (this.readonly) {
      return;
    }
    this.rate = star;
    this.onChange(star);
    this.onTouched();
  }

  writeValue(value: number): void {
    this.rate = value || 0;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
