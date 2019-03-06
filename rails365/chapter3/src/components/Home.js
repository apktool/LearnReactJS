import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Home extends Component {
    render() {
        let content = "";

        if (content.length === 0) {
            content = "Hello Home";
        }
        console.log(this.props);

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-1 col-xs-offset-11">
                        <h1>{content}</h1>
                        <div> your name is {this.props.name}, your age is {this.props.age}</div>
                    </div>
                </div>
                <div className="SecondRow">
                    <h4>hobbies</h4>
                    <ul>
                        {this.props.user.habbies.map((hobby, i) => <li key={i}>{hobby}</li>)}
                    </ul>
                </div>
                <div>{this.props.children}</div>
            </div>
        );
    }
};

// Typechecking With PropTypes https://reactjs.org/docs/typechecking-with-proptypes.html
Home.propType = {
    name: PropTypes.string,
    age: PropTypes.number,
    user: PropTypes.object,
    children: PropTypes.element.isRequired
};