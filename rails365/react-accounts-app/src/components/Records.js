import React, {Component} from 'react';
import Record from "./Record";
import PropTypes from 'prop-types';
import * as RecordsAPI from '../utils/RecordsAPI'

export default class Records extends Component {
    constructor() {
        super();
        this.state = {
            error: null,
            isLoaded: false,
            records: []
        }
    }

    componentDidMount() {
        RecordsAPI.getAll().then(
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

Records.prototypes = {
    id: PropTypes.number,
    date: PropTypes.string,
    titile: PropTypes.string,
    amount: PropTypes.number
};
