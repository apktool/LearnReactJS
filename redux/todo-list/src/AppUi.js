import React, {Component} from 'react';
import {Input} from "antd";
import 'antd/dist/antd.css'
import Button from "antd/es/button";
import List from "antd/es/list";

class AppUi extends Component {

    render() {
        return (
            <div>
                <div style={{margin: '10px'}}>
                    <Input
                        placeholder={this.props.inputValue}
                        style={{width: '250px', marginRight: '10px'}}
                        onChange={this.props.changeInputValue}
                        value={this.props.inputValue}
                    />
                    <Button type="primary" onClick={this.props.addItem}>ADD</Button>
                </div>
                <div style={{margin: '10px', width: '300px'}}>
                    <List
                        bordered
                        dataSource={this.props.list}
                        renderItem={
                            (item, index) => <List.Item onClick={() => this.props.deleteItem(index)}>{item} </List.Item>
                        }
                    />
                </div>
            </div>
        )
    }
}

export default AppUi;
