import { DrawInterface } from '../../interfaces/draw.interface';
import { CanvasShapeModel } from './canvas-shape.model';
import { VertexInterface } from '../../interfaces/vertex.interface';
import { PrimitiveEnum } from '../../enum/primitive.enum';
import { CanvasModel } from '../layout/canvas.model';

export class TriangleShapeModel
  extends CanvasShapeModel
  implements DrawInterface
{
  constructor(
    vertexList: Array<VertexInterface>,
    color: string,
    background: string,
    filled: boolean,
  ) {
    super(PrimitiveEnum.TRIANGLE, vertexList, color, background, filled);
  }

  drawByHardware(): void {
    this.vertexList.sort((a: VertexInterface, b: VertexInterface) => {
      if (a.x < b.x) {
        return -1;
      }
      if (a.x > b.x) {
        return 1;
      }
      return 0;
    });

    // Draw the initial points
    if (this.vertexList.length < 3) {
      CanvasModel.ctx!.beginPath();
      CanvasModel.ctx!.fillStyle = 'red';
      CanvasModel.ctx!.fillRect(
        this.vertexList[0].x,
        this.vertexList[0].y,
        5,
        5,
      );
      if (this.vertexList.length === 2) {
        const length = this.vertexList.length - 1;
        CanvasModel.ctx!.fillRect(
          this.vertexList[length].x,
          this.vertexList[length].y,
          5,
          5,
        );
      }
      CanvasModel.ctx!.stroke();
      CanvasModel.ctx!.closePath();
      return;
    }

    // Draw the triangle
    if (this.filled) {
      this.fillTriangle();
    }

    if (this.vertexList.length === 3) {
      CanvasModel.ctx!.beginPath();
      CanvasModel.ctx!.strokeStyle = this.color;
      CanvasModel.ctx!.moveTo(this.vertexList[0].x, this.vertexList[0].y);
      CanvasModel.ctx!.lineTo(this.vertexList[1].x, this.vertexList[1].y);
      CanvasModel.ctx!.lineTo(this.vertexList[2].x, this.vertexList[2].y);
      CanvasModel.ctx!.lineTo(this.vertexList[0].x, this.vertexList[0].y);
      CanvasModel.ctx!.stroke();
      CanvasModel.ctx!.closePath();

      if (this.isSelected) {
        this.drawSelectedShapeIfRequired();
      }

      return;
    }
  }

  drawBySoftware(): void {
    this.drawByHardware();
  }

  isInBounds(x: number, y: number): boolean {
    // https://www.baeldung.com/cs/check-if-point-is-in-2d-triangle
    const a = { x: this.vertexList[0].x, y: this.vertexList[0].y };
    const b = { x: this.vertexList[1].x, y: this.vertexList[1].y };
    const c = { x: this.vertexList[2].x, y: this.vertexList[2].y };

    const p = { x, y };

    const shapeArea = this.triangleArea(a, b, c);

    let areaSum = 0;
    areaSum += this.triangleArea(a, b, p);
    areaSum += this.triangleArea(a, c, p);
    areaSum += this.triangleArea(b, c, p);

    return shapeArea === areaSum;
  }

  drawVertex(): void {}

  getCenter() {
    const length = this.vertexList.length - 1;
    return {
      x: Math.floor(
        (this.vertexList[0].x +
          this.vertexList[1].x +
          this.vertexList[length].x) /
          3,
      ),
      y: Math.floor(
        (this.vertexList[0].y +
          this.vertexList[1].y +
          this.vertexList[length].y) /
          3,
      ),
    };
  }

  triangleArea(a: any, b: any, c: any) {
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const ac = { x: c.x - a.x, y: c.y - a.y };

    const crossProd = ab.x * ac.y - ab.y * ac.x;

    return Math.abs(crossProd) / 2;
  }

  fillTriangle() {
    let x = this.vertexList[0].x + 1;
    let isFilled = false;

    let m =
      (this.vertexList[2].y - this.vertexList[0].y) /
      (this.vertexList[2].x - this.vertexList[0].x);
    const b = this.vertexList[2].y - m * this.vertexList[2].x;

    while (!isFilled) {
      if (x >= this.vertexList[2].x) {
        isFilled = true;
        break;
      }

      let yStart = m * x + b;
      let point = { x: x, y: yStart };

      CanvasModel.ctx!.beginPath();
      CanvasModel.ctx!.strokeStyle = this.backgroundColor;
      CanvasModel.ctx!.moveTo(x, point.y);

      CanvasModel.ctx!.lineTo(this.vertexList[1].x, this.vertexList[1].y);
      CanvasModel.ctx!.stroke();
      CanvasModel.ctx!.closePath();
      x++;
    }
  }

  drawSelectedShapeIfRequired() {
    if (this.isSelected) {
      const { x: xc, y: yc } = this.getCenter();
      CanvasModel.ctx!.beginPath();
      CanvasModel.ctx!.strokeStyle = this.outlineColor;
      CanvasModel.ctx?.rect(xc - 5, yc - 5, 10, 10);
      CanvasModel.ctx!.stroke();
      CanvasModel.ctx!.closePath();
    }
  }
}
