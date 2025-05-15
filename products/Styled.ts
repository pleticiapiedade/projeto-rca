import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../constants";
import { CardMode } from "@/types";

export const Div = styled.div`
  width: 100%;
`;

export const CardModeText = styled.p`
  font-size: 12px;
  color: ${colors.brand.grafite};
`;

export const Row = styled.div`
  gap: 10px;
  width: 100%;
  padding: 0px 15px;
  margin-bottom: 10px;
  align-items: center;
  display: inline-flex;
  justify-content: flex-end;
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
`;

export const Timer = styled.div`
  padding: 5px 10px;
  border-radius: 6px;
  align-items: center;
  display: inline-flex;
  background-color: red;
  justify-content: space-between;
`;

export const OfferText = styled.div<{ margin?: string }>`
  flex: 1;
  font-size: 12px;
  margin-block-end: ${({ margin }) => (!margin ? "1" : margin)}em;
  margin-block-start: ${({ margin }) => (!margin ? "1" : margin)}em;
  color: ${colors.brand.white};
`;

export const SeeAll = styled(Link)`
  flex: 1;
  width: 100%;
  text-align: end;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 13px;
  text-decoration: none;
  color: ${colors.brand.white};
`;

export const OfferSpan = styled.span`
  font-weight: 700;
`;

export const LoadMore = styled.button`
  border-radius: 4px;
  padding: 5px 10px;
  margin-bottom: 100px;
  color: ${colors.brand.white};
  background-color: ${colors.brand.grafite};
`;

export const ImgLoading = styled.img`
  width: 40px;
`;

export const Loading = styled.div`
  text-align: center;
  padding-bottom: 20vh;
`;

export const LoadingText = styled.p`
  color: ${colors.grey2};
`;

export const ContentList = styled.div<{ $direction?: CardMode }>`
  gap: 10px;
  display: grid;
  grid-template-columns: ${({ $direction }) => $direction === 'grid' ? 'repeat(2, calc(50% - 5px))' : 'repeat(1, 100%)'};
`;

export const ProductsList = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  overflow: hidden;
  position: relative;
  padding-bottom: 50px;
`;

export const ContainerSlider = styled.div`
  img {
    transform: scale(0.7);
    transition: all 0.65s;
    transform-origin: center;
  }
  .swiper-slide-active {
    img {
      transform: scale(1);
    }
  }
`;

export const Container = styled.div`
  &::-webkit-scrollbar {
    width: 0px !important;
  }
  padding-bottom: 25px;
  background: ${colors.background2};
  min-height: 100vh;
`;
