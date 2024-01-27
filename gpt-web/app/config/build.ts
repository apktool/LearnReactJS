import * as process from "process";

export const getBuildConfig = () => {
    if (typeof process == "undefined") {
        throw Error("[Server Config] you are importing a nodejs-only module outside of nodejs")
    }

    const buildMode = process.env.BUILD_MODE ?? "standalone"
    const isApp = !!process.env.BUILD_APP;

    return {
        buildMode, isApp
    }
}

export type BuildConfig = ReturnType<typeof getBuildConfig>