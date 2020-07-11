import React from 'react';
import {applyMiddleware, createStore} from 'redux'

const todos = (state = {}, action) => {
    return state
}

function logger({getState}) {
    return (next) => (action) => {
        console.log('will dispatch', action)

        // 调用 middleware 链中下一个 middleware 的 dispatch。
        let returnValue = next(action)

        console.log('state after dispatch', getState())

        // 一般会是 action 本身，除非
        // 后面的 middleware 修改了它。
        return returnValue
    }
}

let createStoreWithMiddleware = applyMiddleware(logger)(createStore)
let store = createStoreWithMiddleware(todos, ['Use Redux'])


function ApplyMiddleware() {
    function clickButton() {
        store.dispatch({
            type: 'ADD_TODO',
            text: 'Understand the middleware'
        })
    }

    return (
        <div>
            <h1>Hello world</h1>
            <button onClick={() => clickButton()}>Click</button>
        </div>
    );
}

export default ApplyMiddleware;
