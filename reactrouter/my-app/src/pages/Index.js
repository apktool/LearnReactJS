import React, {Component} from 'react'
import {Link} from "react-router-dom";


class Index extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            list: [
                {"id": 1, title: "blog-01"},
                {"id": 2, title: "blog-02"},
                {"id": 3, title: "blog-03"}
            ]
        }

        this.props.history.push("/home/")
    }

    render() {
        return (
            <div>
                <h1>Index</h1>

                <ul>
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Link to={"/list/" + item.id}>
                                        {item.title}
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default Index