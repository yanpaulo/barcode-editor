import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BarCodeElement } from './BarCodeElement';
import { BarCodeElementType } from './BarCodeElementType.enum';
import { Vector2 } from './Vector2';
import { HorizontalAlignment } from './HorizontalAlignment.enum';
import { VerticalAlignment } from './VerticalAlignment.enum';
import { ElementPosition } from './ElementPosition';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild("canvas")
  canvas: ElementRef;

  elementFont = { size: 12, name: "Arial" };

  rotations = [0, 90, 180, 270];

  horizontalAlignments = Object.values(HorizontalAlignment);

  verticalAlignments = Object.values(VerticalAlignment);

  availableElements = [
    new BarCodeElement("Código de Barras", BarCodeElementType.BarCode),
    new BarCodeElement("Cor", BarCodeElementType.Text, HorizontalAlignment.Right, VerticalAlignment.Middle, Vector2.zero, -90),
    new BarCodeElement("Tamanho", BarCodeElementType.Text, HorizontalAlignment.Center),
    new BarCodeElement("SubTamanho", BarCodeElementType.Text, HorizontalAlignment.Center, VerticalAlignment.Top, new Vector2(0, 10)),
    new BarCodeElement("Preço", BarCodeElementType.Text, HorizontalAlignment.Right),
  ];

  elements: BarCodeElement[] = [];

  selectedElement: BarCodeElement;


  get CanvasContext() {
    return this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
  }
  constructor() { }

  ngOnInit() {
    this.elements = this.availableElements;
    this.selectedElement = this.elements[0];
    this.CanvasContext.fillStyle = "gray";
    this.CanvasContext.font = `${this.elementFont.size}px ${ this.elementFont.name}`;
    // this.CanvasContext.textAlign = "center";
    setInterval(() => this.draw(), 33);
  }

  draw() {
    let ctx = this.CanvasContext;
    let el = this.canvas.nativeElement;

    let width = el.width, height = el.height;
    let left = 0, rigth = width, top = 0, bottom = height;
    let center = {
      x: width / 2,
      y: height / 2
    };

    const hPosition = (size: Vector2, alignment: HorizontalAlignment) => {
      switch (alignment) {
        case HorizontalAlignment.Left:
          return left;

        case HorizontalAlignment.Right:
          return rigth - size.x;

        case HorizontalAlignment.Center:
          return center.x - size.x / 2;
      }
    }

    const vPosition = (size: Vector2, alignment: VerticalAlignment) => {
      switch (alignment) {
        case VerticalAlignment.Top:
          return top;

        case VerticalAlignment.Middle:
          return center.y - size.y / 2;

        case VerticalAlignment.Bottom:
          return bottom - size.y;
      }
    }

    const elementSize = (element: BarCodeElement) => {
      switch (element.type) {
        case BarCodeElementType.BarCode:
          return new Vector2(width * 0.85, height * 0.8);
        case BarCodeElementType.Text:
          let textSize = ctx.measureText(element.name);
          return new Vector2(textSize.width * 1.1, this.elementFont.size * 1.2);
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    for (const element of this.elements) {
      let size = elementSize(element);
      let position = new Vector2(hPosition(size, element.horizontalAlignment), vPosition(size, element.verticalAlignment))
        .add(element.offset);

      element.position = new ElementPosition(size, position);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(position.x + Math.abs(size.x) / 2, position.y + Math.abs(size.y) / 2);
      ctx.rotate(Math.PI * element.rotation / 180);

      switch (element.type) {
        case BarCodeElementType.BarCode:
          ctx.fillRect(Math.abs(size.x) / -2, Math.abs(size.y) / -2, size.x, size.y);
          break;

        case BarCodeElementType.Text:
          ctx.strokeText(element.name, Math.abs(size.x) / -2, Math.abs(size.y) * 0.25);
          break;

        default:
          break;
      }
      if (this.selectedElement == element) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "green";
        ctx.fillRect(Math.abs(size.x) / -2, Math.abs(size.y) / -2, size.x, size.y);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "gray";
      }
    }

  }

  onClick(x: number, y: number) {
    let element = this.elements.find(e => e.position && e.position.intercepts(new Vector2(x, y)));
    this.selectedElement = element || this.selectedElement;
  }

}
