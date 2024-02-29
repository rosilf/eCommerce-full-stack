import { AnyAction } from "redux";
import { GOTO_CHECKOUT } from "./types";

const itemInitialState = {
    items: null,
};

export const orderReducer = (state = itemInitialState, action: AnyAction) => {
    switch (action.type) {
        case GOTO_CHECKOUT:
            return {
                ...state,
                items: action.payload,
            };
        default:
            return state;
    }
};
