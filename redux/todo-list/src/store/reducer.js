import {ADDITEM, CHANGEINPUT, DELETEITEM} from "./ActionTypes";

const defaultState = {
    inputValue: "write something",
    list: [
        "go work",
        "play game",
        "sleep"
    ]
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
    }

    return state
}
