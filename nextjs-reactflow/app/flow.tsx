import {Edge, Node, NodeDragHandler, NodeMouseHandler, OnConnect, useStoreApi} from "reactflow";
import {generateNode} from "@/app/util";
import {useCallback} from "react";


export const useFlow = () => {
    const store = useStoreApi()
    store.getState().onError = (code, message) => {
        if (code === "002") {
            return;
        }

        console.warn(message)
    }

    const handleNodeAdd = useCallback(() => {
        const {getNodes, setNodes} = store.getState()
        const nodes = getNodes()
        const node = generateNode()
        setNodes([...nodes, node]);
    }, [store])

    const handleNodeDrag = useCallback<NodeDragHandler>((event, node: Node) => {
        const {getNodes, setNodes} = store.getState()
        const nodes = getNodes()
        nodes.forEach((n: Node) => {
            if (n.id === node.id) {
                n.position = node.position
            }
        })
        setNodes(nodes)
    }, [store])


    const handleNodeConnect = useCallback<OnConnect>(({source, target,}) => {
        if (source === target) {
            return
        }
        const {edges, setEdges,} = store.getState()
        const newEdge = {id: `${source}-${target}`, source: source, target: target} as Edge

        setEdges([...edges, newEdge])
    }, [store])

    const handleNodeClick = useCallback<NodeMouseHandler>((event, node: Node) => {
        const {getNodes, setNodes} = store.getState()
        const nodes = getNodes()
        nodes.forEach((n: Node) => {
            n.data.toolbarVisible = n.id === node.id
        })
        setNodes(nodes)
    }, [store])

    return {
        handleNodeAdd,
        handleNodeDrag,
        handleNodeClick,
        handleNodeConnect
    };
}