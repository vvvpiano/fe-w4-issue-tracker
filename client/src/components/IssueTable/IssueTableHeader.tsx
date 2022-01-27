import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { TableHeader, AlignXYCenter, SmallIcon } from '@styles/styleTemplates';
import { IFilter } from '@types';
import { FilterButton } from '@components/assets';
import { ReactComponent as Alertcircle } from '@icons/AlertCircle.svg';
import { ReactComponent as Archive } from '@icons/Archive.svg';

interface IProps {
    selectMode: boolean;
}

const FilterTypes: IFilter[] = [
    { title: '담당자', type: 'assignee', emptyFilterOption: '담당자가 없는 이슈' },
    { title: '레이블', type: 'label', emptyFilterOption: '레이블이 없는 이슈' },
    { title: '마일스톤', type: 'milestone', emptyFilterOption: '마일스톤이 없는 이슈' },
    { title: '작성자', type: 'author' },
];

const renderFilterButton = (selectMode: boolean, FilterTypes: IFilter[]) => {
    const onClickHandler = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        // TODO: 필터타입별로 options가 될 수 있는 리스트들을 fetch해와서 드롭다운으로 보여주기
    };
    if (selectMode) return <IssueFilterButton title="상태 수정" onClickHandler={onClickHandler} />;
    return FilterTypes.map(({ title, type }: IFilter) => (
        <IssueFilterButton title={title} onClickHandler={onClickHandler} key={type} />
    ));
};

export const IssueTableHeader = ({ selectMode }: IProps) => {
    return (
        <>
            <Checkbox>
                <input type="checkbox" />
            </Checkbox>
            <IssueStatuses>
                <Status>
                    <Alertcircle />
                    열린 이슈({2})
                </Status>
                <Status>
                    <Archive />
                    닫힌 이슈({0})
                </Status>
            </IssueStatuses>
            {renderFilterButton(selectMode, FilterTypes)}
        </>
    );
};

const Checkbox = styled.div`
    ${TableHeader}
    padding: 0 20px 0 32px;
    & input {
        width: 16px;
        height: 16px;
    }
`;

const IssueStatuses = styled.div`
    ${TableHeader}
    line-height: normal;
    display: flex;
    padding: 0 4px;
`;

const Status = styled.div`
    ${AlignXYCenter}
    padding: 12px;
    ${SmallIcon()}
    & svg {
        padding-right: 4px;
    }
`;

const IssueFilterButton = styled(FilterButton)`
    ${TableHeader}
    ${AlignXYCenter}
    padding-left: 16px;
    width: 100%;
`;