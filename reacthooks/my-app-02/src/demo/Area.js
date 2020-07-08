import React, {useContext} from "react"
import {ColorContext} from "./Color";

function Area() {
    const {color} = useContext(ColorContext)

    return (
        <div style={{color: color}}>
            Font color is {color}
        </div>
    )
}

export default Area