import { colors } from "@/constants";
import styled from "styled-components";

export const Br = styled.br``;

export const Emphasis = styled.span`
  font-weight: 600;
  text-decoration: underline;
  margin: 0px 5px;
`;

export const Paragraph = styled.p`
  text-align: center;
  width: -webkit-fill-available;
`;

export const ImgIcon = styled.img``;

export const VerticalBannerContent = styled.div`
  height: 60px;
  padding: 0px 20px;
  display: flex;
  overflow: hidden;
  position: relative;
  align-items: center;
  flex-direction: row;
  background-color: ${colors.brand.white};
`;

export const ContentBanner = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 15px;
  margin-top: 25px;
`;

export const BgBanner = styled.div`
  border-radius: 6px;
  overflow: hidden;
  background-color: ${colors.brand.white};
`;
