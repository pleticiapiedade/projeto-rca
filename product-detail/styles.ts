import styled from 'styled-components';
import { colors } from '@/constants';

export const PageView = styled.div`
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 0 16px;
  padding-bottom: 100px;
`;

export const ProductGallery = styled.div`
  padding-top: 20px;

  .swiper-slide-active {
    img {
      transform: scale(1) !important;
    }
  }

  .swiper-slide {
    img {
      width: 100%;
      border-radius: 10px;
      transition: all 0.5s;
      transform: scale(0.9);
    }
  }
  .swiper-wrapper {
    align-items: center;
    margin-bottom: 12px;
  }
`;

export const ImagePlaceHolder = styled.div`
  width: 300px;
  height: 300px;

  background-color: ${colors.brand.red};

  border-radius: 10px;
`;

export const ProductImage = styled.div``;

export const ProductInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
`;

export const ProductName = styled.span`
  font-size: 18px;
  line-height: 25.2px;
  font-weight: 700;
  color: ${colors.brand.grafite};

  max-width: 256px;
`;

export const Row = styled.div`
  display: inline-flex;
  justify-content: space-between;
`;

export const ProductCodes = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
`;

export const ProductCodeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  background-color: ${colors.background1};
  padding: 4px;
  border-radius: 4px;
`;

export const Code = styled.span`
  font-size: 10px;
  line-height: 11.72px;
  color: ${colors.gray.gray60};
`;

export const DescriptionWrapper = styled.div`
  display: flex;
`;

export const DescriptionText = styled.p`
  margin: 0;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.75px;
  color: ${colors.gray.gray40};

  padding-bottom: 14px;
`;

export const AttributesWrapper = styled.div`
  padding-bottom: 20px;
`;

export const LastPurchaseContainer = styled.div`

`;

export const LastPurchaseText = styled.span`
  font-size: 14px;
  line-height: 16.41px;
  color: ${colors.brand.grafite};
  font-weight: 400;
`;

export const LastPurchaseRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;

  margin-top: 8px;
`;

export const LastPurchaseBold = styled.span`
  font-size: 14px;
  line-height: 16.41px;
  color: ${colors.brand.grafite};
  font-weight: 700;
`;
