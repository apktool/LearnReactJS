import React, {Component} from 'react';

import Header from './components/Header';
import Home from './components/Home';

class App extends Component {
    onGreet(age) {
        alert(age);
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
                        <Header/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-1 col-xs-offset-11">
                        <h1>Hello word</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-1 col-xs-offset-11">
                        <Home name={"Max"} age={12} user={user} greet={this.onGreet}/>
                        <span>I am child</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
