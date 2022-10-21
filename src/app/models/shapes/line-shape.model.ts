import { DrawInterface } from '../../interfaces/draw.interface';
import { CanvasShapeModel } from './canvas-shape.model';
import { VertexInterface } from '../../interfaces/vertex.interface';
import { PrimitiveEnum } from '../../enum/primitive.enum';
import { CanvasModel } from '../layout/canvas.model';

export class LineShapeModel extends CanvasShapeModel implements DrawInterface {
  constructor(
    vertexList: Array<VertexInterface>,
    color: string,
    background: string,
  ) {
    super(PrimitiveEnum.LINE, vertexList, color, background);
  }

  drawByHardware(): void {
    const length = this.vertexList.length - 1;
    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.color;

    CanvasModel.ctx!.moveTo(this.vertexList[0].x, this.vertexList[0].y);
    CanvasModel.ctx!.lineTo(
      this.vertexList[length].x,
      this.vertexList[length].y,
    );
    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();

    this.drawSelectedShapeIfRequired();
  }

  drawBySoftware(): void {
    const length = this.vertexList.length - 1;
    CanvasModel.ctx!.strokeStyle = this.color;
    this.plotLine(
      this.vertexList[0].x,
      this.vertexList[0].y,
      this.vertexList[length].x,
      this.vertexList[length].y,
    );
    this.drawSelectedShapeIfRequired();
  }

  isInBounds(x: number, y: number): boolean {
    console.log(x, y);
    const m =
      (this.vertexList[1].y - this.vertexList[0].y) /
      (this.vertexList[1].x - this.vertexList[0].x);

    // y = mx +b
    // y - mx = b
    const b = this.vertexList[1].y - m * this.vertexList[1].x;

    // mx - y + b  = 0

    const d = Math.abs(m * x + -y + b) / Math.sqrt(m * m + -1 * -1);

    console.log(d);
    return d <= 10;
  }

  drawVertex(): void {}

  getCenter() {
    const length = this.vertexList.length - 1;
    return {
      x: Math.floor((this.vertexList[0].x + this.vertexList[length].x) / 2),
      y: Math.floor((this.vertexList[0].y + this.vertexList[length].y) / 2),
    };
  }

  drawSelectedShapeIfRequired() {
    if (this.isSelected) {
      const length = this.vertexList.length - 1;
      const xc = (this.vertexList[0].x + this.vertexList[length].x) / 2;
      const yc = (this.vertexList[0].y + this.vertexList[length].y) / 2;
      CanvasModel.ctx!.beginPath();
      CanvasModel.ctx!.strokeStyle = this.outlineColor;
      CanvasModel.ctx?.rect(xc - 5, yc - 5, 10, 10);
      CanvasModel.ctx!.stroke();
      CanvasModel.ctx!.closePath();
    }
  }
}
