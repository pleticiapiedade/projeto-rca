import { colors } from "@/constants";
import styled from "styled-components";

export const Content = styled.div`
  width: 100%;
  background-color: ${colors.gray.gray10};
`;

export const TextContent = styled.span``;

export const HeaderView = styled.div`
  top: 0px;
  z-index: 1;
  width: 100%;
  bottom: 0px;
  position: sticky;
  margin-bottom: 10px;
  align-items: center;
  display: inline-flex;
  padding: 10px 20px 20px 20px;
  background-color: ${colors.brand.grafite};
  box-shadow: 0px 10px 15px 0px ${colors.shadown2};
`;

export const CancelButton = styled.button<{ $show: boolean }>`
  padding: 0px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s;
  color: ${colors.brand.white};
  opacity: ${(i) => (i.$show ? 1 : 0)};
  background-color: ${colors.transparent};
  margin-left: ${(i) => (i.$show ? 10 : 0)}px;
  max-width: ${(i) => (i.$show ? "100%" : "0px")};
`;

export const ContentList = styled.div<{ $isgrid: boolean }>`
  display: grid;
  gap: ${(i) => (i.$isgrid ? 10 : 20)}px;
  grid-template-columns: ${(i) =>
    i.$isgrid ? "repeat(2, calc(50% - 5px))" : "repeat(1, 100%)"};
`;

export const Counter = styled.p`
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  color: ${colors.brand.grafite};
`;

export const Container = styled.div`
  padding: 0px 15px 80px 15px;
`;

export const ContentLoading = styled.div`
  width: 100%;
  height: 50vh;
  display: grid;
  overflow: hidden;
  place-items: center;
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  margin: 10px 0px 18px 0px;
  background-color: ${colors.grey13};
`;
