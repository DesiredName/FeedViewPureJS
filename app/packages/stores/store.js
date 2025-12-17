const createStore = (initialState) => {
    const listeners = new Set();

    const store = new Proxy(initialState, {
        set(target, key, value) {
            target[key] = value;
            listeners.forEach((listener) => listener(target));
            return true;
        },
    });

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return { state: store, subscribe };
};

export { createStore };
