import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BarCodeElement } from './BarCodeElement';
import { BarCodeElementType } from './BarCodeElementType.enum';
import { Vector2 } from './Vector2';
import { HorizontalAlignment } from './HorizontalAlignment.enum';
import { VerticalAlignment } from './VerticalAlignment.enum';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  elementFont = { size: 12, name: "Arial" };

  rotations = [0, 90, 180, 270];

  availableElements = [
    new BarCodeElement("Código de Barras", BarCodeElementType.BarCode),
    new BarCodeElement("Cor", BarCodeElementType.Text, HorizontalAlignment.Right, VerticalAlignment.Middle, Vector2.zero, -90),
    new BarCodeElement("Tamanho", BarCodeElementType.Text, HorizontalAlignment.Center),
    new BarCodeElement("SubTamanho", BarCodeElementType.Text, HorizontalAlignment.Center, VerticalAlignment.Top, new Vector2(0, 10)),
    new BarCodeElement("Preço", BarCodeElementType.Text, HorizontalAlignment.Right),
  ];

  elements: BarCodeElement[] = [];

  horizontalAlignments = Object.keys(HorizontalAlignment);
  verticalAlignments = Object.keys(VerticalAlignment);

  @ViewChild("canvas")
  canvas: ElementRef;

  get CanvasContext() {
    return this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
  }
  constructor() { }

  ngOnInit() {
    this.elements = this.availableElements;
    this.CanvasContext.fillStyle = "gray";
    this.draw();


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
          return top + size.y;

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
          return new Vector2(textSize.width * 1.1, this.elementFont.size * 1.1);
      }
    }

    for (const element of this.elements) {
      let size = elementSize(element);
      let position = new Vector2(hPosition(size, element.horizontalAlignment), vPosition(size, element.verticalAlignment))
        .add(element.offset);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(position.x, position.y);
      ctx.rotate(Math.PI * element.rotation / 180);
      switch (element.type) {
        case BarCodeElementType.BarCode:
          ctx.fillRect(0, 0, size.x, size.y);
          break;

        case BarCodeElementType.Text:
          ctx.strokeText(element.name, 0, 0);
          break;

        default:
          break;
      }
    }

  }

}
