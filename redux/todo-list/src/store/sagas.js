import {GETMYLIST} from "./ActionTypes";
import {put, takeEvery} from "redux-saga/effects"
import {getListAction} from "./ActionCreator";
import axios from "axios";

function* mySaga() {
    yield takeEvery(GETMYLIST, getList)
}

function* getList() {
    const res = yield axios.get("http://localhost:3001/db")
    const action = getListAction(res.data);
    yield put(action)
}


export default mySaga