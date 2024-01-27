import {getServerSideConfig} from "@/app/config/server";
import {NextResponse} from "next/server";

const serverConfig = getServerSideConfig();

const DANGER_CONFIG = {
    needCode: serverConfig.needCode,
    customModels: serverConfig.customModels,
};

declare global {
    type DangerConfig = typeof DANGER_CONFIG;
}

async function handle() {
    return NextResponse.json(DANGER_CONFIG);
}

export const GET = handle;
export const POST = handle;