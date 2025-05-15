import styled from "styled-components";
import { colors } from "../../constants";

export const Container = styled.div`
  min-height: 100vh;
  padding: 0px 16px 70px 16px;
  background: ${colors.brand.white};
`;

export const LoadContainer = styled.div`
  background: ${colors.brand.white};
  padding-top: 50%;
`;

export const Content = styled.div`
  gap: 1px;
  display: flex;
  flex-direction: column;
  background: ${colors.gray.gray10};
`;

export const Title = styled.p`
  margin: 0px;
  font-size: 16px;
  font-weight: 700;
  padding: 8px 20px;
  background-color: ${colors.background1};
`;
