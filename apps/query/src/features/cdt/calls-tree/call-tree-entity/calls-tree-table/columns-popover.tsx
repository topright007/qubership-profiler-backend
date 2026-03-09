import { CALLS_COLUMNS_KEYS, useSortedCallsColumns } from '@app/features/cdt/calls-tree/hooks/use-calls-tree-columns';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { callsTreeContextDataAction, selectCallsTreeState } from '@app/store/slices/calls-tree-context-slices';
import { PropertiesList, type PropertiesItemModel } from '@app/components';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { memo, useCallback, type Key, type ReactNode } from 'react';

const ColumnsPopover = () => {
    const { columnsOrder, hiddenColumns } = useAppSelector(selectCallsTreeState);
    const dispatch = useAppDispatch();

    const _columnsOrder = columnsOrder.length ? columnsOrder : CALLS_COLUMNS_KEYS;
    const sortedColumns = useSortedCallsColumns();

    const handleToggle = useCallback(
        (item: PropertiesItemModel<unknown>) => {
            if (hiddenColumns.includes(item.value)) {
                dispatch(callsTreeContextDataAction.setHiddenColumns(hiddenColumns.filter(c => c !== item.value)));
            } else {
                dispatch(callsTreeContextDataAction.setHiddenColumns([...hiddenColumns, item.value]));
            }
        },
        [hiddenColumns]
    );
    return (
        <Popover
            placement="bottomRight"
            title={<span>Properties</span>}
            content={
                <PropertiesList
                    items={sortedColumns.map(col => ({
                        label: col.name as ReactNode,
                        value: col.name as Key,
                        data: col,
                        hidden: hiddenColumns.includes(col.name),
                    }))}
                    onToggle={handleToggle}
                />
            }
        >
            <Button type="default" icon={<SettingOutlined style={{ fontSize: 20 }} />} />
        </Popover>
    );
};

export default memo(ColumnsPopover);
