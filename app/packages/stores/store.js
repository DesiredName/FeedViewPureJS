const createStore = ({ state: _stt, mutations: _mts, actions: _acts }) => {
    const listeners = new Set();
    let isBatching = false;

    const notify = () => {
        if (isBatching === true) return;

        isBatching = true;

        queueMicrotask(() => {
            listeners.forEach((listener) => listener(state));
            isBatching = false;
        });
    };

    const state = new Proxy(_stt, {
        set(target, key, value) {
            target[key] = value;
            notify();
            return true;
        },
    });

    const mutations = {};
    if (_mts) {
        for (const [name, fn] of Object.entries(_mts)) {
            mutations[name] = (payload) => {
                fn(state, payload);
            };
        }
    }

    const actions = {};
    if (_acts) {
        for (const [name, fn] of Object.entries(_acts)) {
            actions[name] = (payload) => {
                return fn({ state, mutations, actions }, payload);
            };
        }
    }

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return { state, mutations, actions, subscribe };
};

export { createStore };
