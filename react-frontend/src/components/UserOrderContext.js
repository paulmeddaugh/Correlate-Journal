import { createContext, useContext, useReducer } from "react";
import { comparePositions } from "../scripts/utility/customOrderingAsStrings";

const UserOrderContext = createContext(null);
const UserOrderDispatchContext = createContext(null);

export const UserOrderProvider = ({ children, value = [] }) => {
    const [userOrder, dispatch] = useReducer(
        userOrderReducer,
        value
    );

    return (
        <UserOrderContext.Provider value={userOrder}>
            <UserOrderDispatchContext.Provider value={dispatch}>
                {children}
            </UserOrderDispatchContext.Provider>
        </UserOrderContext.Provider>
    );
}

export function useUserOrder() {
    return useContext(UserOrderContext);
}

export function useUserOrderDispatch() {
    return useContext(UserOrderDispatchContext);
}

const userOrderReducer = (userOrder, action) => {
    switch (action.type) {
        case 'addNote': { // action params = { newOrderObj }
            return [ ...userOrder,
                { ...action.newOrderObj }
            ];
        }
        case 'addNoteAt': { // action params = { index, newOrderObj }
            return userOrder.reduce((prev, val, i, arr) => {
                if (i === action.index) arr.splice(i, 0, { ...action.newOrderObj });
                return arr;
            });
        }
        case 'sort': {
            return userOrder.sort((s1, s2) => comparePositions(s2.order, s1.order));
        }
        case 'changeNote': { // action params = { id, newOrderObj }
            return userOrder.map((orderObj) => {
                if (orderObj.id === action.id) {
                    return action.newOrderObj;
                } else {
                    return orderObj;
                }
            });
        }
        case 'deleteNote': { // action params = { id }
            return userOrder.filter(orderObj => orderObj.id !== action.id);
        }
        case 'deleteNoteAt': {
            return userOrder.filter((orderObj, i) => i !== action.index);
        }
        case 'reorderIndex': { // action params = { currIndex, newIndex, newObj }
            if (!action?.newObj) action.newObj = userOrder[action.currIndex];

            return userOrder.reduceRight((prev, val, i, arr) => {
                if (i === action.currIndex) arr.splice(i, 1);
                if (i === action.newIndex || (i === arr.length - 1 && action.newIndex > i)) {
                    arr.splice(action.newIndex, 0, action.newObj);
                }
                return arr;
          }, []);
        }
        case 'deleteNotebook': { // action params = { graph, id }
            let deleteOffset = 0;
            return userOrder.filter(orderObj => {
                while (action.graph.getVertex(orderObj.graphIndex + deleteOffset).id !== orderObj.id) {
                    deleteOffset++;
                }
                return action.graph.getVertex(orderObj.graphIndex + deleteOffset).idNotebook === action.id
            });
        }
        default: {
            throw Error("Unknown action: " + action.type); 
        }
    }
}