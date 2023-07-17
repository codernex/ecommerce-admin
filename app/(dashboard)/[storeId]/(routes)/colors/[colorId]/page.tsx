import prismadb from "@/lib/prismadb";
import {ColorForm} from "./components/color-form";

const Billboard=async ({params}:{params:{colorId:string}})=>{
    const size= await prismadb.color.findFirst({
        where:{
            id:params?.colorId
        }
    })

    return(
        <div className={'flex-col'}>
           <div className={'flex-1 space-y-4 p-8 pt-6'}>
                    <ColorForm initialData={size}/>
           </div>
        </div>
    )
}

export default Billboard