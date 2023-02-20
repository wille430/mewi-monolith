
export const logTimeTaken = async <T>(f: () => T): T => {
    const start = Date.now();
    const res = await f();
    const duration = Date.now() - start;
    console.log(`${f.name} took ${duration}ms to execute`);
    return res;
};