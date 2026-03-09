import type { Key, ReactNode } from 'react';

export interface PropertiesItemModel<T = unknown> {
    label: ReactNode;
    value: Key;
    data?: T;
    hidden?: boolean;
}
