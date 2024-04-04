import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() context: String | undefined;
  @Input() styleContext: String | undefined;
  @Input() disabled!: boolean | undefined;
}
