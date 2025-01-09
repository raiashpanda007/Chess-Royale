import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import response from './response';

const uploadMultimedia = async (req: NextRequest) => {
    const body = await req.json();
    const { key } = body;

    // Validate that the key is provided
    if (!key) {
        return NextResponse.json(
            new response(400, "No file is provided to upload on cloud", {}),
            { status: 400 }
        );
    }

    // Generate unique key by appending UUID
    const newKey =  uuidv4()+key.replace(/ /g, "_");

    // Check if environment variables are set
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
        return NextResponse.json(
            new response(500, "Missing AWS configuration", {}),
            { status: 500 }
        );
    }

    // AWS Credentials from environment variables
    const credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };

    try {
        // Initialize AWS S3 client
        const client = new S3Client({
            region: process.env.AWS_REGION,
            credentials,
        });

        // Create the S3 command
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: newKey,
        });

        // Generate the signed URL (valid for 2 hours)
        const url = await getSignedUrl(client, command, { expiresIn: 60 * 2 });
        console.log("Signed URL generated:", url);

        // Return the signed URL and the new key
        return NextResponse.json(
            new response(200, "Video URL is generated", { url, key: newKey }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error generating signed URL:", error);
        return NextResponse.json(
            new response(500, "Internal Server Error", {}),
            { status: 500 }
        );
    }
};

export default uploadMultimedia;
