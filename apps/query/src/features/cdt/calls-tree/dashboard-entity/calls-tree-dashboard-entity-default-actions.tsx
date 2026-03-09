import { EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import type { FC } from 'react';
import { useDisableWidgetFunction } from '../hooks/use-widgets';
import { type Widget } from '@app/store/slices/calls-tree-context-slices';

const DefaultEntityActions: FC<Widget> = ({ i }) => {
    const disableWidget = useDisableWidgetFunction();

    function handleClick(key: string) {
        switch (key) {
            case 'edit':
                console.log('Edit choosen: ', i);
                break;
            case 'remove':
                disableWidget(i);
                break;
        }
    }

    const menu = (
        <Menu
            onClick={({ key }) => handleClick(key)}
            items={[
                { key: 'edit', icon: <EditOutlined style={{ fontSize: 16 }} />, label: 'Edit' },
                { key: 'remove', icon: <DeleteOutlined style={{ fontSize: 16 }} />, label: 'Remove', className: 'amarant-label' },
            ]}
        />
    );

    return (
        <Dropdown overlay={menu}>
            <Button type="default" icon={<EllipsisOutlined style={{ fontSize: 20 }} />} />
        </Dropdown>
    );
};

export default DefaultEntityActions;
