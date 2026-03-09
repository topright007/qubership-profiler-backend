import type { ReactNode } from 'react';

export interface ContextItemModel {
    id: string;
    name: ReactNode;
    icon?: ReactNode;
}

export interface ContextBarProps {
    left?: ReactNode;
    items: ContextItemModel[];
    right?: ReactNode;
}

export function ContextBar({ left, items, right }: ContextBarProps) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '8px 16px',
                borderBottom: '1px solid #f0f0f0',
            }}
        >
            {left}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {item.icon}
                        {item.name}
                    </div>
                ))}
            </div>
            {right}
        </div>
    );
}
