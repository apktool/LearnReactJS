import {memo} from "react";
import {Handle, Node, NodeToolbar, Position} from "reactflow";
import {useFlowContext} from "@/app/context";

const CustomNode = ({id, selected, data}: Node) => {
    const {isOpened, setIsOpened} = useFlowContext()

    return (
        <div>
            <NodeToolbar
                isVisible={data.toolbarVisible}
                position={data.toolbarPosition}
            >
                {
                    <button
                        style={{
                            border: `solid 2px blue`,
                            borderRadius: "50% 20% / 10% 40%",
                            height: "40px",
                            width: "100px",
                            cursor: "pointer",
                            position: "fixed",
                            top: "-25px"
                        }}
                        onClick={() => setIsOpened(!isOpened)}>
                        open sidebar
                    </button>
                }
            </NodeToolbar>
            <div style={{
                padding: "10px 20px",
                color: selected ? "yellowgreen" : "black",
            }}>{data.label}</div>
            <Handle type="target" position={Position.Left}/>
            <Handle type="source" position={Position.Right}/>
        </div>
    );
};

export default memo(CustomNode);