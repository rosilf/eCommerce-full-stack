import { AnyAction } from "redux";
import { USER_LOGIN, USER_LOGOUT } from "./types";

const itemInitialState = {
    username: null,
};

export const userReducer = (state = itemInitialState, action: AnyAction) => {
    switch (action.type) {
        case USER_LOGIN:
            return {
                ...state,
                username: action.payload,
            };
        case USER_LOGOUT:
            return {
                ...state,
                username: null,
            };
        default:
            return state;
    }
};
