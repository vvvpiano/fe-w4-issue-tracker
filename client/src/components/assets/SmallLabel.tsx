import React from 'react';
import styled, { css } from 'styled-components';
import { TextXSmall } from '@styles/styleTemplates';
import { ILabel } from '@types';

type labelType = 'dark-text' | 'light-text' | 'line';
interface IProps {
    type: labelType;
    labelInfo: ILabel;
}

export const SmallLabel = ({ type, labelInfo: { name, color } }: IProps) => {
    return (
        <StyledLabel type={type} mainColor={color}>
            {name}
        </StyledLabel>
    );
};

const StyledLabel = styled.div<{ type: labelType; mainColor: string }>`
    ${TextXSmall}
    width: fit-content;
    box-sizing: border-box;
    border-radius: 30px;
    border: 1px solid;
    height: 28px;
    padding: 4px 16px;

    ${({ type, mainColor }) => {
        if (type === 'dark-text')
            return css`
                background-color: ${mainColor};
                border-color: ${mainColor};
                color: var(--title-active-color);
            `;
        else if (type === 'light-text')
            return css`
                background-color: ${mainColor};
                border-color: ${mainColor};
                color: var(--off-white-color);
            `;
        // type === 'line
        else
            return css`
                background-color: unset;
                border-color: ${mainColor};
                color: var(--label-color);
            `;
    }}
`;
