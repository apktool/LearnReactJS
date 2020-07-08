import React from 'react';
import Area from "./demo/Area";
import Buttons from "./demo/Buttons";
import {Color} from "./demo/Color";

function App() {
    return (
        <div>
            <Color>
                <Area/>
                <Buttons/>
            </Color>
        </div>
    );
}

export default App;
