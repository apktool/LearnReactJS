'use client'

import {NoSSR} from "next/dist/shared/lib/lazy-dynamic/dynamic-no-ssr";
import ErrorBoundary from "@/app/error";
import {BOT_HELLO, ChatMessage, createMessage, DEFAULT_TOPIC, useChatStore} from "@/app/store/chat";
import {SubmitKey, useAppConfig} from "@/app/store/config";
import styles from "@/app/chat/chat.module.scss"
import React, {Fragment, Suspense, useEffect, useMemo, useRef, useState} from "react";
import Locale from "@/app/locales"
import {PromptHints, RenderPompt} from "@/app/chat/prompt-hints";
import {IconButton} from "@/app/components/button";
import {ChatCommandPrefix, useChatCommand} from "@/app/command";
import {copyToClipboard, selectOrCopy, useMobileScreen} from "@/app/utils";
import ReturnIcon from "@/app/icons/return.svg"
import RenameIcon from "@/app/icons/rename.svg"
import EditIcon from "@/app/icons/rename.svg"
import ExportIcon from "@/app/icons/share.svg"
import MaxIcon from "@/app/icons/max.svg"
import MinIcon from "@/app/icons/min.svg"
import CancelIcon from "@/app/icons/cancel.svg"
import ConfirmIcon from "@/app/icons/confirm.svg"
import StopIcon from "@/app/icons/pause.svg";
import ResetIcon from "@/app/icons/reload.svg";
import DeleteIcon from "@/app/icons/clear.svg";
import PinIcon from "@/app/icons/pin.svg"
import CopyIcon from "@/app/icons/copy.svg"
import SendWhiteIcon from "@/app/icons/send-white.svg";
import {CHAT_PAGE_SIZE, LAST_INPUT_KEY, Path} from "@/app/constant";
import {getClientConfig} from "@/app/config/client";
import {PromptToast} from "@/app/chat/prompt-toast";
import {useRouter} from "next/navigation";
import {useAccessStore} from "@/app/store/access";
import {List, ListItem, Modal, showPrompt, showToast} from "@/app/components/ui-lib";
import {Avatar} from "@/app/components/emoji";
import {ContextPrompts, MaskAvatar} from "@/app/components/mask";
import {ChatAction} from "@/app/chat/chat-action";
import {ChatControllerPool} from "@/app/client/controller";
import {Markdown} from "@/app/components/markdown";
import {ChatActions} from "@/app/chat/chat-actions";
import {useDebouncedCallback} from "use-debounce";
import {usePromptStore} from "@/app/utils/prompt";
import {ExportMessageModal} from "@/app/components/exporter";


function useScrollToBottom() {
    // for auto-scroll
    const scrollRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    function scrollDomToBottom() {
        const dom = scrollRef.current;
        if (dom) {
            requestAnimationFrame(() => {
                setAutoScroll(true);
                dom.scrollTo(0, dom.scrollHeight);
            });
        }
    }

    // auto scroll
    useEffect(() => {
        if (autoScroll) {
            scrollDomToBottom();
        }
    });

    return {
        scrollRef,
        autoScroll,
        setAutoScroll,
        scrollDomToBottom,
    };
}

function useSubmitHandler() {
    const config = useAppConfig();
    const submitKey = config.submitKey;
    const isComposing = useRef(false);

    useEffect(() => {
        const onCompositionStart = () => {
            isComposing.current = true;
        };
        const onCompositionEnd = () => {
            isComposing.current = false;
        };

        window.addEventListener("compositionstart", onCompositionStart);
        window.addEventListener("compositionend", onCompositionEnd);

        return () => {
            window.removeEventListener("compositionstart", onCompositionStart);
            window.removeEventListener("compositionend", onCompositionEnd);
        };
    }, []);

    const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== "Enter") return false;
        if (e.key === "Enter" && (e.nativeEvent.isComposing || isComposing.current))
            return false;
        return (
            (config.submitKey === SubmitKey.AltEnter && e.altKey) ||
            (config.submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
            (config.submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
            (config.submitKey === SubmitKey.MetaEnter && e.metaKey) ||
            (config.submitKey === SubmitKey.Enter &&
                !e.altKey &&
                !e.ctrlKey &&
                !e.shiftKey &&
                !e.metaKey)
        );
    };

    return {
        submitKey,
        shouldSubmit,
    };
}

