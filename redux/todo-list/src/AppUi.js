import React from 'react';
import {Input} from "antd";
import 'antd/dist/antd.css'
import Button from "antd/es/button";
import List from "antd/es/list";

const AppUi = (props) => {
    return (
        <div>
            <div style={{margin: '10px'}}>
                <Input
                    placeholder={props.inputValue}
                    style={{width: '250px', marginRight: '10px'}}
                    onChange={props.changeInputValue}
                    value={props.inputValue}
                />
                <Button type="primary" onClick={props.addItem}>ADD</Button>
            </div>
            <div style={{margin: '10px', width: '300px'}}>
                <List
                    bordered
                    dataSource={props.list}
                    renderItem={
                        (item, index) => <List.Item onClick={() => props.deleteItem(index)}>{item} </List.Item>
                    }
                />
            </div>
        </div>
    )
}

export default AppUi;
