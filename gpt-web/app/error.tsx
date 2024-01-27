"use client"

import React, {Component, ErrorInfo} from "react";

interface IErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    info: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<any, IErrorBoundaryState> {
    constructor(props: any) {
        super(props);
        this.state = {hasError: false, error: null, info: null}
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        this.setState({hasError: true, error, info})
    }


    render() {
        if (this.state.hasError) {
            return (
                <div className="error">
                    <h2>Oops, something went wrong</h2>
                </div>
            )
        }

        return this.props.children;
    }
}
