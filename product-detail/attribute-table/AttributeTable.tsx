import { useMemo } from "react";

import * as S from "./styles";

const AttributeTable = ({ attributes }: any) => {
  const getLabel = (key: string) => {
    if (key.includes("fabricante")) return "Fabricante";
    if (key.includes("peso")) return "Peso";
    if (key.includes("marca")) return "Marca";
    if (key.includes("dimensao")) return "Dimensão";
    if (key.includes("familia")) return "Família";
    if (key.includes("ean")) return "EAN";
    if (key.includes("formato")) return "Formato";
    if (key.includes("volume")) return "Volume";
    if (key.includes("palavra_chave")) return null;
    if (key.includes("description")) return null;
    return "Outro";
  };

  const processedData = useMemo(() => {
    return attributes
      .map((item: any) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        const label = getLabel(key);
        if (label === null) return null;
        return { label, value };
      })
      .filter((item: any) => item !== null);
  }, [attributes]);

  return (
    <S.Table>
      <S.Content>
        {processedData?.map((item: any, index: number) => (
          <S.Row key={index}>
            <S.Cell className="label">{item.label}</S.Cell>
            <S.Cell className="value">{item.value}</S.Cell>
          </S.Row>
        ))}
      </S.Content>
    </S.Table>
  );
};

export default AttributeTable;
