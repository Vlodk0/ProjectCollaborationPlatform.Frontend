import { Component, Input } from '@angular/core';
import { scheduleReadableStreamLike } from 'rxjs/internal/scheduled/scheduleReadableStreamLike';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  //TODO: that does not sound as a good approach to me, as in the end there will be tens or hundreds of classes.
  //TODO: you can have your own buttons, with a few variants (primary, secondary, warn, accent, danger, info etc.), and you should add additional style to them in the component where it is used
  //TODO: having a separate class name for each button will bloat this component and make it hard to maintain
  @Input() context: String | undefined;
  @Input() styleContext: String | undefined;
  @Input() disabled!: boolean | undefined;
  protected readonly scheduleReadableStreamLike = scheduleReadableStreamLike;
}
