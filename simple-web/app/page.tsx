import Link from "next/link";
import {Center} from "@mantine/core";

export default function Home() {
    return (
        <Center bg="white">
            <Link href={"/ui"}>Hello, Click Me</Link>
        </Center>
    )
}
