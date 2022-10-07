import { Guid } from 'guid-typescript';
import { VertexInterface } from '../interfaces/vertex.interface';
import { PrimitiveEnum } from '../enum/primitive.enum';

export class CanvasShapeModel {
  id: string;
  color: string;
  vertexList: Array<VertexInterface> = [];
  type: PrimitiveEnum;

  constructor(
    type: PrimitiveEnum,
    vertex: Array<VertexInterface>,
    color: string,
  ) {
    this.type = type;
    this.vertexList = vertex;
    this.id = Guid.create().toString();
    this.color = color;
  }
}
