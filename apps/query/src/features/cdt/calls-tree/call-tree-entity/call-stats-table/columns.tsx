import type { ReactNode } from 'react';
import type { TreeTableColumn } from '@app/components/tree-table/types';
import type { CallStatsInfo } from '@app/store/cdt-openapi';
import prettyMilliseconds from 'pretty-ms';

export type TableData = CallStatsInfo;

export const columnsFactory = (): TreeTableColumn<TableData>[] => [
    {
        name: 'Name',
        type: 'accessor',
        dataKey: 'name',
        width: 115,
        cellRender: props => (props.getValue?.() ?? null) as ReactNode,
    },
    {
        name: 'method itself',
        type: 'accessor',
        dataKey: 'self',
        width: 158,
        cellRender: props => {
            if (props.row.original.total) return prettyMilliseconds(Number(props.getValue?.() ?? 0));
            return (props.getValue?.() ?? null) as ReactNode;
        },
    },
    {
        name: 'with children',
        type: 'accessor',
        dataKey: 'total',
        width: 131,
        cellRender: props => {
            const v = props.getValue?.();
            return v != null ? prettyMilliseconds(v as number) : null;
        },
    },
];
