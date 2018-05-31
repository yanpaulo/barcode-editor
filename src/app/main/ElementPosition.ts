import { Vector2 } from "./Vector2";

export class ElementPosition {
    constructor(public size: Vector2, public position: Vector2) { }

    intercepts(v: Vector2) {
        let
            left = this.position.x, right = this.position.x + this.size.x,
            top = this.position.y, bottom = this.position.y + this.size.y;

        return (v.x >= left && v.x <= right) && (v.y >= top && v.y <= bottom);
    }
}
