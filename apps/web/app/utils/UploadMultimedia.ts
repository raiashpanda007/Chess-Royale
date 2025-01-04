import { NextRequest, NextResponse } from "next/server"
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'
import {v4 as uuidv4} from 'uuid'
import response from "./response"
const uploadMulimedia  = async (req: NextRequest) => {
    const body = await req.json();
    const {key} = body;
    if(!key) {
        return NextResponse.json(new response(400,"No file is provided to upload on cloud",{}),{status:400})
    }
    const newkey = key + uuidv4();
    const credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || " ",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || " ",
    }
    try {
        const client = new S3Client({region: process.env.AWS_REGION || " ", credentials});
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME || " ",
            Key: newkey,
            ContentType: "image",
        });
        const url = await getSignedUrl(client,command,{expiresIn:60*2});
        return NextResponse.json(new response(200,"Video url is generated", {url:url}));
    } catch (error) {
        console.log(error);
        return NextResponse.json(new response(500,"Internal Server Error",{}),{status:500})
        
    }
}
export default uploadMulimedia