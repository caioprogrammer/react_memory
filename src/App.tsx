import { useEffect, useState } from 'react';

import * as C from './App.styles'; // Faz a importação dos styled components como variavel C

import logoImage from './assets/devmemory_logo.png'; // importação da logo
import RestartIcon from './svgs/restart.svg'; // importação do ícone de restart

// Abaixo importação dos components necessários desta parte
import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { GridItem } from './components/GridItem';

// importação dos types necessários desta parte
import { GridItemType } from './types/GridItemType';

//importação das informações dos items a serem renderizados do game.
import { items } from './data/items';

// Importação da função que formata o tempo de cada rodada!
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () => {
  // Seta se estamos em jogo, retornando o tipo Boolean primariamente como FALSE
  const [playing, setPlaying] = useState<boolean>(false);
  // seta o tempo da rodada, como tipo number primariamente como 0
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  // seta os movimentos que já foram dados na rodada, tipo number, primariamente como 0
  const [moveCount, setMoveCount] = useState<number>(0);
  // Seta os items que foram mostrados na rodada, tipo number, primariamente como 0
  const [shownCount, setShownCount] = useState<number>(0);
  // seta os items de todo o grid, sendo um Array de GridItemType, primariamente um array vazio
  const [gridItems, setGridItems] = useState<GridItemType[]>([])

  // Utilizado para assim que reiniciar a página ou abrir a primeira vez, resetar o game.
  useEffect(() => resetAndCreateGrid(), [])

  // Função do time, onde conta cada segundo passado na rodada
  useEffect(() => {
    const timer = setInterval(() => {
      if(playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);

    return () => clearInterval(timer)
  }, [playing, timeElapsed]);

  // verifica se os abertos são iguais
  useEffect(() => {
    if(shownCount === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2) {

        if(opened[0].item === opened[1].item) {
          //v1 - Se eles são iguais tornalos permanentes
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShownCount(0);
        } else {
          // v2 - se eles não são iguais, fecha eles
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for(let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }, 1000);
        }

        setMoveCount(moveCount => moveCount + 1)
      }
    }
  }, [shownCount, gridItems]);

  // verifica se o game acabou
  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false)
    }
  }, [moveCount, gridItems])

  const resetAndCreateGrid = () => {
    // passo 1- Resetar o game.
      setTimeElapsed(0);
      setMoveCount(0);
      setShownCount(0);

    // Passo 2 - criar o grid
      // 2.1 - Criar um grid vazio
        let tmpGrid: GridItemType[] = [];
        for(let i = 0; i < (items.length * 2); i++) {
          tmpGrid.push({
            item: null, shown: false, permanentShown: false,
          });
        };
      // 2.2 - preencher o grid
        for(let w = 0; w < 2; w++) {
          for(let i = 0; i < items.length; i++) {
            let pos = -1;
            while(pos < 0 || tmpGrid[pos].item !== null) {
              pos = Math.floor(Math.random() * (items.length * 2));
            }
            tmpGrid[pos].item = i;
          }
        }

      // 2.3 - jogar no state
        setGridItems(tmpGrid)

    //passo 3 - começar o jogo
    setPlaying(true);
  };

  /* função responsavel por saber qual item foi clicado, 
     Onde se o item for permanente ele fica sempre mostrado na tela
     caso contrario, ele volta ao seu estado "de costas"
  */
  const handleItemClick = (index: number) => {
    if(playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];
      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1)
      }
      setGridItems(tmpGrid);
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width={200} alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label='Movimentos' value={moveCount.toString()}/>
        </C.InfoArea>

        <Button 
          label='Reiniciar' 
          icon={RestartIcon} 
          onClick={resetAndCreateGrid} 
        />
      
      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem 
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  )
}

export default App;