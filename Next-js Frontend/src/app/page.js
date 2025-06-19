import Image from "next/image";
import styles from "./page.module.css";
import Container from "@mui/material/Container";
import Login from "./components/login"

export default function Home() {
  return (
    <Container>
      <Login/>

    </Container>
  );
}
