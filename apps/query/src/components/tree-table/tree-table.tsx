import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useMemo, useState, useCallback } from 'react';
import type { TreeTableColumn, TreeTableExpandedState, TreeTableRow } from './types';

export interface TreeTableProps<T extends Record<string, unknown>> {
    columns: TreeTableColumn<T>[];
    data: T[] | undefined;
    treeData?: boolean;
    loading?: boolean;
    className?: string;
    rowKey?: keyof T | ((record: T) => string);
    expandedRows?: TreeTableExpandedState;
    onExpandedRowsChange?: (state: TreeTableExpandedState) => void;
    rowSelection?: boolean;
    onSelect?: (row: TreeTableRow<T>) => void;
}

function getRowKey<T>(record: T, rowKey: keyof T | ((record: T) => string)): string {
    return typeof rowKey === 'function' ? rowKey(record) : String(record[rowKey]);
}

export function TreeTable<T extends Record<string, unknown>>({
    columns,
    data,
    treeData,
    loading,
    className,
    rowKey = 'id' as keyof T,
    expandedRows = {},
    onExpandedRowsChange,
    rowSelection,
    onSelect,
}: TreeTableProps<T>) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const antdColumns: ColumnsType<T> = useMemo(
        () =>
            columns.map(col => ({
                title: col.name,
                key: col.id ?? (col.dataKey as string) ?? col.name,
                dataIndex: col.dataKey as string,
                width: col.minWidth ?? col.maxWidth,
                minWidth: col.minWidth,
                maxWidth: col.maxWidth,
                render: (_: unknown, record: T) => {
                    const id = getRowKey(record, rowKey);
                    const getValue = () =>
                        col.accessorFn ? col.accessorFn(record) : (col.dataKey ? record[col.dataKey as keyof T] : undefined);
                    return col.cellRender?.({
                        row: {
                            original: record,
                            id,
                            getIsSelected: () => selectedRowKeys.includes(id),
                        },
                        getValue,
                    });
                },
            })),
        [columns, selectedRowKeys, rowKey]
    );

    const expandedRowKeys = useMemo(
        () => Object.keys(expandedRows).filter(k => expandedRows[k]),
        [expandedRows]
    );

    const handleExpand = useCallback(
        (expanded: boolean, record: T) => {
            if (!onExpandedRowsChange) return;
            const id = getRowKey(record, rowKey);
            const next = { ...expandedRows, [id]: expanded };
            onExpandedRowsChange(next);
        },
        [expandedRows, onExpandedRowsChange, rowKey]
    );

    const rowSelectionConfig =
        rowSelection && onSelect
            ? {
                  selectedRowKeys,
                  onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
                  type: 'checkbox' as const,
              }
            : undefined;

    const onRow = useCallback(
        (record: T) => ({
            onClick: () => {
                const id = getRowKey(record, rowKey);
                onSelect?.({
                    original: record,
                    id,
                    getIsSelected: () => selectedRowKeys.includes(id),
                });
            },
        }),
        [onSelect, selectedRowKeys, rowKey]
    );

    const expandable = useMemo(
        () =>
            treeData && onExpandedRowsChange
                ? {
                      expandedRowKeys,
                      onExpand: (expanded: boolean, record: T) => handleExpand(expanded, record),
                  }
                : undefined,
        [treeData, onExpandedRowsChange, expandedRowKeys, handleExpand]
    );

    return (
        <Table<T>
            className={className}
            columns={antdColumns}
            dataSource={data}
            rowKey={rowKey as string}
            loading={loading}
            expandable={expandable}
            rowSelection={rowSelectionConfig}
            onRow={onRow}
            pagination={false}
            size="small"
        />
    );
}
