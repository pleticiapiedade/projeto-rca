import { colors } from "@/constants";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Title = styled.h4`
  padding-left: 15px;
`;

export const SeeAllButton = styled(NavLink)`
  height: 24px;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 15px;
  line-height: 14px;
  border-radius: 4px;
  margin-right: 15px;
  border: none;
  display: grid;
  text-align: center;
  place-items: center;
  text-decoration: none;
  background-color: ${colors.brand.white};
  color: ${colors.gray.gray60};
`;

export const SpaceBetween = styled.div`
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
  display: inline-flex;
  justify-content: space-between;
`;

export const ContentCategory = styled.div`
  display: inline-flex;
  gap: 14px;
  padding-right: 15px;
  padding-left: 15px;
`;

export const ContainerCategory = styled.div`
  &::-webkit-scrollbar {
    height: 0px !important;
  }
  width: 100%;
  user-select: none;
  overflow-x: scroll;
  margin-bottom: 20px;
`;

export const BoxCategoryImg = styled(NavLink)`
  width: 95px;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  color: ${colors.gray.gray60};
  text-decoration: none;
`;

export const CategoryImg = styled.img`
  width: 100%;
  padding: 8px;
  object-fit: contain;
`;

export const CategoryDescription = styled.p`
  font-size: 12px;
  font-weight: 500;
  text-align: center;
`;
