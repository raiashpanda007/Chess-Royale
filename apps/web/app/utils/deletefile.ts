import { S3Client,DeleteObjectCommand } from "@aws-sdk/client-s3"
const deleteFile = async (url:string) =>{
    const client = new S3Client({region:process.env.AWS_REGION})
    const key = url.split('.com/')[1]
    const params ={
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:key
    }
    try {
        const command = new DeleteObjectCommand(params)
        const response = await client.send(command)
        console.log("Deleted the image from cloud",response);
        
    } catch (error) {
        console.log("Error in delete the image from cloud",error);
    }


}
export default deleteFile