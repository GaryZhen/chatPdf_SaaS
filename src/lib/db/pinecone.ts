import { PineconeClient} from "@pinecone-database/pinecone"
import { downloadFromS3 } from "./s3-server";
import { PDFLoader  } from "langchain/document_loaders/fs/pdf";


let pinecone: PineconeClient | null = null

export const getPinecone = async() => {
    if (pinecone){
        pinecone = new PineconeClient()
        await pinecone.init({
            environment: process.env.PINECONE_API_KEY!,
            apiKey: process.env.PINECONE_API_KEY!
        })
    }
    return pinecone;
}


// I don't know why I set this up like this.
type PDFPage = {
    pageContent: string;
    metadata: {
        loc:{pageNumber: number}
    }
}

export async function loadS3IntoPinecone(fileKey: string){
    //1. obtain the pdf --> download and read from pdf
    console.log("downloading from s3 into file system")
    const file_name = await downloadFromS3(fileKey);
    if(!file_name){
        throw new Error("could not download file from s3")
    } 
    const loader = new PDFLoader(file_name);
    const pages = await loader.load() as PDFPage[]; 
    console.log()
    return pages; 
}

