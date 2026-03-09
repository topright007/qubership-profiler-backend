import HeapDumpsTable from '@app/features/cdt/heap-dumps/heap-dumps-table';
import { ContentCard } from '@app/components';
import React, { memo } from 'react';

const HeapDumpsContainer = memo(() => {
    return (
        <ContentCard title="Heap Dumps" titleClassName="ux-typography-18px-medium">
            <HeapDumpsTable />
        </ContentCard>
    );
});

HeapDumpsContainer.displayName = 'HeapDumpsContainer';

export default HeapDumpsContainer;
