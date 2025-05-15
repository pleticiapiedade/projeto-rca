import * as S from "./Styled";
import { Slider } from "@/components";
// import fastTruck from "@/assets/svgs/fastTruck.svg";

import {
  RiCurrencyLine,
  RiChatSmile2Line,
  RiCheckboxMultipleLine,
} from "react-icons/ri";

const fastTruck = `${process.env.PUBLIC_URL}/fastTruck.svg`;

const RenderProducts = () => {
  const verticalItems: any[] = [
    <S.VerticalBannerContent key="fast-entregas">
      <S.ImgIcon src={fastTruck} />

      <S.Paragraph>
        <S.Emphasis>Rapidez</S.Emphasis> nas entregas
      </S.Paragraph>
    </S.VerticalBannerContent>,
    <S.VerticalBannerContent key="fast-qualidade">
      <RiCheckboxMultipleLine size={48} />

      <S.Paragraph>
        Produtos com <S.Emphasis>qualidade</S.Emphasis>
      </S.Paragraph>
    </S.VerticalBannerContent>,
    <S.VerticalBannerContent key="fast-pagamento">
      <RiCurrencyLine size={48} />

      <S.Paragraph>
        As melhores
        <S.Br />
        <S.Emphasis>formas de pagamento</S.Emphasis>
      </S.Paragraph>
    </S.VerticalBannerContent>,
    <S.VerticalBannerContent key="fast-betina">
      <RiChatSmile2Line size={48} />

      <S.Paragraph>
        Compre com a <S.Emphasis>Betina</S.Emphasis>
      </S.Paragraph>
    </S.VerticalBannerContent>,
  ];

  return (
    <S.ContentBanner>
      <S.BgBanner>
        <Slider
          id="fast-way"
          vertical
          infinite
          autoplay
          marginBottom={1}
          hasMarginTop={false}
          className="fastWay"
          slides={verticalItems}
        />
      </S.BgBanner>
    </S.ContentBanner>
  );
};

export default RenderProducts;
