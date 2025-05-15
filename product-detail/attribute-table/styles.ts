import styled from "styled-components";
import { colors } from "@/constants";

export const Table = styled.table`
    width: 100%;
    
    margin-bottom: 20px;
    border-collapse: collapse;
`;

export const Content = styled.tbody`
    
`;

export const Row = styled.tr`

    &:first-of-type{
        :first-child{
            border-radius: 10px 0px 0px 0px;
        }

        :last-child{
            border-radius: 0px 10px 0px 0px;
        }
    }

    &:last-of-type{
        :first-child{
            border-radius: 0px 0px 0px 10px;
        }

        :last-child{
            border-radius: 0px 0px 10px 0px;
        }
    }

    &:nth-of-type(even){
        .label{
            background-color: ${colors.gray.gray10};
        }

        .value{
            background-color: ${colors.gray.gray0};
        }
    }

    &:nth-of-type(odd){
        .label{
            background-color: ${colors.background1};
        }

        .value{
            background-color: ${colors.gray.gray10};
        }
    }
`;

export const Cell = styled.td`
    width: 50%;
    padding: 16px 20px;

    font-size: 14px;
    line-height: 21px;
    font-weight: 400;
    color: ${colors.gray.gray60};
`;