import React, {useState} from 'react';

function App() {
    const [name] = useState("apktool")
    const [age, setAge] = useState(18)
    const [work] = useState("IT")

    return (
        <div>
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
        </div>
    )
}

export default App;
