import React, {createContext, useContext, useEffect, useReducer, useState} from 'react';

const CountContext = createContext()

function Counter() {
    let count = useContext(CountContext)
    return (<h2>{count}</h2>)
}


function App() {
    const [name] = useState("apktool")
    const [age, setAge] = useState(18)
    const [work] = useState("IT")

    const [score, dispatch] = useReducer((state, action) => {
        switch (action) {
            case "add":
                return state + 1
            case "sub":
                return state - 1
            default:
                return state
        }
    }, 0)

    useEffect(() => {
            console.log(`useEffect => ${age} `)
            return () => {
                console.log("----------------")
            }
        },
        [age]
    )

    return (
        <div>
            <CountContext.Provider value={age}>
                <Counter/>
            </CountContext.Provider>

            <div>name: {name}</div>
            <div>work: {work}</div>
            <div>age: {age}
                <button onClick={
                    () => {
                        setAge(age + 1)
                    }}>
                    Add Age
                </button>
            </div>
            <div>
                <h2>score is {score}</h2>
                <button onClick={() => {dispatch("add")}}> ADD </button>
                <button onClick={() => {dispatch("sub")}}> SUB </button>
            </div>
        </div>
    )
}

export default App;
