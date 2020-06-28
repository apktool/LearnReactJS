import {ADDITEM, CHANGEINPUT, DELETEITEM, GETLIST} from "./ActionTypes";

const defaultState = {
    inputValue: "write something",
    list: []
}

export default (state = defaultState, action) => {
    if (action.type === CHANGEINPUT) {
        let newState = JSON.parse(JSON.stringify(state))
        newState.inputValue = action.value
        return newState
    } else if (action.type === ADDITEM) {
        let newState = JSON.parse(JSON.stringify(state))
        newState.list.push(newState.inputValue)
        newState.inputValue = ""
        return newState
    } else if (action.type === DELETEITEM) {
        let newState = JSON.parse(JSON.stringify(state))
        newState.list.splice(action.index, 1)
        return newState
    } else if (action.type === GETLIST) {
        let newState = JSON.parse(JSON.stringify(state))
        newState.list = action.data.data.list
        return newState
    }

    return state
}
