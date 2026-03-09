import type { ReactNode } from 'react';
import type { TreeTableColumn } from '@app/components/tree-table/types';
import type { CallParameter } from '@app/store/cdt-openapi';

export type TableData = CallParameter;

export const columnsFactory = (): TreeTableColumn<TableData>[] => [
    {
        name: 'Parameter',
        type: 'accessor',
        dataKey: 'id',
        cellRender: props => (props.getValue?.() ?? null) as ReactNode,
    },
];
