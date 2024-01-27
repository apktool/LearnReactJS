import md5 from "spark-md5";

const ACCESS_CODES = (function getAccessCodes(): Set<string> {
    const code = process.env.CODE;

    try {
        const codes = (code?.split(",") ?? [])
            .filter((v) => !!v)
            .map((v) => md5.hash(v.trim()));
        return new Set(codes);
    } catch (e) {
        return new Set();
    }
})();
export const getServerSideConfig = () => {
    const apiKeyEnvVar = process.env.OPENAI_API_KEY ?? "";
    const apiKeys = apiKeyEnvVar.split(",").map((v) => v.trim());
    const randomIndex = Math.floor(Math.random() * apiKeys.length);

    const apiKey = apiKeys[randomIndex];
    let customModels = process.env.CUSTOM_MODELS ?? "";


    return {
        baseUrl: process.env.BASE_URL,
        apiKey,
        openaiOrgId: process.env.OPENAI_ORG_ID,

        needCode: ACCESS_CODES.size > 0,
        code: process.env.CODE,
        codes: ACCESS_CODES,

        customModels,

        hideUserApiKey: !!process.env.HIDE_USER_API_KEY,
    }
}