import { Guid } from 'guid-typescript';
import { VertexInterface } from '../../interfaces/vertex.interface';
import { PrimitiveEnum } from '../../enum/primitive.enum';
import { CanvasModel } from '../layout/canvas.model';

export class CanvasShapeModel {
  id: string;
  color: string;
  backgroundColor: string;
  vertexList: Array<VertexInterface> = [];
  type: PrimitiveEnum;

  outlineColor = '#000';
  isSelected = false;
  filled = false;

  constructor(
    type: PrimitiveEnum,
    vertex: Array<VertexInterface>,
    color: string,
    backgroundColor = '#fffff',
    filled = false,
  ) {
    this.type = type;
    this.vertexList = vertex;
    this.id = Guid.create().toString();
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.filled = filled;
  }

  setSelection(selected: boolean): void {
    this.isSelected = selected;
  }

  plotLine(x0: number, y0: number, x1: number, y1: number) {
    let dx = Math.abs(x1 - x0),
      sx = x0 < x1 ? 1 : -1;
    let dy = -Math.abs(y1 - y0),
      sy = y0 < y1 ? 1 : -1;

    let err = dx + dy,
      e2;

    CanvasModel.ctx!.beginPath();
    CanvasModel.ctx!.moveTo(x0, y0);
    CanvasModel.ctx!.strokeStyle = this.color;

    let isDraw = false;
    while (!isDraw) {
      CanvasModel.ctx!.lineTo(x0, y0);

      if (x0 == x1 && y0 == y1) {
        isDraw = true;
        CanvasModel.ctx!.stroke();
        CanvasModel.ctx!.closePath();
        break;
      }

      e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }
}
