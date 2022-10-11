import * as C from './styles';
import React from 'react';

type Props = {
  /*
    Tipagem da props do botão, onde se recebe três atributos
    sendo label do tipo string, icon sendo opcional do tipo any,
    e onClick que recebe um evento de click do mouse na Div.
  */
  label: string;
  icon?: any;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const Button = ({label, icon, onClick}: Props) => {
  return (
    <C.Container onClick={onClick}>
      {icon &&
        <C.IconArea>
          <C.Icon src={icon}></C.Icon>
        </C.IconArea>
      }
      <C.Label>{label}</C.Label>
    </C.Container>
  )
}