import React from 'react';
import {BrowserRouter, Route, Link} from "react-router-dom";
import List from "./pages/List";
import Index from "./pages/Index";

function App() {
    return (
        <BrowserRouter>
            <ul>
                <li><Link to="/">首页</Link></li>
                <li><Link to="/list/">列表</Link></li>
            </ul>

            <Route path={"/"} exact component={Index}/>
            <Route path={"/list"} component={List}/>
        </BrowserRouter>
    )
}

export default App
