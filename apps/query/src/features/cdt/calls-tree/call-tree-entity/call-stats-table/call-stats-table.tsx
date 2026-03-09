import { useAppSelector } from '@app/store/hooks';
import { selectStatsState } from '@app/store/slices/calls-tree-context-slices';
import { TreeTable } from '@app/components/tree-table/tree-table';
import { memo, useMemo, type FC } from 'react';
import { createCallStatsTableData, findTreeNode } from '../utils/calls-tree-operations';
import { columnsFactory, type TableData } from './columns';
import { useCallsTreeData } from '../../calls-tree-context';
import type { CallStatsInfo } from '@app/store/cdt-openapi';

const emptyCallsStats: CallStatsInfo[] = [];

const CallStatsTable: FC = () => {
    const { data, isFetching } = useCallsTreeData();

    const { selectedRowId } = useAppSelector(selectStatsState);

    const tableData = useMemo(() => {
        if (!selectedRowId || !data?.children) return emptyCallsStats;
        const node = findTreeNode(data?.children, selectedRowId);
        if (!node) return emptyCallsStats;
        return createCallStatsTableData(node);
    }, [data?.children, selectedRowId]);

    return (
        <div className="table-container">
            <TreeTable<TableData>
                columns={columnsFactory()}
                data={tableData}
                loading={isFetching}
                className="ux-table"
                rowKey={r => r.name ?? ''}
            />
        </div>
    );
};

export default memo(CallStatsTable);
