// /api/create-chat

import { NextResponse } from "next/server";
import { loadS3IntoPinecone } from "@/lib/db/pinecone";

export async function POST(req: Request, res: Response) {
    try{
        console.log("\n\ncreating chat2 here\n\n");
        const body = await req.json();
        const { file_key, file_name} = body;
        console.log(file_key, file_name);
        const pages = await loadS3IntoPinecone(file_key);
        return NextResponse.json({pages});

        
    }catch(error){
        console.error();
        return NextResponse.json(
            {error: "internal server error"}, 
            {status: 500}
            );
    }
}