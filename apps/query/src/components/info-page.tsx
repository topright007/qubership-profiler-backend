import { Empty } from 'antd';
import type { ReactNode } from 'react';

export interface InfoPageProps {
    title?: ReactNode;
    message?: ReactNode;
    icon?: ReactNode;
    className?: string;
    additionalContent?: ReactNode;
}

export function InfoPage({ title, message, icon, className, additionalContent }: InfoPageProps) {
    const description = [title, message].filter(Boolean);
    return (
        <Empty
            className={className}
            image={icon ?? Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                description.length ? (
                    <>
                        {description.map((d, i) => (
                            <div key={i}>{d}</div>
                        ))}
                        {additionalContent}
                    </>
                ) : undefined
            }
        />
    );
}
