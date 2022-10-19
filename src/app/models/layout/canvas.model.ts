import { ElementRef } from '@angular/core';

export class CanvasModel {
  element: HTMLCanvasElement;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  background: string = '#ffffff';

  static ctx: CanvasRenderingContext2D | null;

  constructor(elRef: ElementRef | undefined) {
    this.element = elRef?.nativeElement;
    const bounds = this.element.getBoundingClientRect();

    this.width = bounds.width;
    this.height = bounds.height;

    this.offsetX = this.element.offsetLeft;
    this.offsetY = this.element.offsetTop;

    CanvasModel.ctx = this.element.getContext('2d');
  }

  setBackground() {
    CanvasModel.ctx!.fillStyle = this.background;
    CanvasModel.ctx!.fillRect(0, 0, this.width, this.height);
  }
}
