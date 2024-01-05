export const getServerSideConfig = () => {
    const apiKeyEnvVar = process.env.OPENAI_API_KEY ?? "";
    const apiKeys = apiKeyEnvVar.split(",").map((v) => v.trim());
    const randomIndex = Math.floor(Math.random() * apiKeys.length);

    const apiKey = apiKeys[randomIndex];


    return {
        baseUrl: process.env.BASE_URL,
        apiKey,
        isVercel: !!process.env.VERCEL,
    }
}