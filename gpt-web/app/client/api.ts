import {ChatGPTApi} from "@/app/client/openai";
import {useAccessStore} from "@/app/store/access";
import {ACCESS_CODE_PREFIX} from "@/app/constant";
import {getClientConfig} from "@/app/config/client";
import {ChatMessage} from "@/app/store/chat";

export const ROLES = ["system", "user", "assistant"] as const;
export type MessageRole = (typeof ROLES)[number];

export interface RequestMessage {
    role: MessageRole;
    content: string;
}

export interface LLMConfig {
    model: string;
    temperature?: number;
    top_p?: number;
    stream?: boolean;
    presence_penalty?: number;
    frequency_penalty?: number;
}

export interface ChatOptions {
    messages: RequestMessage[];
    config: LLMConfig;

    onUpdate?: (message: string, chunk: string) => void;
    onFinish: (message: string) => void;
    onError?: (err: Error) => void;
    onController?: (controller: AbortController) => void;
}


export interface LLMUsage {
    used: number;
    total: number;
}

export interface LLMModel {
    name: string;
    available: boolean;
}

export abstract class LLMApi {
    abstract chat(options: ChatOptions): Promise<void>;

    abstract usage(): Promise<LLMUsage>;

    abstract models(): Promise<LLMModel[]>;
}

export class ClientApi {
    public llm: LLMApi;

    constructor() {
        this.llm = new ChatGPTApi();
    }

    async share(messages: ChatMessage[], avatarUrl: string | null = null) {
        const msgs = messages
            .map((m) => ({
                from: m.role === "user" ? "human" : "gpt",
                value: m.content,
            }))
            .concat([
                {
                    from: "human",
                    value:
                        "Share from [NextChat]: https://github.com/Yidadaa/ChatGPT-Next-Web",
                },
            ]);
        // 敬告二开开发者们，为了开源大模型的发展，请不要修改上述消息，此消息用于后续数据清洗使用
        // Please do not modify this message

        console.log("[Share]", messages, msgs);
        const clientConfig = getClientConfig();
        const proxyUrl = "/sharegpt";
        const rawUrl = "https://sharegpt.com/api/conversations";
        const shareUrl = clientConfig?.isApp ? rawUrl : proxyUrl;
        const res = await fetch(shareUrl, {
            body: JSON.stringify({
                avatarUrl,
                items: msgs,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });

        const resJson = await res.json();
        console.log("[Share]", resJson);
        if (resJson.id) {
            return `https://shareg.pt/${resJson.id}`;
        }
    }
}

export function getHeaders() {
    const accessStore = useAccessStore.getState()
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
    const authHeader = "Authorization"
    const apiKey = accessStore.openaiApiKey

    const makeBearer = (s: string) => `Bearer ${s.trim()}`;
    const validString = (x: string) => x && x.length > 0

    if (validString(apiKey)) {
        headers[authHeader] = makeBearer(apiKey)
    } else if (accessStore.enabledAccessControl() && validString(accessStore.accessCode)) {
        headers[authHeader] = makeBearer(ACCESS_CODE_PREFIX + accessStore.accessCode)
    }

    return headers
}

export const api = new ClientApi();