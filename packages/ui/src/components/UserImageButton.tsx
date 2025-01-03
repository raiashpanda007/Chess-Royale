"use client" 
import React,{useEffect, useState} from "react";
import { useSession } from "next-auth/react";
import { Person } from "@mui/icons-material";
const UserImageButton: React.FC = () => {
    const [image,setimage] = useState<string>('');
    const {data:session,status} = useSession();
    useEffect(() => {
        if(session?.user?.image){
            setimage(session.user.image);
        }
    },[session]);
    return (
        <>
        { image ? (
                <div className="flex items-center justify-center h-10 w-10 border border-white mr-2 rounded-full">
                    <img src={image} alt="profile" className="w-8 h-8 rounded-full"/>
                </div>
            ):(
                <div className="flex items-center justify-center h-10 w-10 border border-white rounded-full mr-2">
                    <Person className="h-9 w-9"/>
                </div>
            )
        }
        </>
    )
}
export default UserImageButton;