function ClearContextDivider() {
    const chatStore = useChatStore();

    return (
        <div
            className={styles["clear-context"]}
            onClick={() =>
                chatStore.updateCurrentSession(
                    (session) => (session.clearContextIndex = undefined),
                )
            }
        >
            <div className={styles["clear-context-tips"]}>{Locale.Context.Clear}</div>
            <div className={styles["clear-context-revert-btn"]}>
                {Locale.Context.Revert}
            </div>
        </div>
    );
}

export function EditMessageModal(props: { onClose: () => void }) {
    const chatStore = useChatStore();
    const session = chatStore.currentSession();
    const [messages, setMessages] = useState(session.messages.slice());

    return (
        <div className="modal-mask">
            <Modal
                title={Locale.Chat.EditMessage.Title}
                onClose={props.onClose}
                actions={[
                    <IconButton
                        text={Locale.UI.Cancel}
                        icon={<CancelIcon/>}
                        key="cancel"
                        onClick={() => {
                            props.onClose();
                        }}
                    />,
                    <IconButton
                        type="primary"
                        text={Locale.UI.Confirm}
                        icon={<ConfirmIcon/>}
                        key="ok"
                        onClick={() => {
                            chatStore.updateCurrentSession(
                                (session) => (session.messages = messages),
                            );
                            props.onClose();
                        }}
                    />,
                ]}
            >
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <List>
                    <ListItem
                        title={Locale.Chat.EditMessage.Topic.Title}
                        subTitle={Locale.Chat.EditMessage.Topic.SubTitle}
                    >
                        <input
                            type="text"
                            value={session.topic}
                            onInput={(e) =>
                                chatStore.updateCurrentSession(
                                    (session) => (session.topic = e.currentTarget.value),
                                )
                            }
                        ></input>
                    </ListItem>
                </List>
                <ContextPrompts
                    context={messages}
                    updateContext={(updater) => {
                        const newMessages = messages.slice();
                        updater(newMessages);
                        setMessages(newMessages);
                    }}
                />
            </Modal>
        </div>
    );
}


