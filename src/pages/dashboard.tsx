import Head from "next/head";
import { AiOutlineContainer } from "react-icons/ai";
import { Content } from "../components/Content";


export default function Dashboard () {
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Content contentHeader={[]}>
                    <div className="flex bg-blue-480 text-white p-3 rounded-md items-center">
                        <AiOutlineContainer className="mr-2"/>
                            Dashboard
                    </div> 
                    <div className="flex items-end m-auto">
                        <img src="/images/logo.png" alt="GOM" className='w-48 h-40'/>
                    </div>
            </Content>
        </>
    )
}