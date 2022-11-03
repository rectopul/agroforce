import React, { useState } from "react";
import { BsTrashFill } from "react-icons/bs";

import { Button, ModalConfirmation } from "../index";

interface IButtonDeleteConfirmation {
  data: any;
  keyName: string;
  onPress: Function;
  disabled?: boolean;
  [x: string]: any;
}

export function ButtonDeleteConfirmation({
  data,
  keyName,
  onPress,
  disabled,
  ...rest
}: IButtonDeleteConfirmation) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <>
      <ModalConfirmation
        isOpen={isOpenModal}
        text={`Você tem certeza que deseja deletar ${keyName}?`}
        onCancel={() => setIsOpenModal(false)}
        onPress={() => onPress(data)}
      />
      <div className="h-7 w-10">
        <Button
          title="Deletar"
          icon={<BsTrashFill size={14} />}
          onClick={() => setIsOpenModal(true)}
          bgColor={disabled ? "bg-gray-400" : "bg-red-600"}
          disabled={disabled}
          textColor="white"
          {...rest}
        />
      </div>
    </>
  );
}
