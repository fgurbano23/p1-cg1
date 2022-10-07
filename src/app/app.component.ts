import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CanvasModel } from './models/canvas.model';
import { PrimitiveEnum } from './enum/primitive.enum';
import { RenderModeEnum } from './enum/render-mode.enum';
import { LineShapeModel } from './models/line-shape.model';
import { VertexInterface } from './interfaces/vertex.interface';
import { CanvasShapeModel } from './models/canvas-shape.model';
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

  constructor() {}

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
    });
  }

  selectPrimitive(e: any) {
    if (['1', '2', '3', '4', '5', '6', '7'].includes(e.key)) {
      switch (e.key) {
        case PrimitiveEnum.LINE:
          this.action = PrimitiveEnum.LINE;
          break;
        case PrimitiveEnum.CIRCLE:
          this.action = PrimitiveEnum.CIRCLE;
          break;
        case PrimitiveEnum.ELLIPSE:
          this.action = PrimitiveEnum.ELLIPSE;
          break;
        case PrimitiveEnum.RECTANGLE:
          this.action = PrimitiveEnum.RECTANGLE;
          break;
        case PrimitiveEnum.TRIANGLE:
          this.action = PrimitiveEnum.TRIANGLE;
          break;
        case PrimitiveEnum.BEZIER_CURVE:
          this.action = PrimitiveEnum.BEZIER_CURVE;
          break;
        case PrimitiveEnum.SELECTION:
          this.action = PrimitiveEnum.SELECTION;
          break;
      }
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

  updateCanvasAndDraws() {
    this.canvas.setBackground();
    this.repaintLayout();
  }

  mouseDownHandler(e: MouseEvent) {
    this.isDrawing = true;
    // this.currentPoints.push({ x: e.clientX, y: e.clientY });
    // this.currentPoints.push();

    const startXY = this.getCurrentXY(e.clientX, e.clientY);

    switch (this.action) {
      case PrimitiveEnum.LINE:
        this.action = PrimitiveEnum.LINE;
        const line = new LineShapeModel([startXY], this.useColor);
        this.currentShape = line;
        break;
      default:
        break;
    }
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.isDrawing) {
      this.mouseMoveXY = this.getCurrentXY(e.clientX, e.clientY);
      // Se podria crear una copia de la instancia y pasarse
      const tempShapeVertexList = [
        ...this.currentShape!.vertexList,
        this.mouseMoveXY,
      ];
      const temporalShape = Object.create(this.currentShape);
      temporalShape!.vertexList = tempShapeVertexList;

      this.updateCanvasAndDraws();
      // this.hardwareDraw(tempShapeVertexList);
      this.hardwareDraw(temporalShape);
    }
  }

  mouseUpHandler(e: MouseEvent) {
    if (this.isDrawing) {
      this.isDrawing = false;

      this.currentShape?.vertexList.push(
        this.getCurrentXY(e.clientX, e.clientY),
      );

      console.log(this.elementsOnScreen.length);

      this.elementsOnScreen.push(this.currentShape);
      this.currentShape = null;
    }
  }

  hardwareDraw(shapeInstance: any) {
    switch (this.action) {
      case PrimitiveEnum.LINE:
        shapeInstance.drawByHardware();
        break;
      case PrimitiveEnum.CIRCLE:
        break;
      case PrimitiveEnum.ELLIPSE:
        break;
      case PrimitiveEnum.RECTANGLE:
        break;
      case PrimitiveEnum.TRIANGLE:
        break;
      case PrimitiveEnum.BEZIER_CURVE:
        break;
      case PrimitiveEnum.SELECTION:
        break;
      default:
        break;
    }
  }

  repaintLayout() {
    this.elementsOnScreen.map((shape) => {
      this.hardwareDraw(shape);
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
      console.log(lastElement);
      console.log(this.elementsOnScreen);
      this.updateCanvasAndDraws();
    }
  }

  getCurrentXY(x: number, y: number): VertexInterface {
    return { x: x - this.canvas.offsetX, y: y - this.canvas.offsetY };
  }

  drawRectangle(x0: number, y0: number, mouseX: number, mouseY: number) {
    const rectWidth = mouseX - x0;
    const rectHeight = mouseY - y0;
    CanvasModel.ctx!.strokeRect(x0, y0, rectWidth, rectHeight);
  }
}
