import { FileTextOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import { usePopupVisibleState } from '@app/utils/use-popup-visible-state';
import type { FC } from 'react';
import classNames from '../../content-controls.module.scss';

interface TraceButtonModel {
    text: string;
}

const TraceButton: FC<TraceButtonModel> = ({ text }) => {
    const [visible, close, open] = usePopupVisibleState();

    return (
        <div className={classNames.toolControls}>
            <Button type="default" onClick={open} icon={<FileTextOutlined style={{ fontSize: 16, color: '#0068FF' }} />} />
            <Modal
                visible={visible}
                title="StackTrace"
                width={800}
                footer={<Button onClick={close}>Close</Button>}
                onOk={close}
                onCancel={close}
                afterClose={close}
            >
                <Input.TextArea placeholder="Placeholder" readOnly autoSize value={text} />
            </Modal>
        </div>
    );
};

export default TraceButton;
