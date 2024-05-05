import {createContext, ReactNode, useContext, useState} from "react";

type FlowType = {
    isOpened: boolean,
    setIsOpened: (isOpen: boolean) => void
}

const defaultFlow: FlowType = {
    isOpened: false,
    setIsOpened: () => {
    }
}

const FlowContext = createContext<FlowType>(defaultFlow)

export function FlowContextProvider({children}: { children: ReactNode }) {
    const [ok, setOk] = useState(false)

    return (
        <FlowContext.Provider value={{
            isOpened: ok,
            setIsOpened: setOk
        }}>
            {children}
        </FlowContext.Provider>
    );
}

export const useFlowContext = () => {
    return useContext(FlowContext)
}