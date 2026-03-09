import type { ServiceDumpInfo } from '@app/store/cdt-openapi';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { memo } from 'react';

const DumpsDownloadOpts = memo<{ opts?: ServiceDumpInfo['downloadOptions'] }>(({ opts }) => {
    if (!opts) return null;
    if (opts.length === 0) return 0;
    const menu = (
        <Menu>
            {opts?.map(it => (
                <Menu.Item key={it.typeName}>
                    <a href={it.uri} target="_blank" rel="noreferrer">
                        {it.typeName}
                    </a>
                </Menu.Item>
            ))}
        </Menu>
    );
    return (
        <Dropdown overlay={menu}>
            <Button type="default" size="small" icon={<DownloadOutlined style={{ fontSize: 16 }} />} />
        </Dropdown>
    );
});

DumpsDownloadOpts.displayName = 'DumpsDownloadOpts';

export default DumpsDownloadOpts;
