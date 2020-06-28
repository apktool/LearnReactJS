import {ADDITEM, CHANGEINPUT, DELETEITEM, GETLIST} from "./ActionTypes";
import axios from "axios";

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

export const getListByThunk = () => {
    return (dispatch) => {
        axios.get("http://localhost:3001/db").then((res) => {
            const data = res.data
            const action = getListAction(data)
            dispatch(action)
        })
    }
}
