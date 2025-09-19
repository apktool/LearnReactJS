export type Response<R> = Promise<{
    code: number
    message: string
    data?: never
}>
export interface Topic {
    name: string
    title: string
}

export interface TableItem {
    table: Topic[]
}

export interface TopicResponse extends Response<Topic> {
    data: TableItem
}

function uriEncoding(template: TemplateStringsArray, ...substitutions: any[]): string {
    let result = "";
    for (let i = 0; i < substitutions.length; i++) {
        result += template[i];
        result += encodeURIComponent(substitutions[i]);
    }
    result += template[template.length - 1];
    return result;
}

export interface HttpClient {
    request<R>(requestConfig: {
        method: string;
        url: string;
        queryParams?: any;
        data?: any;
        copyFn?: (data: R) => R;
    }): Response<R>;
}

export class RestApplicationClient {
    constructor(private readonly httpClient: HttpClient) {

    }

    getTopics(): Response<TopicResponse> {
        //{"data":{"table":[{"name":"容器","title":"docker"},{"name":"比特币","title":"bitcoin"}],"total":2},"message":"","code":200}
        return this.httpClient.request({
            method: "GET",
            url: uriEncoding`/m1/7020607-6739350-default/topics`
        });
    }
}