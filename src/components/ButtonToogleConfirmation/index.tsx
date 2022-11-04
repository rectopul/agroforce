import React, { useState } from "react";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";

import { Button, ModalConfirmation } from "../index";

interface IButtonToogleConfirmation {
  data: any;
  text: string;
  keyName: string;
  onPress: Function;
  [x: string]: any;
}

export function ButtonToogleConfirmation({
  data,
  text,
  keyName,
  onPress,
  ...rest
}: IButtonToogleConfirmation) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <>
      <ModalConfirmation
        isOpen={isOpenModal}
        text={`Você tem certeza que deseja ${
          data?.status == 1 ? "inativar" : "ativar"
        } ${text} ${data[keyName]}?`}
        onCancel={() => setIsOpenModal(false)}
        onPress={() => onPress(data)}
      />
      <div className="h-7 w-10">
        <Button
          title={data?.status == 1 ? "Ativo" : "Inativo"}
          icon={
            data?.status ? (
              <FaRegThumbsUp size={14} />
            ) : (
              <FaRegThumbsDown size={14} />
            )
          }
          onClick={() => setIsOpenModal(true)}
          bgColor={data?.status == 1 ? "bg-green-600" : "bg-red-800"}
          textColor="white"
          {...rest}
        />
      </div>
    </>
  );
}
