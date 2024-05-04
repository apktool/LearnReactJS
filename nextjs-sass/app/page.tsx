import "@/app/body1.css"
import "@/app/body2.scss"
import styles from "@/app/body.module.scss"


export default function Home() {
    return (
        <div>
            <h1> Hello World </h1>
            <h1 className={styles["chat_style"]}> Hello C++ </h1>
            <h1 className={styles["chat_size"]}> Hello Rust </h1>
        </div>
    )
}
