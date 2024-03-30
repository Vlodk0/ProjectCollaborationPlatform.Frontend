import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() inputStyleContext: String | undefined;
  @Input() inputPlaceholderContext: String | undefined;
  @Input() inputTypeContext: String | undefined;
}
