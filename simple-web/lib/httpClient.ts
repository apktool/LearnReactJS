import Axios from 'axios'
import {RestApplicationClient} from "@/models/backend";

const httpClient = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
    withXSRFToken: true,
})

export const restClient = new RestApplicationClient(httpClient);