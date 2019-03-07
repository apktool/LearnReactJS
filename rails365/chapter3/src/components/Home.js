import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            age: props.age,
            status: 0,
            homeLink: props.initialName
        };
        this.age = this.props.age;
    }

    onMakeOlder() {
        this.setState(
            {age: this.state.age + 3}
        );
        setTimeout(
            () => {
                this.setState({
                    status: this.state.status + 1
                })
            },
            1000
        )
    }

    handleGreet() {
        this.props.greet(this.state.age);
    }

    onChangeLink() {
        this.props.changeLink(this.state.homeLink);
    }

    onHandleChange(event) {
        this.setState({
            homeLink: event.target.value
        })
    }

    render() {
        let content = "";

        if (content.length === 0) {
            content = "Hello Home";
            console.info(this);
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-1 col-xs-offset-11">
                        <h1>{content}</h1>
                        <div> your name is {this.props.name}, your age is {this.state.age}</div>
                        <div>Status: {this.state.status}</div>
                        {/*<button onClick={this.onMakeOlder.bind(this)} className="btn btn-primary">Make me older</button>*/}
                        <button onClick={() => this.onMakeOlder()} className="btn btn-primary">Make me older</button>
                        <br/>
                        <button onClick={this.handleGreet.bind(this)} className="btn btn-primary">Greet</button>
                        <br/>
                        <input type="text"
                               defaultValue={this.props.initialName}
                               value={this.state.initialName}
                               onChange={(event) => this.onHandleChange(event)}/>
                        <button onClick={this.onChangeLink.bind(this)} className="btn btn-primary">Change Header</button>
                        <br/>
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
    children: PropTypes.element.isRequired,
    greet: PropTypes.func
};