import { type CallsTreeInfo } from '@app/store/cdt-openapi';
import { TreeTable } from '@app/components/tree-table/tree-table';
import type { TreeTableRow } from '@app/components/tree-table/types';
import { AppstoreOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { usePopupVisibleState } from '@app/utils/use-popup-visible-state';
import type { FC } from 'react';
import { useCallsTreeData } from '../../../calls-tree-context';
import classNames from '../../content-controls.module.scss';
import { columnsFactory, type TableData } from '../../params-table/columns';
import { createParamsData } from '../../utils/calls-tree-operations';

interface ParamsButtonModel {
    row: TreeTableRow<CallsTreeInfo>;
}

const ParamsButton: FC<ParamsButtonModel> = ({ row }) => {
    const [visible, close, open] = usePopupVisibleState();

    const { isFetching } = useCallsTreeData();

    return (
        <div className={classNames.toolControls}>
            <Button type="default" onClick={open} icon={<AppstoreOutlined style={{ fontSize: 16, color: '#0068FF' }} />} />
            <Modal
                visible={visible}
                title={row.original.info.title}
                width={800}
                footer={<Button onClick={close}>Close</Button>}
                onCancel={close}
                afterClose={close}
            >
                <TreeTable<TableData>
                    columns={columnsFactory()}
                    data={createParamsData(row.original) as TableData[]}
                    className="ux-table"
                    treeData
                    loading={isFetching}
                />
            </Modal>
        </div>
    );
};

export default ParamsButton;
