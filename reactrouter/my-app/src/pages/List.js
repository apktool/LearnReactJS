import React, {Component} from 'react'


class List extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    componentDidMount() {
        let id = this.props.match.params.id
        this.setState({id: id})
    }

    render() {
        return (
            <h1>List-{this.state.id}</h1>
        )
    }
}

export default List
