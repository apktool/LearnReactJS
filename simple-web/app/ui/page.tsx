'use client'

import useSWR from "swr";
import {restClient} from "@/lib/httpClient";
import {Table} from "@mantine/core";
import {Topic, TopicResponse} from "@/models/backend";

export default function UiHome() {
    const {data, error, isLoading} = useSWR("/topics", () => restClient.getTopics());

    if (isLoading) return <div>Loading...</div>;

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const response: TopicResponse = data?.data
    const table: Topic[] = response.data.table

    const rows = table.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.title}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Title</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}