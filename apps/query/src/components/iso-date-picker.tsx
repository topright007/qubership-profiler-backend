import { DatePicker } from 'antd';
import moment, { type Moment } from 'moment';
import type { ReactNode } from 'react';

export interface IsoDatePickerProps {
    label?: ReactNode;
    time?: boolean;
    value?: string;
    onChange?: (value?: string) => void;
    format?: (v: Moment) => string;
    disabledDate?: (d: Moment) => boolean;
}

export function IsoDatePicker({
    label,
    time = false,
    value,
    onChange,
    format,
    disabledDate,
}: IsoDatePickerProps) {
    const momentValue = value ? moment(value) : undefined;
    return (
        <div className="ux-date-picker-suffix" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {label && <label>{label}</label>}
            <DatePicker
                showTime={time}
                value={momentValue}
                onChange={(mom: Moment | null) => onChange?.(mom?.toISOString())}
                format={format ? (mom: Moment) => format(mom) : undefined}
                disabledDate={disabledDate}
                allowClear={false}
            />
        </div>
    );
}
