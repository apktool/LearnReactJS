'use client'

import React from 'react';
import ReactFlow, {Background, Controls, Edge, MiniMap, Node, Panel, ReactFlowProvider, Viewport} from 'reactflow';

import 'reactflow/dist/style.css';
import {FlowContextProvider, useFlowContext} from "@/app/context";
import CustomNode from "@/app/node";
import SidebarContent from "@/app/sidebar";
import {generateNode} from "@/app/util";
import {useFlow} from "@/app/flow";

const nodeTypes = {custom: CustomNode}

const initialNodes: Node[] = [generateNode()]
const initialEdges: Edge[] = [];

type FlowType = {
    nodes: Node[],
    edges: Edge[],
    viewport: Viewport,
}

export function FlowContainer({nodes, edges, viewport}: FlowType) {
    const {isOpened} = useFlowContext();

    const {handleNodeDrag, handleNodeConnect, handleNodeClick} = useFlow()

    return (
        <div style={{width: "100%", height: "100vh"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodeDrag={handleNodeDrag}
                onConnect={handleNodeConnect}
                onNodeClick={handleNodeClick}
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
                <FlowContainer nodes={initialNodes} edges={initialEdges} viewport={{x: 0, y: 0, zoom: 0}}/>
            </ReactFlowProvider>
        </FlowContextProvider>
    )
};