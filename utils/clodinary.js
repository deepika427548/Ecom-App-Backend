import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({path:'backend/config/config.env'})

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    cloud_name:process.env.CLOUDINARY_API_KEY,
    cloud_name:process.env.CLOUDINARY_SECRET_KEY,
    
})

export const upload_file=(file,folder)=>{
    return new Promise((resolve,reject)=>{
        cloudinary.v2.uploader(
            file,
            (result)=>{
                resolve({
                    public_id:result.public_id,
                    url:result.url,
                })
            },
            {
                resource_type:"auto",
                folder,
            }
        )
    })
}


export const delete_file=async(file)=>{
    const res=await cloudinary.uploader.destroy(file)

    if(res?.result==="ok") return true;
}