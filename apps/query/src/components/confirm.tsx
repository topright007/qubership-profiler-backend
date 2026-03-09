import { Modal } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';

// Antd 4 renders modals in body; no mount point needed.
const ConfirmMountPoint = (): null => null;

function toAntdOptions(options: Record<string, unknown> & { okButtonProps?: { color?: string } }): ModalFuncProps {
    const { okButtonProps, ...rest } = options;
    return {
        ...rest,
        okButtonProps: okButtonProps?.color === 'red' ? { danger: true } : okButtonProps,
    } as ModalFuncProps;
}

export function confirm(options: ModalFuncProps & { header?: string }): void {
    Modal.confirm(toAntdOptions(options as Parameters<typeof toAntdOptions>[0]));
}

export function confirmDelete(options: ModalFuncProps & { header?: string }): void {
    Modal.confirm({
        ...toAntdOptions(options as Parameters<typeof toAntdOptions>[0]),
        okButtonProps: { danger: true },
    });
}

export function destroyConfirm(): void {
    Modal.destroyAll();
}

export function updateConfirm(options: ModalFuncProps & { header?: string }): void {
    Modal.confirm(toAntdOptions(options as Parameters<typeof toAntdOptions>[0]));
}

export async function asyncConfirm(
    options: ModalFuncProps & { header?: string; key?: string },
    asyncFn: () => void | Promise<void>
): Promise<void> {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            ...toAntdOptions(options as Parameters<typeof toAntdOptions>[0]),
            onOk: () =>
                Promise.resolve(asyncFn()).then(resolve).catch(reject),
            onCancel: () => resolve(undefined),
        });
    });
}

export default ConfirmMountPoint;
