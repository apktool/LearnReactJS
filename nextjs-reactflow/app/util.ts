import {Node} from "reactflow"

const defaultNodeStyle = {
    border: "2px solid #ff0071",
    background: "white",
    borderRadius: 20
};

export function generateNode() {
    const id = Math.random().toString(36).substring(7);

    const node: Node = {
        id: id,
        type: "custom",
        data: {
            label: `toolbar always open, id=${id}`,
            toolbarPosition: "top",
            toolbarVisible: false
        },
        position: {
            x: Math.round(512 + Math.random() * (300 - 100)),
            y: Math.floor(512 + Math.random() * (100 - 300) + 100)
        },
        style: defaultNodeStyle
    };

    return node
}