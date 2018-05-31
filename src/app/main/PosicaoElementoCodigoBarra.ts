import { Vetor } from "./Vetor";

export class PosicaoElementoCodigoBarra {
    constructor(public size: Vetor, public position: Vetor) { }

    intercepta(v: Vetor) {
        let
            left = this.position.x, right = this.position.x + this.size.x,
            top = this.position.y, bottom = this.position.y + this.size.y;

        return (v.x >= left && v.x <= right) && (v.y >= top && v.y <= bottom);
    }
}
