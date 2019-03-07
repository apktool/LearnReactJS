import React, {Component} from 'react';

import Header from './components/Header';
import Home from './components/Home';

class App extends Component {
    constructor() {
        super();
        this.state = {
            homeLink: "home"
        }
    }

    onGreet(age) {
        alert(age);
    }

    onChangeLinkName(newName) {
        this.setState({
            homeLink: newName
        })
    }

    render() {
        const user = {
            name: "apktool",
            habbies: ["Sprots", "Reading"]
        };

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-1 col-xs-offset-11">
                        <Header homeLink={this.state.homeLink}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-1 col-xs-offset-11">
                        <h1>Hello word</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-1 col-xs-offset-11">
                        <Home name={"Max"} age={12} user={user} greet={this.onGreet}
                              changeLink={this.onChangeLinkName.bind(this)}
                              initialName={this.state.homeLink}/>
                        <span>I am child</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
