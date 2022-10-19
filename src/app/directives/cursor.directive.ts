import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCursor]',
})
export class CursorDirective {
  @HostListener('mousedown', ['$event.target'])
  onMouseDown(e: MouseEvent) {
    this.renderer.addClass(this.elRef.nativeElement, 'drawing');
  }

  @HostListener('mouseup', ['$event.target'])
  onMouseUp(e: MouseEvent) {
    this.renderer.removeClass(this.elRef.nativeElement, 'drawing');
  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
}
