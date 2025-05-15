import styled from "styled-components";
import { colors } from "@/constants";
import { NavLink as Link } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";

export const Arrow = styled(RiArrowRightSLine)`
  color: ${colors.gray.gray50};
`;

export const NavLink = styled(Link)`
  width: 100%;
  border: none;
  padding: 20px 5px;
  align-items: center;
  display: inline-flex;
  text-decoration: none;
  justify-content: space-between;
  background-color: ${colors.brand.white};
`;

export const LinkTo = styled.a`
  width: 100%;
  border: none;
  padding: 20px 5px;
  align-items: center;
  display: inline-flex;
  text-decoration: none;
  justify-content: space-between;
  background-color: ${colors.brand.white};
`;

export const Content = styled.button`
  width: 100%;
  border: none;
  padding: 20px 5px;
  align-items: center;
  display: inline-flex;
  justify-content: space-between;
  background-color: ${colors.brand.white};
`;

export const LiveTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 2px 9px;
  margin-left: 8px;
  border-radius: 3px;
  color: ${colors.brand.white};
  background-color: ${colors.brand.red};
`;

export const Image = styled.img`
  width: 75px;
`;

export const Name = styled.p<{ $bold?: string }>`
  margin: 0px;
  padding: 0px;
  font-size: 16px;
  font-weight: 400;
  display: inline-flex;
  color: ${colors.gray.gray60};
  font-weight: ${({ $bold }) => ($bold ? 700 : 400)};
`;
