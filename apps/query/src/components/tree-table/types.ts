import type { ReactNode } from 'react';

export interface TreeTableColumn<T> {
    id?: string;
    name: string;
    type?: string;
    dataKey?: keyof T | string;
    accessorFn?: (row: T) => unknown;
    cellRender?: (props: {
        row: { original: T; id: string; getIsSelected?: () => boolean };
        getValue?: () => unknown;
    }) => ReactNode;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
}

export type TreeTableExpandedState = Record<string, boolean>;

export interface TreeTableRow<T> {
    original: T;
    id: string;
    getIsSelected?: () => boolean;
}
