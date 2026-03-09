import { Card } from 'antd';
import type { ReactNode } from 'react';

export interface SummaryCardProps {
    title?: ReactNode;
    className?: string;
    content?: ReactNode;
    footer?: ReactNode;
}

export function SummaryCard({ title, className, content, footer }: SummaryCardProps) {
    return (
        <Card className={className} title={title || null}>
            {content && <div>{content}</div>}
            {footer && <div style={{ marginTop: 16 }}>{footer}</div>}
        </Card>
    );
}

