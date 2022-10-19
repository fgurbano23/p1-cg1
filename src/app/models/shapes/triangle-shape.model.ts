import { DrawInterface } from '../../interfaces/draw.interface';
import { CanvasShapeModel } from './canvas-shape.model';
import { VertexInterface } from '../../interfaces/vertex.interface';
import { PrimitiveEnum } from '../../enum/primitive.enum';
import { CanvasModel } from '../layout/canvas.model';

export class TriangleShapeModel
  extends CanvasShapeModel
  implements DrawInterface
{
  constructor(vertexList: Array<VertexInterface>, color: string) {
    super(PrimitiveEnum.TRIANGLE, vertexList, color);
  }

  drawByHardware(): void {
    const width = this.vertexList[1].x - this.vertexList[0].x;
    const height = this.vertexList[1].y - this.vertexList[0].y;

    const pointX =
      this.vertexList[1].x -
      2 * Math.abs(this.vertexList[1].x - this.vertexList[0].x);

    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.strokeStyle = this.color;
    CanvasModel.ctx!.moveTo(this.vertexList[0].x, this.vertexList[0].y);
    CanvasModel.ctx!.lineTo(this.vertexList[1].x, this.vertexList[1].y);

    CanvasModel.ctx!.lineTo(pointX, this.vertexList[1].y);
    CanvasModel.ctx!.lineTo(this.vertexList[0].x, this.vertexList[0].y);

    CanvasModel.ctx!.stroke();
    CanvasModel.ctx!.closePath();
  }

  drawBySoftware(): void {
    this.drawByHardware();
  }

  isInBounds(x: number, y: number): boolean {
    return false;
  }

  drawVertex(): void {}
}
