import { DrawInterface } from '../interfaces/draw.interface';
import { CanvasShapeModel } from './canvas-shape.model';
import { VertexInterface } from '../interfaces/vertex.interface';
import { PrimitiveEnum } from '../enum/primitive.enum';
import { CanvasModel } from './canvas.model';

export class LineShapeModel extends CanvasShapeModel implements DrawInterface {
  constructor(vertexList: Array<VertexInterface>, color: string) {
    super(PrimitiveEnum.LINE, vertexList, color);
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
  }

  drawBySoftware(): void {}
}
