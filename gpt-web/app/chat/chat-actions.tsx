import {ModelType, Theme, useAppConfig} from "@/app/store/config";
import {useChatStore} from "@/app/store/chat";
import {ChatAction} from "@/app/chat/chat-action"
import {useEffect, useMemo, useState} from "react";
import Locale from "@/app/locales"
import {ChatControllerPool} from "@/app/client/controller";
import styles from "@/app/chat/chat.module.scss"

import LightIcon from "@/app/icons/light.svg";
import DarkIcon from "@/app/icons/dark.svg";
import AutoIcon from "@/app/icons/auto.svg";
import BottomIcon from "@/app/icons/bottom.svg";
import StopIcon from "@/app/icons/pause.svg";
import PromptIcon from "@/app/icons/prompt.svg";
import SettingsIcon from "@/app/icons/chat-settings.svg";
import MaskIcon from "@/app/icons/mask.svg";
import BreakIcon from "@/app/icons/break.svg";
import RobotIcon from "@/app/icons/robot.svg";
import {Path} from "@/app/constant";
import {useAllModels} from "@/app/utils/hooks";
import {Selector, showToast} from "@/app/components/ui-lib";
import {useRouter} from "next/navigation";


export function ChatActions(props: {
    showPromptModal: () => void;
    scrollToBottom: () => void;
    showPromptHints: () => void;
    hitBottom: boolean;
}) {
    const config = useAppConfig();
    const chatStore = useChatStore();
    const router = useRouter()


    // switch themes
    const theme = config.theme;

    function nextTheme() {
        const themes = [Theme.Auto, Theme.Light, Theme.Dark];
        const themeIndex = themes.indexOf(theme);
        const nextIndex = (themeIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        config.update((config) => (config.theme = nextTheme));
    }

    // stop all responses
    const couldStop = ChatControllerPool.hasPending();
    const stopAll = () => ChatControllerPool.stopAll();

    // switch model
    const currentModel = chatStore.currentSession().mask.modelConfig.model;
    const allModels = useAllModels();
    const models = useMemo(
        () => allModels.filter((m) => m.available),
        [allModels],
    );
    const [showModelSelector, setShowModelSelector] = useState(false);

    useEffect(() => {
        // if current model is not available
        // switch to first available model
        const isUnavaliableModel = !models.some((m) => m.name === currentModel);
        if (isUnavaliableModel && models.length > 0) {
            const nextModel = models[0].name as ModelType;
            chatStore.updateCurrentSession(
                (session) => (session.mask.modelConfig.model = nextModel),
            );
            showToast(nextModel);
        }
    }, [chatStore, currentModel, models]);

    return (
        <div className={styles["chat-input-actions"]}>
            {couldStop && (
                <ChatAction
                    onClick={stopAll}
                    text={Locale.Chat.InputActions.Stop}
                    icon={<StopIcon/>}
                />
            )}
            {!props.hitBottom && (
                <ChatAction
                    onClick={props.scrollToBottom}
                    text={Locale.Chat.InputActions.ToBottom}
                    icon={<BottomIcon/>}
                />
            )}
            {props.hitBottom && (
                <ChatAction
                    onClick={props.showPromptModal}
                    text={Locale.Chat.InputActions.Settings}
                    icon={<SettingsIcon/>}
                />
            )}

            <ChatAction
                onClick={nextTheme}
                text={Locale.Chat.InputActions.Theme[theme]}
                icon={
                    <>
                        {theme === Theme.Auto ? (
                            <AutoIcon/>
                        ) : theme === Theme.Light ? (
                            <LightIcon/>
                        ) : theme === Theme.Dark ? (
                            <DarkIcon/>
                        ) : null}
                    </>
                }
            />

            <ChatAction
                onClick={props.showPromptHints}
                text={Locale.Chat.InputActions.Prompt}
                icon={<PromptIcon/>}
            />

            <ChatAction
                onClick={() => {
                    router.push(Path.Masks)
                }}
                text={Locale.Chat.InputActions.Masks}
                icon={<MaskIcon/>}
            />

            <ChatAction
                text={Locale.Chat.InputActions.Clear}
                icon={<BreakIcon/>}
                onClick={() => {
                    chatStore.updateCurrentSession((session) => {
                        if (session.clearContextIndex === session.messages.length) {
                            session.clearContextIndex = undefined;
                        } else {
                            session.clearContextIndex = session.messages.length;
                            session.memoryPrompt = ""; // will clear memory
                        }
                    });
                }}
            />

            <ChatAction
                onClick={() => setShowModelSelector(true)}
                text={currentModel}
                icon={<RobotIcon/>}
            />

            {showModelSelector && (
                <Selector
                    defaultSelectedValue={currentModel}
                    items={models.map((m) => ({
                        title: m.displayName,
                        value: m.name,
                    }))}
                    onClose={() => setShowModelSelector(false)}
                    onSelection={(s) => {
                        if (s.length === 0) return;
                        chatStore.updateCurrentSession((session) => {
                            session.mask.modelConfig.model = s[0] as ModelType;
                            session.mask.syncGlobalConfig = false;
                        });
                        showToast(s[0]);
                    }}
                />
            )}
        </div>
    );
}