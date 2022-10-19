import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CanvasModel } from './models/layout/canvas.model';
import { PrimitiveEnum } from './enum/primitive.enum';
import { RenderModeEnum } from './enum/render-mode.enum';
import { LineShapeModel } from './models/shapes/line-shape.model';
import { VertexInterface } from './interfaces/vertex.interface';
import { RectangleShapeModel } from './models/shapes/rectangle-shape.model';
import { TriangleShapeModel } from './models/shapes/triangle-shape.model';
import { CircleShapeModel } from './models/shapes/circle-shape.model';
import { EllipseShapeModel } from './models/shapes/ellipse-shape.model';
import { FilePrimitivesEnum } from './enum/file-primitives.enum';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  primitiveEnum = PrimitiveEnum;
  renderModeEnum = RenderModeEnum;

  @ViewChild('layout', { static: true }) layout: ElementRef | undefined;

  canvas!: CanvasModel;

  action: string | undefined = this.primitiveEnum.LINE;
  renderMode: string = this.renderModeEnum.HARDWARE;

  // Se define el color negro como default
  useColor = '#000000';

  menuActions: any[] = [];
  elementsOnScreen: any[] = [];
  currentShape: any | null = null;
  isDrawing = false;

  undoList: any[] = [];
  currentPoints: any[] = [];

  mouseMoveXY: VertexInterface | null = null;

  constructor(render: Renderer2) {}

  getPrimitiveMenu() {
    const primitiveArr = Object.values(this.primitiveEnum);
    return primitiveArr.map((item) => {
      return {
        id: item,
        image: `assets/img/${item}.png`,
      };
    });
  }

  ngOnInit() {
    this.canvas = new CanvasModel(this.layout);

    this.menuActions = this.getPrimitiveMenu();
    window.addEventListener('keydown', (e) => {
      this.selectPrimitive(e);

      if (e.key === 'Escape') {
        this.clearCanvasAndCurrentDraw();
      }

      if (e.key === 'u') {
        this.elementsOnScreen = this.clearSelection();
        this.updateCanvasAndDraws();
      }

      if (e.key === 'x') {
        this.clearCanvas();
      }
    });
  }

  selectPrimitive(e: any) {
    if (['1', '2', '3', '4', '5', '6', '7'].includes(e.key)) {
      this.action = e.key;
    }
  }

  getRGB(hex: string) {
    let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  getRGBAsZeroToOne(hex: string) {
    // Se obtiene el color decimal perteneciente al RGB y se divide entre 255
    // Que es el máximo color para asi tener su equivalente en 0-1
    const [r, g, b] = this.getRGB(hex);
    return [r / 255, g / 255, b / 255];
  }

  getHexFromRGB(r: number, g: number, b: number) {
    const hexR = (r * 255).toString(16);
    const hexG = (g * 255).toString(16);
    const hexB = (b * 255).toString(16);
    return `#${hexR}${hexG}${hexB}`;
  }

  updateCanvasAndDraws() {
    console.log('here');
    this.canvas.setBackground();
    this.repaintLayout();
  }

  mouseDownHandler(e: MouseEvent) {
    const startXY = this.getCurrentXY(e.clientX, e.clientY);

    // Seleccinoar
    if (this.action === this.primitiveEnum.SELECTION) {
      const isOnScreen = this.elementsOnScreen.filter((shape) => {
        const select = shape?.isInBounds(startXY.x, startXY.y);
        shape.setSelection(select);
        return select;
      });

      if (isOnScreen) {
        this.updateCanvasAndDraws();
      }

      return;
    }

    this.isDrawing = true;
    this.currentShape = null;
    this.elementsOnScreen = this.clearSelection();

    let shape;
    switch (this.action) {
      case PrimitiveEnum.LINE:
        shape = new LineShapeModel([startXY], this.useColor);
        this.currentShape = shape;
        break;
      case PrimitiveEnum.RECTANGLE:
        shape = new RectangleShapeModel([startXY], this.useColor);
        this.currentShape = shape;
        break;
      case PrimitiveEnum.TRIANGLE:
        shape = new TriangleShapeModel([startXY], this.useColor);
        this.currentShape = shape;
        break;
      case PrimitiveEnum.CIRCLE:
        shape = new CircleShapeModel([startXY], this.useColor);
        this.currentShape = shape;
        break;
      case PrimitiveEnum.ELLIPSE:
        shape = new EllipseShapeModel([startXY], this.useColor);
        this.currentShape = shape;
        break;
      default:
        break;
    }
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.isDrawing && this.currentShape) {
      this.mouseMoveXY = this.getCurrentXY(e.clientX, e.clientY);
      // Se podria crear una copia de la instancia y pasarse
      const tempShapeVertexList = [
        ...this.currentShape!.vertexList,
        this.mouseMoveXY,
      ];

      const temporalShape = Object.create(this.currentShape);
      temporalShape!.vertexList = tempShapeVertexList;

      this.updateCanvasAndDraws();

      this.draw(temporalShape);
    }
  }

  isSamePositionAtStartPoint(x0: number, y0: number, x1: number, y1: number) {
    return x0 === x1 && y0 === y1;
  }

  mouseUpHandler(e: MouseEvent) {
    if (!this.currentShape) {
      return;
    }

    const { x: x0, y: y0 } = this.currentShape.vertexList[0];
    const { x: x1, y: y1 } = this.getCurrentXY(e.clientX, e.clientY);

    if (this.isSamePositionAtStartPoint(x0, y0, x1, y1)) {
      return;
    }

    if (this.isDrawing) {
      this.isDrawing = false;

      this.currentShape?.vertexList.push({ x: x1, y: y1 });

      this.elementsOnScreen.push(this.currentShape);
      this.currentShape = null;
    }
  }

  draw(shapeInstance: any) {
    if (this.renderMode === this.renderModeEnum.HARDWARE) {
      shapeInstance.drawByHardware();
    } else {
      shapeInstance.drawBySoftware();
    }
  }

  repaintLayout() {
    this.elementsOnScreen.map((shape) => {
      this.draw(shape);
    });
  }

  undo() {
    const length = this.elementsOnScreen.length;
    if (length) {
      const lastElement = this.elementsOnScreen.splice(length - 1, 1);
      this.undoList.push(lastElement[0]); // Arreglo de 2 elementos {x,y}
      console.log(this.undoList);
      this.updateCanvasAndDraws();
    }
  }

  redo() {
    const length = this.undoList.length;
    if (length) {
      const lastElement = this.undoList.splice(length - 1, 1);
      this.elementsOnScreen.push(lastElement[0]);
      this.updateCanvasAndDraws();
    }
  }

  getCurrentXY(x: number, y: number): VertexInterface {
    return { x: x - this.canvas.offsetX, y: y - this.canvas.offsetY };
  }

  clearCanvasAndCurrentDraw() {
    this.clearCurrentShape();
    this.updateCanvasAndDraws();
  }

  clearCurrentShape() {
    this.currentShape = null;
  }

  clearSelection() {
    return this.elementsOnScreen.map((shape) => {
      shape.setSelection(false);
      return shape;
    });
  }

  clearCanvas() {
    this.canvas.setBackground();
    this.elementsOnScreen = [];
    this.currentShape = null;
    this.undoList = [];
  }

  getFromFile(e: any) {
    const files = e.target.files;

    if (files.length > 0) {
      const reader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result?.toString();
        const lines = fileContent?.split(/\n/);

        lines?.forEach((line) => {
          const lineInfo = line.split(' ');
          const cmd = lineInfo[0];
          lineInfo.splice(0, 1);

          this.drawFilePrimitive(lineInfo, cmd);
        });
      };

      reader.readAsText(files[0]);
    }
  }

  getColors(array: any[]) {
    return array.slice(0, 3);
  }

  getPoints(array: any[], points: number) {
    let vertexList: any[] = [];
    const pointsArray = array.slice(0, points * 2);

    while (pointsArray.length > 0) {
      vertexList.push({
        x: parseInt(pointsArray[0]),
        y: parseInt(pointsArray[1]),
      });
      pointsArray.splice(0, 2);
    }

    return vertexList;
  }

  drawFilePrimitive(currentLine: any, cmd: string) {
    let vertexList = [];
    let color = null;
    switch (cmd) {
      case FilePrimitivesEnum.BACKGROUND:
        color = this.getColors(currentLine);
        this.canvas.background = this.getHexFromRGB(
          color[0],
          color[1],
          color[2],
        );
        this.canvas.setBackground();
        break;

      case FilePrimitivesEnum.CIRCLE:
      case FilePrimitivesEnum.FILLED_CIRCLE:
        vertexList = this.getPoints(currentLine, 2);
        currentLine.splice(0, 4);
        color = this.getColors(currentLine);
        this.currentShape = new CircleShapeModel(
          vertexList,
          this.getHexFromRGB(color[0], color[1], color[2]),
        );
        this.elementsOnScreen.push(this.currentShape);
        this.updateCanvasAndDraws();
        break;

      case FilePrimitivesEnum.ELLIPSE:
      case FilePrimitivesEnum.FILLED_ELLIPSE:
        vertexList = this.getPoints(currentLine, 2);
        color = this.getColors(currentLine);
        this.currentShape = new EllipseShapeModel(
          vertexList,
          this.getHexFromRGB(color[0], color[1], color[2]),
        );
        this.elementsOnScreen.push(this.currentShape);
        this.updateCanvasAndDraws();
        break;

      case FilePrimitivesEnum.RECTANGLE:
      case FilePrimitivesEnum.FILLED_RECTANGLE:
        vertexList = this.getPoints(currentLine, 2);
        color = this.getColors(currentLine);
        console.log(this.getHexFromRGB(color[0], color[1], color[2]));
        this.currentShape = new RectangleShapeModel(
          vertexList,
          this.getHexFromRGB(color[0], color[1], color[2]),
        );
        this.elementsOnScreen.push(this.currentShape);
        this.updateCanvasAndDraws();
        break;

      case FilePrimitivesEnum.TRIANGLE:
      case FilePrimitivesEnum.FILLED_TRIANGLE:
        break;

      case FilePrimitivesEnum.LINE:
        color = this.getColors(currentLine);
        console.log(this.getHexFromRGB(color[0], color[1], color[2]));
        vertexList = this.getPoints(currentLine, 2);
        this.currentShape = new LineShapeModel(
          vertexList,
          this.getHexFromRGB(color[0], color[1], color[2]),
        );
        this.elementsOnScreen.push(this.currentShape);
        this.updateCanvasAndDraws();
        break;
    }
  }

  swap(index: number, targetIndex: number) {
    let tempShape = this.elementsOnScreen.slice(targetIndex, 1);
    this.elementsOnScreen[targetIndex] = this.elementsOnScreen[index];
    this.elementsOnScreen[index] = tempShape;
  }
}
