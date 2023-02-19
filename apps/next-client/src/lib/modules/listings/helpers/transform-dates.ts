export const transformDate = (obj: Record<any, any>) =>
    Object.entries(obj).reduce((obj, [key, value]) => {
        if (value instanceof Date) {
            obj[key] = value.toISOString();
        } else {
            obj[key] = value;
        }
        return obj;
    }, {} as typeof obj);
