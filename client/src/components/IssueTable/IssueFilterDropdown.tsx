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
import {
    UNSET,
    UNSET_ARRAY,
    ISSUE_WITHOUT_FIELD,
    ISSUE_WITHOUT_LABEL,
} from '@types/globalConstants';
import { OptionField } from '@components/assets';
import { EmptyRow } from '@components/';

interface IProps {
    dropdown: boolean;
    filterProperty: IFilter;
}

const getFilterAtom = (type: issueFilterType) => {
    const filterAtoms = {
        assignee: userInfoAtom,
        label: labelInfoAtom,
        milestone: milestoneInfoAtom,
        author: userInfoAtom,
        statusChange: statusInfoAtom,
    };
    return filterAtoms[type];
};

const getOptionClickHandler = (
    type: issueFilterType,
    setState: SetterOrUpdater<IFieldFilterState>
) => {
    if (type === 'assignee' || type === 'milestone' || type === 'author') {
        return (value: number) =>
            setState((prevState: IFieldFilterState) => {
                const newValue = prevState[type] === value ? UNSET : value;
                return { ...prevState, [type]: newValue };
            });
    }
    if (type === 'label')
        return (value: number) =>
            setState((prevState: IFieldFilterState) => {
                let newValue;
                if (value === ISSUE_WITHOUT_LABEL) {
                    newValue = prevState.label === value ? UNSET_ARRAY : value;
                } else {
                    if (prevState.label === ISSUE_WITHOUT_LABEL) newValue = [value];
                    else {
                        newValue = prevState.label.includes(value)
                            ? prevState.label.filter((id) => id !== value)
                            : [...prevState.label, value];
                    }
                }
                return { ...prevState, label: newValue };
            });
    return () => setState((prevState) => prevState);
};

const getOptionsIncludeEmptyFilterOption = (
    type: issueFilterType,
    emptyFilterOption: string | undefined,
    optionsDataContents: IFilterInfo[]
) => {
    const emptyFilterOptionValue: number | null =
        type === 'label' ? ISSUE_WITHOUT_LABEL : ISSUE_WITHOUT_FIELD;
    let optionsIncludeEmptyFilterOption: IFilterInfo[] = emptyFilterOption
        ? [{ id: emptyFilterOptionValue, name: emptyFilterOption }]
        : [];
    optionsIncludeEmptyFilterOption = [...optionsIncludeEmptyFilterOption, ...optionsDataContents];
    return optionsIncludeEmptyFilterOption;
};

export const IssueFilterDropdown = ({ dropdown, filterProperty }: IProps) => {
    const { title, type, emptyFilterOption } = filterProperty;
    const optionsAtom = getFilterAtom(type);
    const optionsData = useRecoilValueLoadable<IFilterInfo[]>(optionsAtom);
    const [issueFieldFilter, setIssueFieldFilterState] =
        useRecoilState<IFieldFilterState>(issueFieldFilterState);

    const getIsChecked = (type: issueFilterType, id: number | null): boolean => {
        if (type === 'label') {
            if (issueFieldFilter[type] === null) return id === null;
            return issueFieldFilter[type].includes(id);
        }
        return issueFieldFilter[type] === id;
    };

    if (!dropdown) return null;
    return (
        <React.Suspense fallback={<EmptyRow type="error" />}>
            <DropWrapper>
                <FilterTitle>{`${title} ??????`}</FilterTitle>
                {getOptionsIncludeEmptyFilterOption(
                    type,
                    emptyFilterOption,
                    optionsData.contents
                ).map((optionData: IFilterInfo, i) => {
                    return (
                        <OptionField
                            key={i}
                            filterInfo={optionData}
                            checkbox={type !== 'statusChange'}
                            onClickHandler={getOptionClickHandler(type, setIssueFieldFilterState)}
                            isChecked={getIsChecked(type, optionData.id)}
                        />
                    );
                })}
            </DropWrapper>
        </React.Suspense>
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
