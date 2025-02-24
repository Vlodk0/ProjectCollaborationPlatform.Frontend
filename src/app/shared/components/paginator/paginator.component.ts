import {Component, EventEmitter, Input, Output} from '@angular/core';
import {debounceTime, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'collabro-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() public showMoreButton = false;
  @Input() public loadDataByClick = false;
  @Input() public flexDirection: 'row' | 'column' = 'column';

  @Output() public loadDataEmitter = new EventEmitter<void>();

  private reachedListBottom$: Subject<void> = new Subject();
  private unsubscribe$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.subscribeScrollBottom();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onListScroll(event): void {
    if (this.loadDataByClick) {
      return;
    }

    const offsetBottom = event.target.scrollHeight - event.target.offsetHeight - event.target.scrollTop;

    if (offsetBottom > 200) {
      return;
    }

    this.reachedListBottom$.next();
  }

  public loadData(): void {
    if (!this.loadDataByClick) {
      return;
    }
    this.loadDataEmitter.emit();
  }

  private subscribeScrollBottom(): void {
    this.reachedListBottom$
      .pipe(
        debounceTime(100),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: () => {
          this.loadDataEmitter.emit();
        }
      });
  }

}
