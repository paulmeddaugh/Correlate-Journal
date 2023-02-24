import { createContext, useContext, useReducer } from "react";
import { comparePositions } from "../scripts/utility/customOrderingAsStrings";

const UserOrderContext = createContext(null);
const SetUserOrderContext = createContext(null);

export const UserOrderProvider = ({ children, userOrder, setUserOrder }) => {

    return (
        <UserOrderContext.Provider value={userOrder}>
            <SetUserOrderContext.Provider value={setUserOrder}>
                {children}
            </SetUserOrderContext.Provider>
        </UserOrderContext.Provider>
    );
}

export function useUserOrder() {
    return useContext(UserOrderContext);
}

export function useSetUserOrder() {
    return useContext(SetUserOrderContext);
}