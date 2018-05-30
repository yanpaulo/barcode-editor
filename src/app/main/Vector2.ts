export class Vector2 {
    constructor (public x: number, public y: number) {}

    public add(v: Vector2) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    public static zero = new Vector2(0, 0);
}
