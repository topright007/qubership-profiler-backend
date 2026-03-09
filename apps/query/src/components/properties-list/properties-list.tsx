import { Button, Checkbox } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { PropertiesItemModel } from './properties-list-types';

export interface PropertiesListProps<T = unknown> {
    items: PropertiesItemModel<T>[];
    onToggle: (item: PropertiesItemModel<T>) => void;
    onReorder?: (fromIndex: number, targetIndex: number) => void;
}

export function PropertiesList<T = unknown>({ items, onToggle, onReorder }: PropertiesListProps<T>) {
    return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((item, index) => (
                <li
                    key={String(item.value)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}
                >
                    <Checkbox checked={!item.hidden} onChange={() => onToggle(item)} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {onReorder && (
                        <span>
                            <Button
                                type="text"
                                size="small"
                                icon={<ArrowUpOutlined />}
                                disabled={index === 0}
                                onClick={() => onReorder(index, index - 1)}
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<ArrowDownOutlined />}
                                disabled={index === items.length - 1}
                                onClick={() => onReorder(index, index + 1)}
                            />
                        </span>
                    )}
                </li>
            ))}
        </ul>
    );
}
