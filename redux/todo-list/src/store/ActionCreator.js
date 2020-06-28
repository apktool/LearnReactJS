import {ADDITEM, CHANGEINPUT, DELETEITEM, GETLIST} from "./ActionTypes";

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

export const getListAction = (data) => ({
    type: GETLIST,
    data
})
