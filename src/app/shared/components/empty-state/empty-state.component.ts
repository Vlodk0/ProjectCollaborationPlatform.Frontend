import {Component, Input} from '@angular/core';

@Component({
  selector: 'collabro-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() public title: string;
  @Input() public subtitle: string;
}
