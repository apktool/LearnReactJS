import React from 'react';

// 有状态组件
/*
export default class Header extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-1 col-xs-offset-11">
                        <h1>Header</h1>
                    </div>
                </div>
            </div>
        );
    }
}
*/

// 无状态组件
/*
 * 1. 无须state，即不处理用户的输入，组件的所有数据都是依赖props传入的
 * 2. 不需要用到声明周期函数
 */
const Header = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-1 col-xs-offset-11">
                    <h1>Header</h1>
                </div>
            </div>
        </div>
    );
};

export default Header;