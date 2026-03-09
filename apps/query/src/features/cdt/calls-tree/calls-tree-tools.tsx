import { useDownloadCallsTreeDataMutation } from '@app/store/cdt-openapi';
import { useAppSelector } from '@app/store/hooks';
import { selectDashboardState } from '@app/store/slices/calls-tree-context-slices';
import {
    ArrowLeftOutlined,
    DownloadOutlined,
    PlusCircleOutlined,
    BarChartOutlined,
    UnorderedListOutlined,
    PartitionOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { useCallback } from 'react';
import { useEnableWidgetFunction } from './hooks/use-widgets';

export const CallsTreeBackToOverviewButton = () => {
    return (
        <Button
            type="default"
            icon={<ArrowLeftOutlined style={{ fontSize: 20 }} />}
            onClick={() => console.log('Back to overview clicked')}
        >
            Back to Overview
        </Button>
    );
};

export const CallsTreeDownloadButton = () => {
    const { panels } = useAppSelector(selectDashboardState);
    const [downloadCallsTreeData] = useDownloadCallsTreeDataMutation();
    const downloadCallsTree = useCallback(() => {
        downloadCallsTreeData({ initialPanelState: panels });
    }, [panels, downloadCallsTreeData]);

    return <Button type="default" icon={<DownloadOutlined style={{ fontSize: 20 }} />} onClick={downloadCallsTree} />;
};

export const CallsTreeAddWidgetDropdown = () => {
    const enableWidget = useEnableWidgetFunction();

    function handleClick({ key }: { key: string }) {
        switch (key) {
            case 'frame-graph':
                enableWidget('frame-graph', { w: 12, h: 1 });
                break;
            case 'statistics':
                enableWidget('stats', { w: 3, h: 2 });
                break;
            case 'call-tree':
                enableWidget('calls-tree', { w: 9, h: 2 });
                break;
        }
    }

    const menu = (
        <Menu
            onClick={handleClick}
            items={[
                { key: 'frame-graph', icon: <BarChartOutlined style={{ fontSize: 20 }} />, label: 'Frame Graph' },
                { key: 'statistics', icon: <UnorderedListOutlined style={{ fontSize: 20 }} />, label: 'Statistics' },
                { key: 'call-tree', icon: <PartitionOutlined style={{ fontSize: 20 }} />, label: 'Call Tree' },
            ]}
        />
    );

    return (
        <Dropdown overlay={menu} trigger={['hover']}>
            <Button type="default" icon={<PlusCircleOutlined style={{ fontSize: 20 }} />} />
        </Dropdown>
    );
};
