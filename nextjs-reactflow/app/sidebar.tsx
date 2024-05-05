import {useFlowContext} from "@/app/context";
import {useFlow} from "@/app/flow";

function SidebarContent() {
    const {setIsOpened} = useFlowContext()
    const {onNodeAdd} = useFlow()

    return (
        <>
      <span
          style={{
              cursor: "pointer",
              background: "red",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              left: "10px",
              top: "10px"
          }}
          onClick={() => setIsOpened(false)}
      > × </span>
            <button
                style={{
                    border: "solid 1px green",
                    borderRadius: "29px",
                    height: "30px",
                    cursor: "pointer",
                }}
                onClick={() => onNodeAdd()}>
                Add new node
            </button>
        </>);
}

export default SidebarContent;