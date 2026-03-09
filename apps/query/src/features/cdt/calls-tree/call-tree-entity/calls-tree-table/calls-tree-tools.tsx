import { ESC_CALL_TREE_QUERY_PARAMS } from '@app/constants/query-params';
import { EllipsisOutlined, BookOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu } from 'antd';
import { useState, type FC, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from '../content-controls.module.scss';
import ColumnsPopover from './columns-popover';
import { useDisableWidgetFunction } from '../../hooks/use-widgets';
import { useDebounceCallback } from '@react-hook/debounce';

const CallsTreeTableSearch: FC = () => {
    const [urlParams, setUrlParams] = useSearchParams();
    const [callsTreeQuery, setCallsTreeQuery] = useState(
        urlParams.get(ESC_CALL_TREE_QUERY_PARAMS.callsTreeQuery) || ''
    );
    const applyCallsTreeQuery = useDebounceCallback(() => {
        setUrlParams(params => {
            if (callsTreeQuery) {
                params.set(ESC_CALL_TREE_QUERY_PARAMS.callsTreeQuery, callsTreeQuery?.toString());
            } else {
                params.delete(ESC_CALL_TREE_QUERY_PARAMS.callsTreeQuery);
            }
            return params;
        });
    }, 500);

    const onChangeSearch = useCallback(
        (searchQuery: string) => {
            setCallsTreeQuery(searchQuery);
            applyCallsTreeQuery();
        },
        [applyCallsTreeQuery]
    );

    return (
        <Input.Search
            className={classNames.search}
            value={callsTreeQuery}
            placeholder="Search"
            size="small"
            onChange={e => onChangeSearch(e.target.value)}
        />
    );
};

const CallTreeTableTools: FC = () => {
    const disableWidget = useDisableWidgetFunction();

    function handleClick({ key }: { key: string }) {
        switch (key) {
            case 'labelsManagement':
                console.log('Labels managemenet choosen');
                break;
            case 'remove':
                disableWidget('calls-tree');
                break;
        }
    }

    const menu = (
        <Menu
            onClick={handleClick}
            items={[
                { key: 'labelsManagement', icon: <BookOutlined style={{ fontSize: 16 }} />, label: 'Labels Managemenet' },
                { key: 'remove', icon: <DeleteOutlined style={{ fontSize: 16 }} />, label: 'Remove', className: 'amarant-label' },
            ]}
        />
    );

    return (
        <div className={classNames.toolControls}>
            <CallsTreeTableSearch />
            <ColumnsPopover />
            <Dropdown overlay={menu}>
                <Button type="default" size="middle" icon={<EllipsisOutlined style={{ fontSize: 20 }} />} />
            </Dropdown>
        </div>
    );
};

export default CallTreeTableTools;
