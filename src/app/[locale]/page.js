import { auth } from "@/auth";

import ExportView from "@/views/ExportView";

const Home = async() => {

  const authSession = await auth();

  return (
    <ExportView authSession={authSession}/>
  );
}

export default Home;