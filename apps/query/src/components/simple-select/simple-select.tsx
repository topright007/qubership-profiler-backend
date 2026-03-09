import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { type Key, memo, useMemo } from 'react';

export type SimpleSelectValueChange = string | number | boolean | Key[];

export interface SelectOption {
    value: string | number | boolean;
    label?: React.ReactNode;
}

export interface SimpleSelectProps extends Omit<SelectProps, 'value' | 'onChange' | 'options'> {
    value?: string | Key[];
    onChange?: (v?: SimpleSelectValueChange) => void;
    options?: SelectOption[];
}

const SimpleSelect = memo(({ value, onChange, options = [], ...selectProps }: SimpleSelectProps) => {
    const effectiveOptions = useMemo(() => {
        if (value === undefined || value === null || Array.isArray(value)) return options;
        const hasValue = options.some(it => it.value === value);
        if (!hasValue && value !== '') {
            return [...options, { value: value as string | number, label: String(value) }];
        }
        return options;
    }, [options, value]);

    const isMultiple = Array.isArray(value);
    return (
        <Select
            mode={isMultiple ? 'multiple' : undefined}
            value={value}
            onChange={v => onChange?.(v as SimpleSelectValueChange)}
            options={effectiveOptions as SelectProps['options']}
            {...selectProps}
        />
    );
});

SimpleSelect.displayName = 'SimpleSelect';

export default SimpleSelect;
