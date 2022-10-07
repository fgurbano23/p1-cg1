import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { CanvasLayout } from './canvas-layout';
import { Guid } from 'guid-typescript';

enum Primitive {
  LINE = '1',
  CIRCLE = '2',
  ELLIPSE = '3',
  RECTANGLE = '4',
  TRIANGLE = '5',
  BEZIER_CURVE = '6',
  SELECTION = '7',
}

enum RenderMode {
  SOFTWARE = 'software',
  HARDWARE = 'hardware',
}

class CShape {
  id: string;
  color: string;
  type: Primitive;

  constructor(color: string, type: Primitive) {
    this.id = Guid.create().toString();
    this.id = this.color = color;
    this.type = type;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  primitiveEnum = Primitive;
  renderModeEnum = RenderMode;

  @ViewChild('layout', { static: true }) layout: ElementRef | undefined;

  // @ts-ignore
  canvas: CanvasLayout;
  ctx: any;

  action: string | undefined = Primitive.LINE;
  renderMode: string = RenderMode.HARDWARE;

  // Se define el color negro como default
  useColor = '#000000';

  menuActions: any[] = [];
  elementsOnScreen: any[] = [];
  isDrawing = false;

  undoList: any[] = [];

  currentPoints: any[] = [];

  constructor(private fb: FormBuilder) {}

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
    this.canvas = new CanvasLayout(this.layout);
    this.ctx = this.canvas.element.getContext('2d');

    this.menuActions = this.getPrimitiveMenu();
    window.addEventListener('keydown', (e) => {
      this.selectPrimitive(e);
    });
  }

  selectPrimitive(e: any) {
    if (['1', '2', '3', '4', '5', '6', '7'].includes(e.key)) {
      switch (e.key) {
        case Primitive.LINE:
          this.action = Primitive.LINE;
          break;
        case Primitive.CIRCLE:
          this.action = Primitive.CIRCLE;
          break;
        case Primitive.ELLIPSE:
          this.action = Primitive.ELLIPSE;
          break;
        case Primitive.RECTANGLE:
          this.action = Primitive.RECTANGLE;
          break;
        case Primitive.TRIANGLE:
          this.action = Primitive.TRIANGLE;
          break;
        case Primitive.BEZIER_CURVE:
          this.action = Primitive.BEZIER_CURVE;
          break;
        case Primitive.SELECTION:
          this.action = Primitive.SELECTION;
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
    this.canvas.setBackground(this.ctx);
    this.repaintLayout();
  }

  mouseDownHandler(e: MouseEvent) {
    this.isDrawing = true;
    // this.currentPoints.push({ x: e.clientX, y: e.clientY });
    this.currentPoints.push(this.getCurrentXY(e.clientX, e.clientY));
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.isDrawing) {
      // this.currentPoints.push({ x: e.clientX, y: e.clientY });
      this.currentPoints.push(this.getCurrentXY(e.clientX, e.clientY));
      this.updateCanvasAndDraws();
      this.hardwareDraw(this.currentPoints);
    }
  }

  mouseUpHandler(e: MouseEvent) {
    if (this.isDrawing) {
      this.isDrawing = false;

      const length = this.currentPoints.length - 1;
      const startVertex = {
        x: this.currentPoints[0].x,
        y: this.currentPoints[0].y,
      };
      const endVertex = {
        x: this.currentPoints[length].x,
        y: this.currentPoints[length].y,
      };

      this.elementsOnScreen.push([startVertex, endVertex]);
      console.log(this.elementsOnScreen.length);
      this.currentPoints = [];
    }
  }

  hardwareDraw(shapePoint: any[]) {
    switch (this.action) {
      case Primitive.LINE:
        const length = shapePoint.length - 1;
        this.ctx.beginPath();
        this.ctx.moveTo(shapePoint[0].x, shapePoint[0].y);
        this.ctx.lineTo(shapePoint[length].x, shapePoint[length].y);
        this.ctx.stroke();
        break;
      case Primitive.CIRCLE:
        break;
      case Primitive.ELLIPSE:
        break;
      case Primitive.RECTANGLE:
        console.log('here');
        break;
      case Primitive.TRIANGLE:
        break;
      case Primitive.BEZIER_CURVE:
        break;
      case Primitive.SELECTION:
        break;
    }
  }

  repaintLayout() {
    this.elementsOnScreen.map((shape) => {
      const { x: x0, y: y0 } = shape[0];
      const { x: x1, y: y1 } = shape[1];
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

  getCurrentXY(x: number, y: number) {
    return { x: x - this.canvas.offsetX, y: y - this.canvas.offsetY };
  }

  drawRectangle(x0: number, y0: number, mouseX: number, mouseY: number) {
    const rectWidth = mouseX - x0;
    const rectHeight = mouseY - y0;
    this.ctx.strokeRect(x0, y0, rectWidth, rectHeight);
  }
}
