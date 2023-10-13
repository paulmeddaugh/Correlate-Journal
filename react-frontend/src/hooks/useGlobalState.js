import {
    FC,
    ReactNode,
    createContext,
    useContext,
    useState,
    useReducer
} from "react";

const _Map = () => new Map();
const Context = createContext(_Map());

export const Provider = ({ children }) =>
    <Context.Provider value={_Map()}>{children}</Context.Provider>;

const useContextProvider = (key) => {
    const context = useContext(Context);
    return {
        set value(v) { context.set(key, v); },
        get value() {
            if (!context.has(key)) {
                throw Error(`Context key '${key}' Not Found!`);
            }
            return context.get(key);
        }
    }
};

export const useProvider = (key, initialValue) => {
    const provider = useContextProvider(key);
    if (initialValue !== undefined) {
        const Context = createContext(initialValue);
        provider.value = Context;
    }
    return useContext(provider.value);
};

export const useSharedState = (key, initialValue) => {
    let state = undefined;
    if (initialValue !== undefined) {
        const _useState = useState;
        state = _useState(initialValue);
    }
    return useProvider(key, state);
};

export const useSharedReducer = (key, reducer, initialValue) => {
    let state = undefined;
    if (initialValue !== undefined) {
        const _useReducer = useReducer;
        state = _useReducer(reducer, initialValue);
    }
    return useProvider(key, state);
};
