
import { useState } from 'react';
import './App.css';
function Quadrado({ valor, onQuadradoClick }) {
  return <button className="square" onClick={onQuadradoClick}>{valor}</button>
}
function Tabuleiro({ xProximo, quadrados, jogar }) {
  function onQuadradoClick(i) {
    if (quadrados[i] || calcularVencedor(quadrados)) return;
    const proximosQuadrados = quadrados.slice();
    if (xProximo) {
      proximosQuadrados[i] = 'X';
    } else {
      proximosQuadrados[i] = 'O';
    }
    jogar(proximosQuadrados);
  }
  const vencedor = calcularVencedor(quadrados);
  let status;
  if (vencedor) {
    status = "Vencedor: " + vencedor;
  } else if (quadrados.every(quadrado => quadrado !== null)) {
    status = "Empate!";
  } else {
    status = "Próximo: " + (xProximo ? "X" : "O");
  }

  function renderLinhas() {
    // Matriz bidimensional representando linhas e colunas
    const gridData = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];

    // Mapeando as linhas
    const linhas = gridData.map((linha, rowIndex) => (
      <div key={rowIndex} className="linha-tabuleiro">
        {
          linha.map((coluna, colIndex) => (
            <Quadrado key={colIndex} valor={quadrados[coluna]} onQuadradoClick={() => onQuadradoClick(coluna)} />
          ))
        }
      </div>
    ));
    return linhas;
  }
  return <>
    <div className="status">{status}</div>
    <br />
    {renderLinhas()}
  </>;
}
export default function Jogo() {

  const [historico, setHistorico] = useState([Array(9).fill(null)]);
  const [movimentoAtual, setMovimentoAtual] = useState(0);
  const xProximo = (movimentoAtual % 2) === 0;
  const quadradosAtuais = historico[movimentoAtual];
  const movimentos = historico.map((quadrados, movimento) => {
    let descricao;
    if (movimentoAtual === movimento) {
      descricao = movimento === 0 ? 'Início do jogo' : 'Movimento atual #' + movimento;
      return (
        <li key={movimento} id="atual">
          {descricao}
        </li>
      );
    } else
      if (movimento > 0) {
        descricao = 'Vá para o movimento #' + movimento;
      } else {
        descricao = 'Vá para o início do jogo';
      }
    return (
      <li key={movimento}>
        <button className='botaoMovimento' onClick={() => pularPara(movimento)}>{descricao}</button>
      </li>
    );
  });
  function pularPara(proximoMovimento) {
    setMovimentoAtual(proximoMovimento);
  }
  function jogar(proximosQuadrados) {
    const proximosHistoricos = [...historico.slice(0, movimentoAtual + 1), proximosQuadrados];
    setHistorico(proximosHistoricos);
    setMovimentoAtual(proximosHistoricos.length - 1);
  }
  return (
    <div className="jogo">
      <h2 className="titulo">Jogo da Velha</h2>
      <div className="tabuleiro"><Tabuleiro xProximo={xProximo} quadrados={quadradosAtuais} jogar={jogar} /></div>
      <div className='info-jogo'>
        <ol>{movimentos}</ol>
      </div>
    </div>
  );
}
function calcularVencedor(qudrados) {
  const linhas = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < linhas.length; i++) {
    const [a, b, c] = linhas[i];
    if (qudrados[a] && qudrados[a] === qudrados[b] && qudrados[a] === qudrados[c]) {
      return qudrados[a];
    }
  }
  return null;
}
