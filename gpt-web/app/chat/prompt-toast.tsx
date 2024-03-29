import {useChatStore} from "@/app/store/chat";
import styles from "@/app/chat/chat.module.scss"
import Locale from "@/app/locales"
import BrainIcon from "@/app/icons/brain.svg"

export function PromptToast(props: {
    showToast?: boolean;
    showModal?: boolean;
    setShowModal: (_: boolean) => void;
}) {
    const chatStore = useChatStore();
    const session = chatStore.currentSession();
    const context = session.mask.context;

    return (
        <div className={styles["prompt-toast"]} key="prompt-toast">
            {props.showToast && (
                <div
                    className={styles["prompt-toast-inner"] + " clickable"}
                    role="button"
                    onClick={() => props.setShowModal(true)}
                >
                    <BrainIcon/>
                    <span className={styles["prompt-toast-content"]}>
            {Locale.Context.Toast(context.length)}
          </span>
                </div>
            )}
            {/*
                props.showModal && (
                <SessionConfigModel onClose={() => props.setShowModal(false)} />
            )*/}
        </div>
    );
}

