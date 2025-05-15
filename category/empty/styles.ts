import { colors } from "@/constants";
import styled from "styled-components";
import { RiSearchLine } from "react-icons/ri";

export const Row = styled.div`
  display: grid;
  place-items: center;
`;

export const EmptyContent = styled.div`
  padding: 47px 15px;
  background-color: ${colors.gray.gray10};
`;

export const SearchIcon = styled(RiSearchLine)`
  margin-bottom: 8px;
  color: ${colors.grey12};
`;

export const Title = styled.h4`
  font-size: 46px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  color: ${colors.brand.grafite};
`;

export const Text = styled.p`
  font-size: 20px;
  font-weight: 300;
  padding: 0px 20px;
  margin-bottom: 10px;
  text-align: center;
  color: ${colors.brand.grafite};
`;

export const TextSearchTerm = styled.span`
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin: 0px 19px 54px 5px;
`;

export const Question = styled.h6`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: left;
  color: ${colors.brand.grafite};
`;

export const Instruction = styled.p`
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  margin-bottom: 8px;
  color: ${colors.brand.grafite};
`;