export function _Chat() {
    type RenderMessage = ChatMessage & { preview?: boolean };

    const chatStore = useChatStore();
    const session = chatStore.currentSession();
    const config = useAppConfig();
    const [isEditingMessage, setIsEditingMessage] = useState(false);
    const promptStore = usePromptStore();
    const [promptHints, setPromptHints] = useState<RenderPompt[]>([]);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {submitKey, shouldSubmit} = useSubmitHandler();
    const [inputRows, setInputRows] = useState(2);
    const isMobileScreen = useMobileScreen();
    const [showExport, setShowExport] = useState(false);
    const clientConfig = useMemo(() => getClientConfig(), []);
    const showMaxIcon = !isMobileScreen && !clientConfig?.isApp;
    const [hitBottom, setHitBottom] = useState(true);
    const {scrollRef, setAutoScroll, scrollDomToBottom} = useScrollToBottom();
    const [showPromptModal, setShowPromptModal] = useState(false);
    const router = useRouter()
    const fontSize = config.fontSize;
    const autoFocus = !isMobileScreen; // wont auto focus on mobile screen
    const SEARCH_TEXT_LIMIT = 30;


    const chatCommands = useChatCommand({
        new: () => chatStore.newSession(),
        clear: () =>
            chatStore.updateCurrentSession(
                (session) => (session.clearContextIndex = session.messages.length),
            ),
        del: () => chatStore.deleteSession(chatStore.currentSessionIndex),
    });

    const onInput = (text: string) => {
        setUserInput(text);
        const n = text.trim().length;

        // clear search results
        if (n === 0) {
            setPromptHints([]);
        } else if (text.startsWith(ChatCommandPrefix)) {
            setPromptHints(chatCommands.search(text));
        } else if (!config.disablePromptHint && n < SEARCH_TEXT_LIMIT) {
            // check if need to trigger auto completion
            if (text.startsWith("/")) {
                let searchText = text.slice(1);
                onSearch(searchText);
            }
        }
    };

    const doSubmit = (userInput: string) => {
        if (userInput.trim() === "") return;
        const matchCommand = chatCommands.match(userInput);
        if (matchCommand.matched) {
            setUserInput("");
            setPromptHints([]);
            matchCommand.invoke();
            return;
        }
        setIsLoading(true);
        console.log("-----------------+====================")
        chatStore.onUserInput(userInput).then(() => setIsLoading(false));
        localStorage.setItem(LAST_INPUT_KEY, userInput);
        setUserInput("");
        setPromptHints([]);
        if (!isMobileScreen) inputRef.current?.focus();
        setAutoScroll(true);
    };

    const deleteMessage = (msgId?: string) => {
        chatStore.updateCurrentSession(
            (session) =>
                (session.messages = session.messages.filter((m) => m.id !== msgId)),
        );
    };

    const onUserStop = (messageId: string) => {
        ChatControllerPool.stop(session.id, messageId);
    };

    const onDelete = (msgId: string) => {
        deleteMessage(msgId);
    };

    const onResend = (message: ChatMessage) => {
        // when it is resending a message
        // 1. for a user's message, find the next bot response
        // 2. for a bot's message, find the last user's input
        // 3. delete original user input and bot's message
        // 4. resend the user's input

        const resendingIndex = session.messages.findIndex(
            (m) => m.id === message.id,
        );

        if (resendingIndex < 0 || resendingIndex >= session.messages.length) {
            console.error("[Chat] failed to find resending message", message);
            return;
        }

        let userMessage: ChatMessage | undefined;
        let botMessage: ChatMessage | undefined;

        if (message.role === "assistant") {
            // if it is resending a bot's message, find the user input for it
            botMessage = message;
            for (let i = resendingIndex; i >= 0; i -= 1) {
                if (session.messages[i].role === "user") {
                    userMessage = session.messages[i];
                    break;
                }
            }
        } else if (message.role === "user") {
            // if it is resending a user's input, find the bot's response
            userMessage = message;
            for (let i = resendingIndex; i < session.messages.length; i += 1) {
                if (session.messages[i].role === "assistant") {
                    botMessage = session.messages[i];
                    break;
                }
            }
        }

        if (userMessage === undefined) {
            console.error("[Chat] failed to resend", message);
            return;
        }

        // delete the original messages
        deleteMessage(userMessage.id);
        deleteMessage(botMessage?.id);

        // resend the message
        setIsLoading(true);
        chatStore.onUserInput(userMessage.content).then(() => setIsLoading(false));
        inputRef.current?.focus();
    };

    const onPinMessage = (message: ChatMessage) => {
        chatStore.updateCurrentSession((session) =>
            session.mask.context.push(message),
        );

        showToast(Locale.Chat.Actions.PinToastContent, {
            text: Locale.Chat.Actions.PinToastAction,
            onClick: () => {
                setShowPromptModal(true);
            },
        });
    };

    const onPromptSelect = (prompt: RenderPompt) => {
        setTimeout(() => {
            setPromptHints([]);

            const matchedChatCommand = chatCommands.match(prompt.content);
            if (matchedChatCommand.matched) {
                // if user is selecting a chat command, just trigger it
                matchedChatCommand.invoke();
                setUserInput("");
            } else {
                // or fill the prompt
                setUserInput(prompt.content);
            }
            inputRef.current?.focus();
        }, 30);
    };

    const context: RenderMessage[] = useMemo(() => {
        return session.mask.hideContext ? [] : session.mask.context.slice();
    }, [session.mask.context, session.mask.hideContext]);
    const accessStore = useAccessStore();

    if (
        context.length === 0 &&
        session.messages.at(0)?.content !== BOT_HELLO.content
    ) {
        const copiedHello = Object.assign({}, BOT_HELLO);
        /*
        if (!accessStore.isAuthorized()) {
            copiedHello.content = Locale.Error.Unauthorized;
        }
         */
        context.push(copiedHello);
    }

    // preview messages
    const renderMessages = useMemo(() => {
        return context
            .concat(session.messages as RenderMessage[])
            .concat(
                isLoading
                    ? [
                        {
                            ...createMessage({
                                role: "assistant",
                                content: "……",
                            }),
                            preview: true,
                        },
                    ]
                    : [],
            )
            .concat(
                userInput.length > 0 && config.sendPreviewBubble
                    ? [
                        {
                            ...createMessage({
                                role: "user",
                                content: userInput,
                            }),
                            preview: true,
                        },
                    ]
                    : [],
            );
    }, [
        config.sendPreviewBubble,
        context,
        isLoading,
        session.messages,
        userInput,
    ]);

    const [msgRenderIndex, _setMsgRenderIndex] = useState(
        Math.max(0, renderMessages.length - CHAT_PAGE_SIZE),
    );

    function setMsgRenderIndex(newIndex: number) {
        newIndex = Math.min(renderMessages.length - CHAT_PAGE_SIZE, newIndex);
        newIndex = Math.max(0, newIndex);
        _setMsgRenderIndex(newIndex);
    }


    const messages = useMemo(() => {
        const endRenderIndex = Math.min(
            msgRenderIndex + 3 * CHAT_PAGE_SIZE,
            renderMessages.length,
        );
        return renderMessages.slice(msgRenderIndex, endRenderIndex);
    }, [msgRenderIndex, renderMessages]);

    const onChatBodyScroll = (e: HTMLElement) => {
        const bottomHeight = e.scrollTop + e.clientHeight;
        const edgeThreshold = e.clientHeight;

        const isTouchTopEdge = e.scrollTop <= edgeThreshold;
        const isTouchBottomEdge = bottomHeight >= e.scrollHeight - edgeThreshold;
        const isHitBottom =
            bottomHeight >= e.scrollHeight - (isMobileScreen ? 4 : 10);

        const prevPageMsgIndex = msgRenderIndex - CHAT_PAGE_SIZE;
        const nextPageMsgIndex = msgRenderIndex + CHAT_PAGE_SIZE;

        if (isTouchTopEdge && !isTouchBottomEdge) {
            setMsgRenderIndex(prevPageMsgIndex);
        } else if (isTouchBottomEdge) {
            setMsgRenderIndex(nextPageMsgIndex);
        }

        setHitBottom(isHitBottom);
        setAutoScroll(isHitBottom);
    };

    const onRightClick = (e: any, message: ChatMessage) => {
        // copy to clipboard
        if (selectOrCopy(e.currentTarget, message.content)) {
            if (userInput.length === 0) {
                setUserInput(message.content);
            }

            e.preventDefault();
        }
    };

    const onSearch = useDebouncedCallback(
        (text: string) => {
            const matchedPrompts = promptStore.search(text);
            setPromptHints(matchedPrompts);
        },
        100,
        {leading: true, trailing: true},
    );

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // if ArrowUp and no userInput, fill with last input
        if (
            e.key === "ArrowUp" &&
            userInput.length <= 0 &&
            !(e.metaKey || e.altKey || e.ctrlKey)
        ) {
            setUserInput(localStorage.getItem(LAST_INPUT_KEY) ?? "");
            e.preventDefault();
            return;
        }
        if (shouldSubmit(e) && promptHints.length === 0) {
            doSubmit(userInput);
            e.preventDefault();
        }
    };

    function scrollToBottom() {
        setMsgRenderIndex(renderMessages.length - CHAT_PAGE_SIZE);
        scrollDomToBottom();
    }

    // clear context index = context length + index in messages
    const clearContextIndex =
        (session.clearContextIndex ?? -1) >= 0
            ? session.clearContextIndex! + context.length - msgRenderIndex
            : -1;


    return (
        <div className={styles.chat} key={session.id}>
            <div className="window-header" data-tauri-drag-region>
                {isMobileScreen && (
                    <div className="window-actions">
                        <div className={"window-action-button"}>
                            <IconButton
                                icon={<ReturnIcon/>}
                                bordered
                                title={Locale.Chat.Actions.ChatList}
                                onClick={() => router.push(Path.Home)}
                            />
                        </div>
                    </div>
                )}

                <div className={`window-header-title ${styles["chat-body-title"]}`}>
                    <div
                        className={`window-header-main-title ${styles["chat-body-main-title"]}`}
                        onClickCapture={() => setIsEditingMessage(true)}
                    >
                        {!session.topic ? DEFAULT_TOPIC : session.topic}
                    </div>
                    <div className="window-header-sub-title">
                        {Locale.Chat.SubTitle(session.messages.length)}
                    </div>
                </div>
                <div className="window-actions">
                    {!isMobileScreen && (
                        <div className="window-action-button">
                            <IconButton
                                icon={<RenameIcon/>}
                                bordered
                                onClick={() => setIsEditingMessage(true)}
                            />
                        </div>
                    )}
                    <div className="window-action-button">
                        <IconButton
                            icon={<ExportIcon/>}
                            bordered
                            title={Locale.Chat.Actions.Export}
                            onClick={() => {
                                setShowExport(true);
                            }}
                        />
                    </div>
                    {showMaxIcon && (
                        <div className="window-action-button">
                            <IconButton
                                icon={config.tightBorder ? <MinIcon/> : <MaxIcon/>}
                                bordered
                                onClick={() => {
                                    config.update(
                                        (config) => (config.tightBorder = !config.tightBorder),
                                    );
                                }}
                            />
                        </div>
                    )}
                </div>

                <PromptToast
                    showToast={!hitBottom}
                    showModal={showPromptModal}
                    setShowModal={setShowPromptModal}
                />
            </div>

            <div
                className={styles["chat-body"]}
                ref={scrollRef}
                onScroll={(e) => onChatBodyScroll(e.currentTarget)}
                onMouseDown={() => inputRef.current?.blur()}
                onTouchStart={() => {
                    inputRef.current?.blur();
                    setAutoScroll(false);
                }}
            >
                {messages.map((message, i) => {
                    const isUser = message.role === "user";
                    const isContext = i < context.length;
                    const showActions =
                        i > 0 &&
                        !(message.preview || message.content.length === 0) &&
                        !isContext;
                    const showTyping = message.preview || message.streaming;

                    const shouldShowClearContextDivider = i === clearContextIndex - 1;

                    return (
                        <Fragment key={message.id}>
                            <div
                                className={
                                    isUser ? styles["chat-message-user"] : styles["chat-message"]
                                }
                            >
                                <div className={styles["chat-message-container"]}>
                                    <div className={styles["chat-message-header"]}>
                                        <div className={styles["chat-message-avatar"]}>
                                            <div className={styles["chat-message-edit"]}>
                                                <IconButton
                                                    icon={<EditIcon/>}
                                                    onClick={async () => {
                                                        const newMessage = await showPrompt(
                                                            Locale.Chat.Actions.Edit,
                                                            message.content,
                                                            10,
                                                        );
                                                        chatStore.updateCurrentSession((session) => {
                                                            const m = session.mask.context
                                                                .concat(session.messages)
                                                                .find((m) => m.id === message.id);
                                                            if (m) {
                                                                m.content = newMessage;
                                                            }
                                                        });
                                                    }}
                                                ></IconButton>
                                            </div>

                                            {isUser
                                                ? (<Avatar avatar={config.avatar}/>)
                                                : (<>
                                                    {["system"].includes(message.role) ? (
                                                        <Avatar avatar="2699-fe0f"/>
                                                    ) : (
                                                        <MaskAvatar
                                                            avatar={session.mask.avatar}
                                                            model={
                                                                message.model || session.mask.modelConfig.model
                                                            }
                                                        />
                                                    )}
                                                </>)
                                            }
                                        </div>

                                        {/* TODO lwg*/}
                                        {showActions && (
                                            <div className={styles["chat-message-actions"]}>
                                                <div className={styles["chat-input-actions"]}>
                                                    {message.streaming
                                                        ? (<ChatAction
                                                            text={Locale.Chat.Actions.Stop}
                                                            icon={<StopIcon/>}
                                                            onClick={() => onUserStop(message.id ?? i)}/>)
                                                        : (<>
                                                            <ChatAction
                                                                text={Locale.Chat.Actions.Retry}
                                                                icon={<ResetIcon/>}
                                                                onClick={() => onResend(message)}
                                                            />

                                                            <ChatAction
                                                                text={Locale.Chat.Actions.Delete}
                                                                icon={<DeleteIcon/>}
                                                                onClick={() => onDelete(message.id ?? i)}
                                                            />

                                                            <ChatAction
                                                                text={Locale.Chat.Actions.Pin}
                                                                icon={<PinIcon/>}
                                                                onClick={() => onPinMessage(message)}
                                                            />
                                                            <ChatAction
                                                                text={Locale.Chat.Actions.Copy}
                                                                icon={<CopyIcon/>}
                                                                onClick={() => copyToClipboard(message.content)}
                                                            />
                                                        </>)}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {showTyping && (
                                        <div className={styles["chat-message-status"]}>
                                            {Locale.Chat.Typing}
                                        </div>
                                    )}

                                    <div className={styles["chat-message-item"]}>
                                        <Markdown
                                            content={message.content}
                                            loading={
                                                (message.preview || message.streaming) &&
                                                message.content.length === 0 &&
                                                !isUser
                                            }
                                            onContextMenu={(e) => onRightClick(e, message)}
                                            onDoubleClickCapture={() => {
                                                if (!isMobileScreen) return;
                                                setUserInput(message.content);
                                            }}
                                            fontSize={fontSize}
                                            parentRef={scrollRef}
                                            defaultShow={i >= messages.length - 6}
                                        />
                                    </div>

                                    <div className={styles["chat-message-action-date"]}>
                                        {isContext
                                            ? Locale.Chat.IsContext
                                            : message.date.toLocaleString()}
                                    </div>
                                </div>

                            </div>
                            {shouldShowClearContextDivider && <ClearContextDivider/>}
                        </Fragment>
                    );
                })}
            </div>

            <div className={styles["chat-input-panel"]}>
                <PromptHints prompts={promptHints} onPromptSelect={onPromptSelect}/>

                <ChatActions
                    showPromptModal={() => setShowPromptModal(true)}
                    scrollToBottom={scrollToBottom}
                    hitBottom={hitBottom}
                    showPromptHints={() => {
                        // Click again to close
                        if (promptHints.length > 0) {
                            setPromptHints([]);
                            return;
                        }

                        inputRef.current?.focus();
                        setUserInput("/");
                        onSearch("");
                    }}
                />
                <div className={styles["chat-input-panel-inner"]}>
          <textarea
              ref={inputRef}
              className={styles["chat-input"]}
              placeholder={Locale.Chat.Input(submitKey)}
              onInput={(e) => onInput(e.currentTarget.value)}
              value={userInput}
              onKeyDown={onInputKeyDown}
              onFocus={scrollToBottom}
              onClick={scrollToBottom}
              rows={inputRows}
              autoFocus={autoFocus}
              style={{
                  fontSize: config.fontSize,
              }}
          />
                    <IconButton
                        icon={<SendWhiteIcon/>}
                        text={Locale.Chat.Send}
                        className={styles["chat-input-send"]}
                        type="primary"
                        onClick={() => doSubmit(userInput)}
                    />
                </div>
            </div>

            {showExport && (
                <ExportMessageModal onClose={() => setShowExport(false)}/>
            )}

            {isEditingMessage && (
                <EditMessageModal
                    onClose={() => {
                        setIsEditingMessage(false);
                    }}
                />
            )}
        </div>
    );

}


export default function Chat() {
    const chatStore = useChatStore();
    const sessionIndex = chatStore.currentSessionIndex;
    return (
        <div>
            <Suspense fallback={<h1>Oop, Client ERROR</h1>}>
                <ErrorBoundary>
                    <NoSSR>
                        <_Chat key={sessionIndex}/>
                    </NoSSR>
                </ErrorBoundary>
            </Suspense>
        </div>
    )
}