import React from 'react'
import {Link, Route} from "react-router-dom"
import Work from "./workplace/Work";
import Study from "./workplace/Study";

function Workplace() {
    return (
        <div>
            <div className={"topNav"}>
                <ul>
                    <li><Link to={"/workplace/work"}>Work</Link></li>
                    <li><Link to={"/workplace/study"}>Study</Link></li>
                </ul>
            </div>

            <div className={"videoContent"}>
                <div>
                    <h3>工作空间</h3>
                </div>
                <Route path={"/workplace/work"} component={Work}></Route>
                <Route path={"/workplace/study"} component={Study}></Route>
            </div>

        </div>
    )
}

export default Workplace
