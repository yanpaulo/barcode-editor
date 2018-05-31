import { Vetor } from "./Vetor";
import { TipoElementoCodigoBarra } from "./TipoElementoCodigoBarra.enum";
import { AlinhamentoHorizontal } from "./AlinhamentoHorizontal.enum";
import { AlinhamentoVertical } from "./AlinhamentoVertical.enum";
import { PosicaoElementoCodigoBarra } from "./PosicaoElementoCodigoBarra";



export class ElementoCodigoBarra {

    constructor(
        public nome: string, 
        public tipo: TipoElementoCodigoBarra, 
        public alinhamentoHorizontal = AlinhamentoHorizontal.Meio, 
        public alinhamentoVertical = AlinhamentoVertical.Fim, 
        public ajuste = Vetor.zero,
        public rotacao = 0) {
        if (tipo == TipoElementoCodigoBarra.Codigo) {
            this.alinhamentoVertical = AlinhamentoVertical.Meio;
        }
    }

    escala = 100.0;

    posicao: PosicaoElementoCodigoBarra;
}
