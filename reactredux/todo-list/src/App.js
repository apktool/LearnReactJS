import React from 'react';
import {connect} from 'react-redux'

const App = (props) => {
    let {inputValue, changeInputValue, clickButton, list} = props

    return (
        <div className="App">
            <div>
                <input defaultValue={inputValue}
                       onChange={changeInputValue}
                />
                <button onClick={clickButton}>ADD</button>
            </div>
            <ul>
                {
                    list.map((item, index) => {
                        return (
                            <li key={index}>{item}</li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

const stateToProps = (state) => {
    return {
        inputValue: state.inputValue,
        list: state.list
    }
}

const dispatchToProps = (dispatch) => {
    return {
        changeInputValue(msg) {
            let action = {
                type: 'CHANGEINPUT',
                value: msg.target.value
            }

            dispatch(action)
        },

        clickButton() {
            let action = {
                type: 'ADDITEM'
            }

            dispatch(action)
        }
    }
}

export default connect(stateToProps, dispatchToProps)(App);
