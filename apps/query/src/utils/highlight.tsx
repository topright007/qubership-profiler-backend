import type { ReactNode } from 'react';
import React from 'react';

/**
 * Split text by regex and wrap matches in a span with the given class.
 * Returns React nodes (array or fragment) for rendering highlighted text.
 */
export function highlight(text: string, regex: RegExp | string, className = 'mark-text'): ReactNode {
    if (!text) return text;
    const re = typeof regex === 'string' ? new RegExp(regex, 'gi') : regex;
    const parts = String(text).split(re);
    if (parts.length === 1) return text;
    const matches = String(text).match(re) || [];
    const result: ReactNode[] = [];
    parts.forEach((part, i) => {
        if (part) result.push(part);
        if (matches[i]) result.push(React.createElement('span', { key: i, className }, matches[i]));
    });
    return React.createElement(React.Fragment, null, ...result);
}
