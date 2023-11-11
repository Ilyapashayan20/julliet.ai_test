export async function withRetriesAndSlotTimeout<T>(
    fn: () => Promise<T>,
    retries: number,
    slotTimeout: number
): Promise<T> {
    return fn().catch((err) => {
        if (retries > 0) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(withRetriesAndSlotTimeout(fn, retries - 1, slotTimeout));
                }, slotTimeout);
            });
        } else {
            throw err;
        }
    });
}

export async function withExponentialBackoff<T>(
    fn: () => Promise<T>,
    retries: number,
    slotTimeout: number
): Promise<T> {
    return fn().catch((err) => {
        if (retries > 0) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(withExponentialBackoff(fn, retries - 1, slotTimeout * 2));
                }, slotTimeout);
            });
        } else {
            throw err;
        }
    });
}
