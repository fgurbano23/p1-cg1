import { VertexInterface } from '../../interfaces/vertex.interface';
import { PrimitiveEnum } from '../../enum/primitive.enum';
import { CanvasShapeModel } from './canvas-shape.model';
import { CanvasModel } from '../layout/canvas.model';

export class EllipseShapeModel extends CanvasShapeModel {
  public x: number;
  public y: number;

  // radios
  public rX: number;
  public rY: number;

  constructor(
    vertexList: Array<VertexInterface>,
    color: string,
    background: string,
  ) {
    super(PrimitiveEnum.ELLIPSE, vertexList, color, background);
    this.x = 0;
    this.y = 0;

    this.rX = 0;
    this.rY = 0;
  }

  drawBySoftware(): void {
    const length = this.vertexList.length - 1;

    const xc = (this.vertexList[0].x + this.vertexList[length].x) / 2;
    const yc = (this.vertexList[0].y + this.vertexList[length].y) / 2;

    this.rX = Math.abs(this.vertexList[length].x - this.vertexList[0].x) / 2;
    this.rY = Math.abs(this.vertexList[length].y - this.vertexList[0].y) / 2;

    const Rx2 = this.rX * this.rX;
    const Ry2 = this.rY * this.rY;

    const twoRx2 = 2 * Rx2;
    const twoRy2 = 2 * Ry2;

    this.setCoords(0, this.rY);

    let p;
    let pX = 0;
    let pY = twoRx2 * this.y;

    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.color;

    this.plotPoints(xc, yc);

    let isDrawFirstRegion = false;
    let isDrawSecondRegion = false;

    // Se pinta la primera region
    p = this.round(Ry2 - Rx2 * this.rY + 0.25 * Rx2);
    while (!isDrawFirstRegion) {
      if (pX >= pY) {
        isDrawFirstRegion = true;
        CanvasModel.ctx!.stroke();
        CanvasModel.ctx!.closePath();
        break;
      }

      this.x++;
      pX += twoRy2;

      if (p < 0) {
        p += Ry2 + pX;
      } else {
        this.y--;
        pY -= twoRx2;
        p += Ry2 + pX - pY;
      }

      this.plotPoints(xc, yc);
    }

    // Se pinta la segunda region
    p = this.round(
      Ry2 * ((this.x + 0.5) * (this.x + 0.5)) +
        Rx2 * ((this.y - 1) * (this.y - 1)) -
        Rx2 * Ry2,
    );
    while (!isDrawSecondRegion) {
      if (this.y <= 0) {
        isDrawSecondRegion = true;
        CanvasModel.ctx!.stroke();
        CanvasModel.ctx!.closePath();
        break;
      }

      this.y--;
      pY -= twoRx2;

      if (p > 0) {
        p += Rx2 - pY;
      } else {
        this.x++;
        pX += twoRy2;
        p += Rx2 - pY + pX;
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
    const yc = (this.vertexList[0].y + this.vertexList[length].y) / 2;

    this.rX = Math.abs(this.vertexList[length].x - this.vertexList[0].x) / 2;
    this.rY = Math.abs(this.vertexList[length].y - this.vertexList[0].y) / 2;

    const Rx2 = this.rX * this.rX;
    const Ry2 = this.rY * this.rY;

    // https://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse
    return ((x - xc) * (x - xc)) / Rx2 + ((y - yc) * (y - yc)) / Ry2 <= 1;
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

    // Print outline border
    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.color;
    CanvasModel.ctx?.rect(xc + this.x, yc + this.y, 1, 1);
    CanvasModel.ctx?.rect(xc - this.x, yc + this.y, 1, 1);
    CanvasModel.ctx?.rect(xc + this.x, yc - this.y, 1, 1);
    CanvasModel.ctx?.rect(xc - this.x, yc - this.y, 1, 1);
    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();
  }

  round(value: number) {
    return Math.trunc(value + 0.5);
  }

  getCenter() {
    const length = this.vertexList.length - 1;
    return {
      x: Math.floor((this.vertexList[0].x + this.vertexList[length].x) / 2),
      y: Math.floor((this.vertexList[0].y + this.vertexList[length].y) / 2),
    };
  }
}
