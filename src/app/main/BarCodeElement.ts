import { BarCodeElementType } from "./BarCodeElementType.enum";
import { HorizontalAlignment } from "./HorizontalAlignment.enum";
import { VerticalAlignment } from "./VerticalAlignment.enum";
import { Vector2 } from "./Vector2";
import { ElementPosition } from "./ElementPosition";


export class BarCodeElement {

    constructor(
        public name: string, 
        public type: BarCodeElementType, 
        public horizontalAlignment = HorizontalAlignment.Center, 
        public verticalAlignment = VerticalAlignment.Bottom, 
        public offset = Vector2.zero,
        public rotation = 0) {
        if (type == BarCodeElementType.BarCode) {
            this.verticalAlignment = VerticalAlignment.Middle;
        }
    }

    position: ElementPosition;
}
