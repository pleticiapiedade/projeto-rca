import { useMemo } from 'react';
import { PackagesTypesProps } from '@/types';

const PackSVG = `${process.env.PUBLIC_URL}/embalagem-pack.svg`;
const LataSVG = `${process.env.PUBLIC_URL}/embalagem-lata.svg`;
const BoxSVG = `${process.env.PUBLIC_URL}/embalagem-caixa.svg`;
const FardoSVG = `${process.env.PUBLIC_URL}/embalagem-fardo.svg`;
const PackageSVG = `${process.env.PUBLIC_URL}/embalagem-pacote.svg`;
const CartelaSVG = `${process.env.PUBLIC_URL}/embalagem-cartela.svg`;
const IndividualSVG = `${process.env.PUBLIC_URL}/embalagem-unidade.svg`;

type Props = {
  [key in PackagesTypesProps]: {
    icon: any;
    name: string;
    displayName: string;
    measureUnit: string;
    packingTitle: string;
    showPriceSubtitle: boolean;
    shortName: PackagesTypesProps;
  };
};

const PackingTypes: Props = {
  PT: {
    name: 'pacotes',
    displayName: 'Pacote',
    shortName: 'PT',
    icon: PackageSVG,
    measureUnit: 'unidade',
    packingTitle: 'Pacote com',
    showPriceSubtitle: true,
  },
  DP: {
    name: 'display',
    displayName: 'Display',
    shortName: 'DP',
    icon: PackageSVG,
    measureUnit: 'unidade',
    packingTitle: 'Display com',
    showPriceSubtitle: true,
  },
  CT: {
    name: 'cartelas',
    displayName: 'Cartela',
    shortName: 'CT',
    icon: CartelaSVG,
    measureUnit: 'unidade',
    packingTitle: 'Cartela com',
    showPriceSubtitle: true,
  },
  CE: {
    name: 'caixas de embarque',
    displayName: 'Caixa de embq.',
    shortName: 'CE',
    icon: BoxSVG,
    measureUnit: 'unidade',
    packingTitle: 'Caixa de embq.',
    showPriceSubtitle: true,
  },
  UN: {
    name: 'unidades',
    displayName: 'Unidade',
    shortName: 'UN',
    icon: IndividualSVG,
    measureUnit: 'unidade',
    packingTitle: 'Unitário',
    showPriceSubtitle: true,
  },
  CX: {
    name: 'caixas',
    displayName: 'Caixa',
    shortName: 'CX',
    icon: BoxSVG,
    measureUnit: 'unidade',
    packingTitle: 'Caixa com',
    showPriceSubtitle: true,
  },
  FD: {
    name: 'fardos',
    displayName: 'Fardo',
    shortName: 'FD',
    icon: FardoSVG,
    measureUnit: 'unidade',
    packingTitle: 'Fardo com',
    showPriceSubtitle: true,
  },
  PK: {
    name: 'packs',
    displayName: 'Pack',
    shortName: 'PK',
    icon: PackSVG,
    measureUnit: 'unidade',
    packingTitle: 'Pack com',
    showPriceSubtitle: true,
  },
  LT: {
    name: 'latas',
    displayName: 'Lata',
    shortName: 'LT',
    icon: LataSVG,
    measureUnit: 'litro',
    packingTitle: 'Lata com',
    showPriceSubtitle: true,
  },
};

export const usePackingIcon = (code: PackagesTypesProps) => {
  const packingInfo = useMemo(() => PackingTypes[code], [code]);

  return packingInfo?.icon || null;
};

export const usePackingInfos = (code: PackagesTypesProps) => {
  const packingInfo = useMemo(() => PackingTypes[code], [code]);

  return packingInfo || null;
};

export default PackingTypes;
