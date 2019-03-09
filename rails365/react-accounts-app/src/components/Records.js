import React, {Component} from 'react';
import Record from "./Record";
import axios from 'axios';

class Records extends Component {
    dataUrl = "http://localhost:3001/data";

    constructor() {
        super();
        this.state = {
            error: null,
            isLoaded: false,
            records: []
        }
    }

    componentDidMount() {
        axios.get(this.dataUrl).then(
            response => this.setState({
                records: response.data,
                isLoaded: true
            })
        ).catch(
            error => this.setState({
                isLoaded: true,
                error
            })
        )
    }

    render() {
        const {error, isLoaded, records} = this.state;

        if (error) {
            return (<div>
                ERROR: {error.message}
            </div>)
        } else if (!isLoaded) {
            return (<div>
                Loading...
            </div>)
        } else {
            return (
                <div>
                    <h1>Record</h1>
                    <table className={"table table-bordered"}>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map((record, i) => <Record key={record.id} {...record}/>)}
                        </tbody>
                    </table>
                </div>
            );
        }
    }
}

export default Records;
