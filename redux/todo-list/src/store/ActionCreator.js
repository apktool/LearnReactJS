import {ADDITEM, CHANGEINPUT, DELETEITEM} from "./ActionTypes";

export const changeInputAction = (value) => ({
    type: CHANGEINPUT,
    value
})

export const addItemAction = () => ({
    type: ADDITEM
})

export const deleteItemAction = (index) => ({
    type: DELETEITEM,
    index
})