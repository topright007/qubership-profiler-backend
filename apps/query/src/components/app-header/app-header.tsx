import { Layout } from 'antd';
import { type FC, memo } from 'react';

const { Header } = Layout;

export interface AppHeaderProps {
    version?: string;
}

const appTitle = 'Cloud Diagnostic Toolset';

const AppHeader: FC<AppHeaderProps> = ({ version }) => {
    return (
        <Header style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#001529', color: '#fff' }}>
            <span style={{ fontWeight: 600, fontSize: 18 }}>
                {version ? `${appTitle} v.${version}` : appTitle}
            </span>
        </Header>
    );
};

export default memo(AppHeader);
