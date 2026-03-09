import type { TreeTableColumn } from '@app/components/tree-table/types';
import HighlightCell from '@app/components/highlight-cell/highlight-cell';
import type { StatsInfo } from '@app/store/cdt-openapi';

export type TableData = StatsInfo;

export const columnsFactory = (): TreeTableColumn<TableData>[] => [
    {
        name: '',
        type: 'accessor',
        dataKey: 'name',
        width: 200,
        cellRender: props => <span style={{ display: 'inline-flex', gap: 8 }}>{String(props.getValue?.() ?? '')} </span>,
    },
    {
        name: '',
        type: 'accessor',
        dataKey: 'totalTime',
        width: 110,
        cellRender: props =>
            props.getValue?.() ? (
                <span style={{ height: 13, display: 'inline-flex', gap: 8, fontWeight: 500 }}>
                    {String(props.getValue?.())}
                    {' ms'}
                </span>
            ) : null,
    },
    {
        name: '',
        type: 'accessor',
        dataKey: 'totalTimePercent',
        width: 110,
        cellRender: props => {
            const v = (props.getValue?.() ?? undefined) as number | undefined;
            return v != null ? (
                <HighlightCell highlight={v > 90}>{`(${v.toFixed(2)}%)`}</HighlightCell>
            ) : null;
        },
    },
];
