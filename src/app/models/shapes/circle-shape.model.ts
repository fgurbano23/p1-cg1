import { VertexInterface } from '../../interfaces/vertex.interface';
import { PrimitiveEnum } from '../../enum/primitive.enum';
import { CanvasShapeModel } from './canvas-shape.model';
import { CanvasModel } from '../layout/canvas.model';

export class CircleShapeModel extends CanvasShapeModel {
  public x: number;
  public y: number;
  public r: number;

  constructor(
    vertexList: Array<VertexInterface>,
    color: string,
    background: string,
  ) {
    super(PrimitiveEnum.CIRCLE, vertexList, color, background);
    this.x = 0;
    this.y = 0;
    this.r = 0;
  }

  drawBySoftware(): void {
    const length = this.vertexList.length - 1;

    const xc = (this.vertexList[0].x + this.vertexList[length].x) / 2;
    // const yc = (this.vertexList[0].y + this.vertexList[length].y) / 2;

    // Se fija para evitar desplazamientos en el eje y
    const yc = this.vertexList[0].y;

    this.r = Math.abs(this.vertexList[length].x - this.vertexList[0].x) / 2;
    let p = 1 - this.r;

    this.setCoords(0, this.r);

    this.plotPoints(xc, yc);

    let isDraw = false;
    while (!isDraw) {
      if (this.x >= this.y) {
        isDraw = true;
        // CanvasModel.ctx!.closePath();
        break;
      }

      this.x++;

      if (p < 0) {
        p += 2 * this.x + 1;
      } else {
        this.y--;
        p += 2 * (this.x - this.y) + 1;
      }

      this.plotPoints(xc, yc);
    }
  }

  drawByHardware(): void {
    this.drawBySoftware();
  }

  isInBounds(x: number, y: number): boolean {
    const length = this.vertexList.length - 1;
    const xc = (this.vertexList[0].x + this.vertexList[length].x) / 2;
    const yc = this.vertexList[0].y;

    this.r = Math.abs(this.vertexList[length].x - this.vertexList[0].x) / 2;

    // https://math.stackexchange.com/questions/198764/how-to-know-if-a-point-is-inside-a-circle
    const inner = Math.abs((x - xc) * (x - xc)) + Math.abs((y - yc) * (y - yc));
    const d = Math.sqrt(inner);

    return d <= this.r;
  }

  setCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  plotPoints(xc: number, yc: number) {
    // Print background line by line
    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.backgroundColor;
    CanvasModel.ctx!.moveTo(xc, yc);
    CanvasModel.ctx?.lineTo(xc + this.x, yc + this.y);
    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();

    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.backgroundColor;
    CanvasModel.ctx!.moveTo(xc, yc);
    CanvasModel.ctx?.lineTo(xc - this.x, yc + this.y);
    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();

    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.backgroundColor;
    CanvasModel.ctx!.moveTo(xc, yc);
    CanvasModel.ctx?.lineTo(xc + this.x, yc - this.y);
    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();

    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.backgroundColor;
    CanvasModel.ctx!.moveTo(xc, yc);
    CanvasModel.ctx?.lineTo(xc - this.x, yc - this.y);
    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();

    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.backgroundColor;
    CanvasModel.ctx!.moveTo(xc, yc);
    CanvasModel.ctx?.lineTo(xc + this.y, yc + this.x);
    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();

    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.backgroundColor;
    CanvasModel.ctx!.moveTo(xc, yc);
    CanvasModel.ctx?.lineTo(xc - this.y, yc + this.x);
    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();

    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.backgroundColor;
    CanvasModel.ctx!.moveTo(xc, yc);
    CanvasModel.ctx?.lineTo(xc + this.y, yc - this.x);
    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();

    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.backgroundColor;
    CanvasModel.ctx!.moveTo(xc, yc);
    CanvasModel.ctx?.lineTo(xc - this.y, yc - this.x);
    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();

    // Print outline border
    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.fillStyle = this.color;
    CanvasModel.ctx?.rect(xc + this.x, yc + this.y, 1, 1);
    CanvasModel.ctx?.rect(xc - this.x, yc + this.y, 1, 1);
    CanvasModel.ctx?.rect(xc + this.x, yc - this.y, 1, 1);
    CanvasModel.ctx?.rect(xc - this.x, yc - this.y, 1, 1);

    CanvasModel.ctx?.rect(xc + this.y, yc + this.x, 1, 1);
    CanvasModel.ctx?.rect(xc - this.y, yc + this.x, 1, 1);
    CanvasModel.ctx?.rect(xc + this.y, yc - this.x, 1, 1);
    CanvasModel.ctx?.rect(xc - this.y, yc - this.x, 1, 1);
    CanvasModel.ctx!.fill();
    CanvasModel.ctx!.closePath();
  }

  getCenter() {
    const length = this.vertexList.length - 1;
    return {
      x: Math.floor((this.vertexList[0].x + this.vertexList[length].x) / 2),
      y: Math.floor((this.vertexList[0].y + this.vertexList[length].y) / 2),
    };
  }
}
