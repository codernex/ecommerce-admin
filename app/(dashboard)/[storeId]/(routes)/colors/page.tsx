import {ColorClient} from "./components/client";
import prismadb from "@/lib/prismadb";
import * as date from 'date-fns'
import {SizesColumn} from "./components/columns";

const Colors=async ({params}:{params:{storeId:string}})=>{
    const colors= await prismadb.color.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    const formattedSizes:SizesColumn[]=colors.map((item)=>({id:item.id,name:item.name,value:item.value,createdAt: date.format(item.createdAt,"MMMM do, yyyy")}))
    return (
        <div className={'flex-col'}>
            <div className={'flex-1 space-y-4 p-8 pt-6'}>
                <ColorClient data={formattedSizes}/>
            </div>
        </div>
    )
}

export default Colors