import { colors } from "@/constants";
import { RiEdit2Line } from "react-icons/ri";
import styled, { css } from "styled-components";
interface PriceProps {
  $extraPadding?: boolean;
}

export const PriceBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  padding: 20px;
  border-radius: 10px;

  background-color: ${colors.brand.white};
`;

export const LabelPackage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

export const Line = styled.div`
  max-width: 96px;
  flex-grow: 1;
  height: 2px;
  background-color: ${colors.gray.gray10};
`;

export const FullLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${colors.background1};
`;

export const Label = styled.span`
  text-align: center;

  font-size: 11px;
  line-height: 12.89px;
  font-weight: 400;
  color: ${colors.gray.gray50};
`;

export const PackageWrapper = styled.div``;

export const PackageIcon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 60px;
  height: 60px;

  background-color: ${colors.gray.gray10};
  border-top: 2px solid ${colors.gray.gray50};
  border-radius: 10px 10px 0px 0px;

  font-size: 12px;
  font-weight: 400;
  line-height: 14.06px;
  color: ${colors.gray.gray50};

  img {
    width: 24px;
    height: 24px;
  }
`;

export const PackageInfo = styled.div`
  padding: 8px 16px;
  /* height: 30px; */
  background-color: ${colors.gray.gray10};
  border-radius: 0px 10px 0px 0px;

  font-size: 12px;
  line-height: 14.06px;
  font-weight: 500;
  color: ${colors.gray.gray50};
`;

export const InfoDetail = styled.span``;

export const StockContainer = styled.div`
  margin-top: 10px;
`;

export const PriceWrapper = styled.div`
  width: 100%;
  padding: 4px 16px 16px 16px;

  background-color: ${colors.gray.gray10};
  border-radius: 0 0 10px 10px;
`;

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 24px;
`;

export const OldPrice = styled.span`
  font-size: 12px;
  line-height: 16.8px;
  font-weight: 400;
  color: ${colors.gray.gray50};
  text-decoration: line-through ${colors.gray.gray50};
 
`;

export const Price = styled.span<PriceProps>`
  font-size: 12px;
  font-weight: 700;
  line-height: 16.8px;
  color: ${colors.brand.grafite};
 
`;

export const UnityPrice = styled.span<PriceProps>`
  display: flex;
  font-size: 18px;
  line-height: 21.6px;
  /* line-height: 16.8px; */
  font-weight: 700;
  color: ${colors.brand.grafite};
  ${props => props.$extraPadding && css`
    padding-top: 8px;
  `}
`;

export const Row = styled.div`
  display: inline-flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`

export const ButtonFlex = styled.button<{ $isdisabled?: boolean }>`
  gap: 4px;
  border: none;
  display: flex;
  font-size: 12px;
  cursor: pointer;
  border-radius: 6px;
  height: fit-content;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 8px 12px 8px 12px;
  color: ${(i) => (i.$isdisabled ? colors.gray.gray30 : colors.brand.white)};
  /* opacity: ${(i) => (i.$isdisabled ? 0.3 : 1)}; */
  background-color: ${(i) =>
    i.$isdisabled ? colors.gray.gray10 : colors.brand.grafite};
`;

export const EditIcon = styled(RiEdit2Line)``;

export const LastPurchase = styled.div`
    margin-top: 10px;
`;

export const LastPurchaseRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;

  margin-top: 8px;
  font-size: 12px;
`;

export const LastPurchaseLabel = styled.span`
  line-height: 16.41px;
  color: ${colors.brand.grafite};
  font-weight: 400;
`;

export const LastPurchaseBold = styled.span`
  line-height: 16.41px;
  color: ${colors.brand.grafite};
  font-weight: 700;
`;


export const Space = styled.div`
  flex-grow: 1;
  margin: 0 4px;
  background-color: transparent;
  border-bottom: 2px solid ${colors.brand.white};
  height: 2px;
`;