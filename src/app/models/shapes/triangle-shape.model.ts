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
  ) {
    super(PrimitiveEnum.TRIANGLE, vertexList, color, background);
  }

  drawByHardware(): void {
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

    if (this.vertexList.length === 3) {
      CanvasModel.ctx!.beginPath();
      CanvasModel.ctx!.strokeStyle = this.color;
      CanvasModel.ctx!.moveTo(this.vertexList[0].x, this.vertexList[0].y);
      CanvasModel.ctx!.lineTo(this.vertexList[1].x, this.vertexList[1].y);
      CanvasModel.ctx!.lineTo(this.vertexList[2].x, this.vertexList[2].y);
      CanvasModel.ctx!.lineTo(this.vertexList[0].x, this.vertexList[0].y);
      CanvasModel.ctx!.stroke();
      CanvasModel.ctx!.closePath();
      return;
    }
  }

  drawBySoftware(): void {
    this.drawByHardware();
  }

  isInBounds(x: number, y: number): boolean {
    return false;
  }

  drawVertex(): void {}

  getCenter() {
    const length = this.vertexList.length - 1;
    return {
      x: Math.floor((this.vertexList[0].x + this.vertexList[length].x) / 2),
      y: Math.floor((this.vertexList[0].y + this.vertexList[length].y) / 2),
    };
  }
}
