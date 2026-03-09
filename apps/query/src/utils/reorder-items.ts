/**
 * Reorder array: move item from fromIndex to targetIndex.
 */
export function reorderItems<T>(items: T[], fromIndex: number, targetIndex: number): T[] {
    const result = [...items];
    const [removed] = result.splice(fromIndex, 1);
    if (removed === undefined) return items;
    result.splice(targetIndex, 0, removed);
    return result;
}
