import React from 'react';
import {BrowserRouter, Link, Route} from "react-router-dom";
import List from "./pages/List";
import Index from "./pages/Index";
import Home from "./pages/Home";

function App() {


    return (
        <BrowserRouter>
            <ul>
                <li><Link to="/">首页</Link></li>
                <li><Link to="/list/123">列表</Link></li>
            </ul>

            <Route path={"/"} exact component={Index}/>
            <Route path={"/home"} component={Home}/>
            <Route path={"/list/:id"} component={List}/>
        </BrowserRouter>
    )
}

export default App
