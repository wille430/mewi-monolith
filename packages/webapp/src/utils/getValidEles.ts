/**
 * Removes elements in arg 1 that does not exist in target
 *
 * @param arr - The array to remove elements in that don't exist inside target
 * @param target - The elements to include in the return array
 */
export const getValidEles = <T extends any[]>(arr: any[], target: T) =>
    arr.filter((v) => target.includes(v))
