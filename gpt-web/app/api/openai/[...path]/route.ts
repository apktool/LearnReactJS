import {OpenaiPath} from "@/app/constant";
import {OpenAIListModelResponse} from "@/app/client/openai";
import {NextRequest, NextResponse} from "next/server";
import {requestOpenai} from "@/app/api/common";
import {prettyObject} from "@/app/utils/format";
import {auth} from "@/app/api/openai/auth";

const ALLOWD_PATH = new Set(Object.values(OpenaiPath));

function getModels(remoteModelRes: OpenAIListModelResponse) {
    return remoteModelRes
}

async function handle(req: NextRequest, {params}: { params: { path: string[] } }) {
    console.log("[OpenAI Route] params ", params)

    if (req.method === "OPTIONS") {
        return NextResponse.json({body: "OK"}, {status: 200})
    }

    const subpath = params.path.join("/")

    if (!ALLOWD_PATH.has(subpath)) {
        console.log("[OpenAI Route] forbidden path ", subpath);
        return NextResponse.json(
            {
                error: true,
                msg: "you are not allowed to request " + subpath,
            },
            {
                status: 403,
            },
        );
    }

    const authResult = auth(req);
    if (authResult.error) {
        return NextResponse.json(authResult, {
            status: 401,
        });
    }

    try {
        const response = await requestOpenai(req);

        if (subpath === OpenaiPath.ListModelPath && response.status === 200) {
            const resJson = (await response.json()) as OpenAIListModelResponse;
            const availableModels = getModels(resJson);
            return NextResponse.json(availableModels, {
                status: response.status,
            });
        }

        return response;
        /*
        return NextResponse.json({
            "id": "chatcmpl-8leg0E8dXqmQBK52j9EnhCIPnZNVY",
            "object": "chat.completion",
            "created": 1706368468,
            "model": "gpt-3.5-turbo-0613",
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": "Pinging is a network diagnostic tool used to test the reachability of a host on an Internet Protocol (IP) network. It measures the round-trip time (RTT) for packets sent from the source host to the destination host and back. The command is usually executed in a command prompt or terminal using the \"ping\" command followed by the IP address or domain name of the target host.\n\nFor example, to ping a website like www.example.com, you would open a command prompt or terminal and type:\n\n```\nping www.example.com\n```\n\nThe ping command will send ICMP (Internet Control Message Protocol) echo request packets to the target host and wait for ICMP echo reply packets to be returned. It measures the time it takes for the packets to make the round trip, allowing you to assess the network latency and the overall connectivity to the target host.\n\nThe output of the ping command typically includes the round-trip time (in milliseconds) for each packet, as well as statistics such as packet loss percentage and minimum/maximum/average round-trip times.\n\nNote: Since I am an AI language model and don't have direct access to a command prompt or terminal, I am unable to execute the ping command. However, I can provide information and help answer any questions you may have about pinging."
                    },
                    "logprobs": null,
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": 105,
                "completion_tokens": 263,
                "total_tokens": 368
            },
            "system_fingerprint": null
        })
         */
    } catch (e) {
        console.error("[OpenAI] ", e);
        return NextResponse.json(prettyObject(e));
    }
}

export const GET = handle;
export const POST = handle;


export const runtime = "edge";
export const preferredRegion = ['arn1', 'bom1', 'cdg1', 'cle1', 'cpt1', 'dub1', 'fra1', 'gru1', 'hnd1', 'iad1', 'icn1', 'kix1', 'lhr1', 'pdx1', 'sfo1', 'sin1', 'syd1'];
