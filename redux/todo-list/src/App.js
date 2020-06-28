import React, {Component} from 'react';
import store from './store'
import {addItemAction, changeInputAction, deleteItemAction, getListAction} from "./store/ActionCreator";
import AppUi from "./AppUi";
import axios from "axios";

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = store.getState()

        store.subscribe(() => this.setState(store.getState()))
    }

    componentDidMount() {
        axios.get("http://localhost:3001/db").then((res) => {
            const data = res.data
            const action = getListAction(data)
            store.dispatch(action)
        })
    }

    changeInputValue(msg) {
        const action = changeInputAction(msg.target.value)
        store.dispatch(action)
    }

    addItem() {
        const action = addItemAction()
        store.dispatch(action)
    }

    deleteItem(index) {
        const action = deleteItemAction(index)
        store.dispatch(action)
    }

    render() {
        return (
            <AppUi
                inputValue={this.state.inputValue}
                list={this.state.list}
                changeInputValue={this.changeInputValue}
                addItem={this.addItem}
                deleteItem={this.deleteItem}
            />
        )
    }
}

export default App;
