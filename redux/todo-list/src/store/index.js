import {applyMiddleware, compose, createStore} from "redux";
import creatSagaMiddleware from "redux-saga"
import reducer from "./reducer";
import mySaga from "./sagas";

const sagaMiddleware = creatSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))

const store = createStore(reducer, enhancer)
sagaMiddleware.run(mySaga)

export default store