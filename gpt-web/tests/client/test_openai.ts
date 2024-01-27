import {ChatGPTApi} from "@/app/client/openai";
import {createMessage} from "@/app/store/chat";

describe('#openai', () => {
    it('chat', async () => {
        const gpt: ChatGPTApi = new ChatGPTApi()
        await gpt.chat({
            messages: [createMessage({role: "user", content: "ping"})],
            config: {model: "gpt-3.5-turbo", temperature: 0.1, stream: false},
            onController(controller: AbortController): void {
            },
            onError(err: Error): void {
                console.error(err)
            },
            onFinish(message: string): void {
                console.log(message)
            },
            onUpdate(message: string, chunk: string): void {
                console.log(message)
            },
        })

    })
})