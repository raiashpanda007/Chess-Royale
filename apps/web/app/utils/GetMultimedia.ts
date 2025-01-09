import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const findMedia = async (key: string | undefined): Promise<string | null> => {
    if (!key) {
        console.error("Key is undefined");
        return null;
    }

    const params = {
        Bucket: "chess-royale-iiitbh",
        Prefix: key, // Filters objects that start with this prefix
    };

    try {
        const s3Client = new S3Client({ region: "ap-south-1" });
        const command = new ListObjectsV2Command(params);
        const result = await s3Client.send(command);

        // Check if any objects are returned
        if (result.Contents && result.Contents.length > 0) {
            // Get the first object key
            const firstFileKey = result.Contents?.[0]?.Key;
            if (!firstFileKey) {
                console.log("No valid file keys found.");
                return null;
            }

            // Construct and return the URL for the first file
            return `https://${params.Bucket}.s3.ap-south-1.amazonaws.com/${firstFileKey}`;
        }

        console.log("No files found for the given prefix.");
        return null;
    } catch (error) {
        console.error("Error fetching media files:", error);
        return null;
    }
};

export default findMedia;
