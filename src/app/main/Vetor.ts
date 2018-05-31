export class Vetor {
    constructor(public x: number, public y: number) { }

    public soma(v: Vetor) {
        return new Vetor(this.x + v.x, this.y + v.y);
    }

    public static get zero() {
        return new Vetor(0, 0);
    }
}
