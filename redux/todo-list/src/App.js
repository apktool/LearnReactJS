import React, {Component} from 'react';
import {Input} from "antd";
import store from './store'
import 'antd/dist/antd.css'
import Button from "antd/es/button";
import List from "antd/es/list";
import {addItemAction, changeInputAction, deleteItemAction} from "./store/ActionCreator";

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = store.getState()

        store.subscribe(() => this.setState(store.getState()))
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
            <div>
                <div style={{margin: '10px'}}>
                    <Input
                        placeholder={this.state.inputValue}
                        style={{width: '250px', marginRight: '10px'}}
                        onChange={(msg) => this.changeInputValue(msg)}
                        value={this.state.inputValue}
                    />
                    <Button type="primary" onClick={() => this.addItem()}>ADD</Button>
                </div>
                <div style={{margin: '10px', width: '300px'}}>
                    <List
                        bordered
                        dataSource={this.state.list}
                        renderItem={(item, index) => <List.Item
                            onClick={this.deleteItem.bind(this, index)}
                        >{item}
                        </List.Item>}
                    />
                </div>
            </div>
        )
    }
}

export default App;
