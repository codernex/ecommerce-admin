import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function POST(req:Request,{params}:{params:{storeId:string}}){
    try {
        const {userId}=auth()
        const {name,billboardId}= await  req.json()
        if(!name){
            return new NextResponse("Category Name is Required",{status:400})
        }
        if(!billboardId){
            return new NextResponse("Billboard ID is Required",{status:400})
        }
        if(!userId){
            return   new NextResponse("Unauthenticated",{status:401})
        }
        if(!params.storeId){
            return  new NextResponse("Store ID Not Found",{status:404})
        }

        const storeByCurrentUser= await prismadb.store.findFirst({
            where:{
                userId,
                id:params.storeId
            }
        })

        if(!storeByCurrentUser){
            return new NextResponse("Unauthorized",{status:403})
        }

        const billboard= await prismadb.category.create({
            data:{
                name,
                store:{
                    connect:{
                        id:storeByCurrentUser.id
                    }
                },
                billboard: {
                    connect: {
                        id:billboardId
                    }
                }
            }
        })

        return NextResponse.json(billboard)
    }catch (e) {
        console.log('STORE_POST',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function GET(req:Request,{params}:{params:{storeId:string}}){
    try {

        if(!params.storeId){
            return  new NextResponse("Store ID Not Found",{status:404})
        }


        const category= await prismadb.category.findMany({
            where:{
                storeId:params.storeId
            }
        })

        return NextResponse.json(category)
    }catch (e) {
        console.log('STORE_POST',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

