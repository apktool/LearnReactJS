'use client'

import React, {useCallback} from 'react';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Connection,
    Controls,
    Edge,
    EdgeChange,
    MiniMap,
    Node,
    NodeChange,
    Panel,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useStoreApi
} from 'reactflow';

import 'reactflow/dist/style.css';
import {FlowContextProvider, useFlowContext} from "@/app/context";
import CustomNode from "@/app/node";
import SidebarContent from "@/app/sidebar";
import {generateNode} from "@/app/util";

const nodeTypes = {custom: CustomNode}

const initialNodes: Node[] = [generateNode()]
const initialEdges: Edge[] = [];

export function FlowContainer() {

    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);
    const store = useStoreApi()
    const {getNodes} = store.getState()

    const {isOpened} = useFlowContext();

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            const tmp = getNodes()
            setNodes((nds) => applyNodeChanges(changes, tmp));
        },
        [store]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    return (
        <div style={{width: "100%", height: "100vh"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                minZoom={1}
                maxZoom={1.5}
                attributionPosition="bottom-left"
                nodeTypes={nodeTypes}
            >
                {
                    isOpened && <Panel
                        position={"top-left"}
                        style={{
                            position: "fixed",
                            right: "-320px",
                            top: "0",
                            width: "300px",
                            height: "80%",
                            background: "#ccc",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <SidebarContent/>
                    </Panel>
                }
                <Controls
                    position={"bottom-left"}
                    style={{
                        border: "solid 2px #ccc",
                        borderRadius: "20px",
                        display: 'flex',
                        flexDirection: 'row',
                    }}/>
                <MiniMap style={{
                    backgroundColor: "grey"
                }}/>
                <Background gap={12} size={1}/>
            </ReactFlow>
        </div>
    );
}

export default function Home() {
    return (
        <FlowContextProvider>
            <ReactFlowProvider>
                <FlowContainer/>
            </ReactFlowProvider>
        </FlowContextProvider>
    )
};