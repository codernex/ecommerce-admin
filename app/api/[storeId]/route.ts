import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";


export async function GET(req:Request,{params}:{
    params:{storeId:string}
}){
    if(!params.storeId){
        return new NextResponse("Store ID Not Found",{status:404})
    }

    const store= await prismadb.store.findFirst({
        where:{
            id:params.storeId
        }
    })
    return NextResponse.json(store)
}