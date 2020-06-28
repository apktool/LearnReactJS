import React, {Component} from 'react';
import store from './store'
import {addItemAction, changeInputAction, deleteItemAction, getListBySaga} from "./store/ActionCreator";
import AppUi from "./AppUi";

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = store.getState()
    }

    componentDidMount() {
        store.subscribe(() => this.setState(store.getState()))

        const action = getListBySaga();
        store.dispatch(action)
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
