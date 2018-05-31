import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlinhamentoHorizontal } from './AlinhamentoHorizontal.enum';
import { AlinhamentoVertical } from './AlinhamentoVertical.enum';
import { ElementoCodigoBarra } from './ElementoCodigoBarra';
import { TipoElementoCodigoBarra } from './TipoElementoCodigoBarra.enum';
import { Vetor } from './Vetor';
import { PosicaoElementoCodigoBarra } from './PosicaoElementoCodigoBarra';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild("canvas")
  canvas: ElementRef;

  fonteElemento = { size: 12, name: "Arial" };

  rotacoes = [0, 90, 180, 270];

  alinhamentosHorizontal = Object.values(AlinhamentoHorizontal);

  alinhamentosVertical = Object.values(AlinhamentoVertical);

  elementosDisponiveis = [
    new ElementoCodigoBarra("Código de Barras", TipoElementoCodigoBarra.Codigo),
    new ElementoCodigoBarra("Cor", TipoElementoCodigoBarra.Texto, AlinhamentoHorizontal.Direita, AlinhamentoVertical.Meio, Vetor.zero, 270),
    new ElementoCodigoBarra("Tamanho", TipoElementoCodigoBarra.Texto, AlinhamentoHorizontal.Meio),
    new ElementoCodigoBarra("SubTamanho", TipoElementoCodigoBarra.Texto, AlinhamentoHorizontal.Meio, AlinhamentoVertical.Topo, new Vetor(0, 10)),
    new ElementoCodigoBarra("Preço", TipoElementoCodigoBarra.Texto, AlinhamentoHorizontal.Direita),
  ];

  elementos: ElementoCodigoBarra[] = [];

  elementoSelecionado: ElementoCodigoBarra;


  get CanvasContext() {
    return this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
  }

  constructor() { }

  ngOnInit() {
    this.elementos = this.elementosDisponiveis;
    this.elementoSelecionado = this.elementos[0];
    this.CanvasContext.fillStyle = "gray";
    this.CanvasContext.textAlign = "center";
    this.CanvasContext.textBaseline = "middle";

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

    let posicaoH = (tamanho: Vetor, alinhamento: AlinhamentoHorizontal) => {
      switch (alinhamento) {
        case AlinhamentoHorizontal.Esquerda:
          return left;

        case AlinhamentoHorizontal.Direita:
          return rigth - tamanho.x;

        case AlinhamentoHorizontal.Meio:
          return center.x - tamanho.x / 2;
      }
    }

    let posicaoV = (tamanho: Vetor, alinhamento: AlinhamentoVertical) => {
      switch (alinhamento) {
        case AlinhamentoVertical.Topo:
          return top;

        case AlinhamentoVertical.Meio:
          return center.y - tamanho.y / 2;

        case AlinhamentoVertical.Fim:
          return bottom - tamanho.y;
      }
    }

    let tamanhoElemento = (element: ElementoCodigoBarra) => {
      let scale = element.escala / 100.0;
      switch (element.tipo) {
        case TipoElementoCodigoBarra.Codigo:
          return new Vetor(width, height).multiplica( 0.8 *scale);
        case TipoElementoCodigoBarra.Texto:
          let textSize = ctx.measureText(element.nome);
          return new Vetor(textSize.width, this.fonteElemento.size).multiplica(scale);
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    for (const elemento of this.elementos) {
      let tamanho = tamanhoElemento(elemento);
      let posicao = new Vetor(posicaoH(tamanho, elemento.alinhamentoHorizontal), posicaoV(tamanho, elemento.alinhamentoVertical))
        .soma(elemento.ajuste);
      let escala = elemento.escala / 100.0;

      let translacao = posicao.soma(tamanho.multiplica(0.5));
      let ajuste = tamanho.multiplica(-0.5);

      elemento.posicao = new PosicaoElementoCodigoBarra(tamanho, posicao);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(translacao.x, translacao.y);
      ctx.rotate(Math.PI * elemento.rotacao / 180);
      ctx.scale(escala, escala);

      switch (elemento.tipo) {
        case TipoElementoCodigoBarra.Codigo:
          ctx.fillRect(ajuste.x, ajuste.y, tamanho.x, tamanho.y);
          break;

        case TipoElementoCodigoBarra.Texto:
          ctx.strokeText(elemento.nome, 0, 0);
          break;
      }

      if (this.elementoSelecionado == elemento) {
        let old = { globalAlpha: ctx.globalAlpha, fillStyle: ctx.fillStyle };
        
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "green";
        ctx.fillRect(ajuste.x, ajuste.y, tamanho.x, tamanho.y);
        ctx.globalAlpha = old.globalAlpha;
        ctx.fillStyle = old.fillStyle;
      }
    }

  }

  onClick(x: number, y: number) {
    let elemento = this.elementos.find(e => e.posicao && e.posicao.intercepta(new Vetor(x, y)));
    this.elementoSelecionado = elemento || this.elementoSelecionado;
  }

}
