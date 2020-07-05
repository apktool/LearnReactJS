import React from 'react';
import {BrowserRouter, Link, Route} from "react-router-dom";
import Index from "./pages/Index";
import Video from "./pages/Video";
import './index.css'
import Workplace from "./pages/Workplace";

function App() {
    let routeConfig = [
        {path: '/', title: '博客首页', exact: true, comp: Index},
        {path: '/video', title: '视频教程', exact: false, comp: Video},
        {path: '/workplace', title: '职场技能', exact: false, comp: Workplace}
    ]

    return (
        <BrowserRouter>
            <div className={"mainDiv"}>
                <div className={"leftNav"}>
                    <h3>一级导航</h3>
                    <ul>
                        {
                            routeConfig.map((item, index) => {
                                return (
                                    <li key={index}><Link to={item.path}>{item.title}</Link></li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className={"rightMain"}>
                    {
                        routeConfig.map((item, index) => {
                            return (
                                <Route key={index} path={item.path} exact={item.exact} component={item.comp}></Route>
                            )
                        })
                    }
                </div>
            </div>

        </BrowserRouter>
    )
}

export default App;
