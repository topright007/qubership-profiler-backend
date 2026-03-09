import { Spin } from 'antd';
import cn from 'clsx';
import { type CSSProperties, type FC, memo } from 'react';
import styles from './loading.page.module.scss';

interface LoadingPageProps {
    text?: string;

    className?: string;

    style?: CSSProperties;
}

const LoadingPage: FC<LoadingPageProps> = ({ text, className, style }) => {
    return (
        <div className={cn(styles.container, className)} style={style}>
            <Spin size="large" tip={text} />
        </div>
    );
};

export default memo(LoadingPage);
