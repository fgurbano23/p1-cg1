import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { PrimitiveEnum } from '../enum/primitive.enum';

@Directive({
  selector: '[appCursor]',
})
export class CursorDirective {
  @Input() action!: string | undefined;

  @HostListener('mousedown', ['$event.target'])
  onMouseDown(e: MouseEvent) {
    if (this.action === PrimitiveEnum.SELECTION) {
      this.renderer.addClass(this.elRef.nativeElement, 'selecting');
      return;
    }

    this.renderer.addClass(this.elRef.nativeElement, 'drawing');
  }

  @HostListener('mouseup', ['$event.target'])
  onMouseUp(e: MouseEvent) {
    if (this.action === PrimitiveEnum.SELECTION) {
      this.renderer.removeClass(this.elRef.nativeElement, 'selecting');
      return;
    }

    this.renderer.removeClass(this.elRef.nativeElement, 'drawing');
  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
}
