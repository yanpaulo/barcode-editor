export class Vetor {
    constructor(public x: number, public y: number) { }

    soma(v: Vetor) {
        return new Vetor(this.x + v.x, this.y + v.y);
    }

    multiplica(escalar: number) {
        return new Vetor(this.x * escalar, this.y * escalar);
    }

    public static get zero() {
        return new Vetor(0, 0);
    }
}
