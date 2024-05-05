import {useStoreApi} from "reactflow";
import {generateNode} from "@/app/util";


export const useFlow = () => {
    const store = useStoreApi()

    const onNodeAdd = () => {
        const {getNodes, setNodes} = store.getState()
        const nodes = getNodes()
        const node = generateNode()
        setNodes([...nodes, node]);
    }

    return {
        onNodeAdd
    };
}