import { AnyAction } from "redux";
import { SELECT_ITEM } from "./types";

const itemInitialState = {
    selectedItem: null,
};

export const itemsReducer = (state = itemInitialState, action: AnyAction) => {
    switch (action.type) {
        case SELECT_ITEM:
            return {
                ...state,
                selectedItem: action.payload,
            };
        default:
            return state;
    }
};
