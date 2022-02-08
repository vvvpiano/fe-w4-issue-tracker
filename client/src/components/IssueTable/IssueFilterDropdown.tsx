import React from 'react';
import { useRecoilValueLoadable, useRecoilState, SetterOrUpdater } from 'recoil';
import {
    userInfoAtom,
    labelInfoAtom,
    milestoneInfoAtom,
    statusInfoAtom,
    issueFieldFilterState,
} from '@atoms';
import styled from 'styled-components';
import { RoundBorderDiv, TextMedium, AlignYCenter } from '@styles/styleTemplates';
import { IFilter, issueFilterType, IFilterInfo, IFieldFilterState } from '@types';
import { OptionField } from '@components/assets';

interface IProps {
    dropdown: boolean;
    filterProperty: IFilter;
}

const getFilterAtom = (type: issueFilterType) => {
    switch (type) {
        case 'assignee':
            return userInfoAtom;
        case 'label':
            return labelInfoAtom;
        case 'milestone':
            return milestoneInfoAtom;
        case 'author':
            return userInfoAtom;
        case 'statusChange':
            return statusInfoAtom;
        default:
            throw Error('no match filter type');
    }
};

const getOptionClickHandler = (
    type: issueFilterType,
    setState: SetterOrUpdater<IFieldFilterState>
) => {
    if (type === 'assignee' || type === 'milestone' || type === 'author')
        return (value: number) =>
            setState((prevState: IFieldFilterState) => {
                return { ...prevState, [type]: value };
            });
    if (type === 'label')
        return (value: number) =>
            setState((prevState: IFieldFilterState) => {
                const newLabelFilters = [...prevState['label'], value];
                return { ...prevState, label: newLabelFilters };
            });
    return () => setState((prevState) => prevState);
};

export const IssueFilterDropdown = ({ dropdown, filterProperty }: IProps) => {
    const { title, type, emptyFilterOption } = filterProperty;
    const optionsAtom = getFilterAtom(type);
    const optionsData = useRecoilValueLoadable<IFilterInfo[]>(optionsAtom);
    const [issueFieldFilter, setIssueFieldFilterState] =
        useRecoilState<IFieldFilterState>(issueFieldFilterState);

    let optionsIncludeEmptyFilterOption: IFilterInfo[] = emptyFilterOption
        ? [{ id: -1, name: emptyFilterOption }]
        : [];
    if (optionsData.state === 'hasValue')
        optionsIncludeEmptyFilterOption = [
            ...optionsIncludeEmptyFilterOption,
            ...optionsData.contents,
        ];

    if (!dropdown) return null;
    return (
        <DropWrapper>
            <FilterTitle>{`${title} 필터`}</FilterTitle>
            {optionsIncludeEmptyFilterOption.map((optionData: IFilterInfo, i) => {
                return (
                    <OptionField
                        filterInfo={optionData}
                        checkbox={type !== 'statusChange'}
                        key={i}
                        onClickHandler={getOptionClickHandler(type, setIssueFieldFilterState)}
                    />
                );
            })}
        </DropWrapper>
    );
};

const DropWrapper = styled(RoundBorderDiv)`
    position: absolute;
    top: 50px;
    right: 0px;
    width: 240px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    background-color: var(--off-white-color);
    & > div {
        ${AlignYCenter}
        padding-left: 16px;
    }
`;

const FilterTitle = styled.div`
    ${TextMedium}
    height: 48px;
    background-color: var(--background-color);
`;
