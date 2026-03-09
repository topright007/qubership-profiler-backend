import { ESC_CALL_TREE_QUERY_PARAMS } from '@app/constants/query-params';
import { highlight } from '@app/utils/highlight';
import { escapeRegExp } from 'lodash';
import type { FC } from 'react';
import { useSearchParams } from 'react-router-dom';

interface CallsTreeSearchedElementProps {
    text: string;
}

const CallsTreeSearchedElement: FC<CallsTreeSearchedElementProps> = ({ text }) => {
    const [urlParams] = useSearchParams();
    const callsTreeQuery = urlParams.get(ESC_CALL_TREE_QUERY_PARAMS.callsTreeQuery) || '';

    return highlight(text, escapeRegExp(callsTreeQuery));
};

export default CallsTreeSearchedElement;
