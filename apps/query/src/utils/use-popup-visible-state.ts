import { useState } from 'react';

export function usePopupVisibleState(): [boolean, () => void, () => void] {
    const [visible, setVisible] = useState(false);
    return [visible, () => setVisible(false), () => setVisible(true)];
}
