import { Card } from 'antd';
import type { ReactNode } from 'react';

export interface ContentCardProps {
    title?: ReactNode;
    titleClassName?: string;
    extra?: ReactNode;
    children?: ReactNode;
    className?: string;
}

export function ContentCard({ title, titleClassName, extra, children, className }: ContentCardProps) {
    return (
        <Card
            className={className}
            title={title ? <span className={titleClassName}>{title}</span> : undefined}
            extra={extra}
        >
            {children}
        </Card>
    );
}
