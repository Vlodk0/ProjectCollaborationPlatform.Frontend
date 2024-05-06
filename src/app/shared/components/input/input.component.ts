import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() inputStyleContext: String | undefined;
  //TODO: it's better to pass the text itself as a placeholder, than some 'code' - in the end there will be hundreds of 'contexts', and it you will be forced to support and maintain that
  @Input() inputPlaceholderContext: String | undefined;
  //TODO: just pass type from outside, but limit it with options like:
  @Input() inputTypeContext: 'email' | 'text' | 'password';
  @Input() inputFormControlName: String | undefined;
}
