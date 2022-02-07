import Head from "next/head";
import Body from "../components/Body";
import Header from "../components/Header";
export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Head>
        <title>To Do</title>
        <meta
          name="description"
          content="An application to demonstrate the basic functionality of Zoho Catalyst."
        />
      </Head>
      <Header />
      <Body />
    </div>
  );
}
