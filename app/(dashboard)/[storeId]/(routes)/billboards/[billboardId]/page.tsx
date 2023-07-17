import prismadb from "@/lib/prismadb";
import {BillboardsForm} from "./components/BillboardForm";

const Billboard=async ({params}:{params:{billboardId:string}})=>{
    console.log(params.billboardId)
    const billboard= await prismadb.billboard.findFirst({
        where:{
            id:params?.billboardId
        }
    })

    return(
        <div className={'flex-col'}>
           <div className={'flex-1 space-y-4 p-8 pt-6'}>
                    <BillboardsForm initialData={billboard}/>
           </div>
        </div>
    )
}

export default Billboard