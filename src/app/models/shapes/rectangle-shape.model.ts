import { DrawInterface } from '../../interfaces/draw.interface';
import { CanvasShapeModel } from './canvas-shape.model';
import { VertexInterface } from '../../interfaces/vertex.interface';
import { PrimitiveEnum } from '../../enum/primitive.enum';
import { CanvasModel } from '../layout/canvas.model';

export class RectangleShapeModel
  extends CanvasShapeModel
  implements DrawInterface
{
  constructor(
    vertexList: Array<VertexInterface>,
    color: string,
    background: string,
  ) {
    super(PrimitiveEnum.RECTANGLE, vertexList, color, background);
  }

  drawByHardware(): void {
    const width = this.vertexList[1].x - this.vertexList[0].x;
    const height = this.vertexList[1].y - this.vertexList[0].y;

    CanvasModel.ctx!.beginPath();

    // if (this.isSelected) {
    //   CanvasModel.ctx!.setLineDash([10, 15]);
    // } else {
    //   CanvasModel.ctx!.setLineDash([]);
    // }

    CanvasModel.ctx!.strokeStyle = this.isSelected
      ? this.outlineColor
      : this.color;
    CanvasModel.ctx!.strokeRect(
      this.vertexList[0].x,
      this.vertexList[0].y,
      width,
      height,
    );
    CanvasModel.ctx!.closePath();

    this.fillRectangle();
  }

  drawBySoftware(): void {
    const width = this.vertexList[1].x - this.vertexList[0].x;
    const height = this.vertexList[1].y - this.vertexList[0].y;

    const x1 = this.vertexList[0].x + width;
    const y1 = this.vertexList[0].y + height;

    // if (this.isSelected) {
    //   CanvasModel.ctx!.setLineDash([10, 15]);
    // } else {
    //   CanvasModel.ctx!.setLineDash([]);
    // }

    this.plotLine(
      this.vertexList[0].x,
      this.vertexList[0].y,
      this.vertexList[0].x + width,
      this.vertexList[0].y,
    );

    this.plotLine(this.vertexList[0].x + width, this.vertexList[0].y, x1, y1);

    this.plotLine(this.vertexList[0].x, y1, x1, y1);

    this.plotLine(
      this.vertexList[0].x,
      this.vertexList[0].y,
      this.vertexList[0].x,
      y1,
    );

    this.fillRectangle();
    // this.drawVertex();
  }

  isInBounds(x: number, y: number): boolean {
    const x0 = this.vertexList[0].x;
    const y0 = this.vertexList[0].y;

    const width = Math.abs(this.vertexList[1].x - this.vertexList[0].x);
    const height = Math.abs(this.vertexList[1].y - this.vertexList[0].y);

    const x1 = x0 + width;
    const y1 = y0 + height;

    const isOnXBounds = x0 <= x && x <= x1;
    const isOnYBounds = y0 <= y && y <= y1;

    // console.log(`${x0} <= ${x} && ${x} <= ${x1} === ${isOnXBounds}`);
    // console.log(` ${y0} >= ${y} && ${y} <= ${y1} === ${isOnYBounds}`);
    return isOnXBounds && isOnYBounds;
  }

  drawVertex(): void {
    if (this.isSelected) {
      const x0 = this.vertexList[0].x;
      const y0 = this.vertexList[0].y;

      const width = Math.abs(this.vertexList[1].x - this.vertexList[0].x);
      const height = Math.abs(this.vertexList[1].y - this.vertexList[0].y);

      CanvasModel.ctx!.setLineDash([]);

      CanvasModel.ctx!.beginPath();
      CanvasModel.ctx!.strokeStyle = this.outlineColor;
      CanvasModel.ctx!.moveTo(x0, y0);
      CanvasModel.ctx!.arc(x0, y0, 5, 0, 2 * Math.PI);

      CanvasModel.ctx!.strokeStyle = this.outlineColor;
      CanvasModel.ctx!.moveTo(x0 + width, y0);
      CanvasModel.ctx!.arc(x0 + width, y0, 5, 0, 2 * Math.PI);

      CanvasModel.ctx!.strokeStyle = this.outlineColor;
      CanvasModel.ctx!.moveTo(x0, y0 + height);
      CanvasModel.ctx!.arc(x0, y0 + height, 5, 0, 2 * Math.PI);

      CanvasModel.ctx!.strokeStyle = this.outlineColor;
      CanvasModel.ctx!.moveTo(x0 + width, y0 + height);
      CanvasModel.ctx!.arc(x0 + width, y0 + height, 5, 0, 2 * Math.PI);
      CanvasModel.ctx!.stroke();
    }
  }

  fillRectangle() {
    const startAtX =
      this.vertexList[0].x < this.vertexList[1].x
        ? this.vertexList[0].x + 1
        : this.vertexList[1].x + 1;
    let xK = startAtX;

    const stopX = () => {
      return this.vertexList[0].x < this.vertexList[1].x
        ? xK > this.vertexList[1].x - 1
        : xK > this.vertexList[0].x - 1;
    };

    let isFilled = false;
    while (!isFilled) {
      if (stopX()) {
        isFilled = true;
      }

      // https://stackoverflow.com/questions/23612000/why-is-my-strokestyle-transparent#:~:text=When%20drawing%20lines%20on%20a,50%25%20transparent%20over%20two%20pixels.
      CanvasModel.ctx!.beginPath();
      CanvasModel.ctx!.strokeStyle = this.backgroundColor;
      CanvasModel.ctx!.moveTo(xK, this.vertexList[1].y);
      CanvasModel.ctx!.lineTo(xK, this.vertexList[0].y);
      CanvasModel.ctx!.stroke();
      CanvasModel.ctx!.closePath();
      xK++;
    }
  }
}
