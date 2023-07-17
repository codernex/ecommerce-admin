import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function POST(req:Request,{params}:{params:{storeId:string}}){
    try {
        const {userId}=auth()
        const {name,value}= await  req.json()
        if(!name){
            return new NextResponse("Size  is Required",{status:400})
        }
        if(!value){
            return new NextResponse("Color Value is Required",{status:400})
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

        const billboard= await prismadb.color.create({
            data:{
                name,
                value,
                store:{
                    connect:{
                        id:storeByCurrentUser.id
                    }
                }
            }
        })

        return NextResponse.json(billboard)
    }catch (e) {
        console.log('Colors_POST',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function GET(req:Request,{params}:{params:{storeId:string}}){
    try {

        if(!params.storeId){
            return  new NextResponse("Store ID Not Found",{status:404})
        }


        const billboard= await prismadb.color.findMany({
            where:{
                storeId:params.storeId
            }
        })

        return NextResponse.json(billboard)
    }catch (e) {
        console.log('Color_GET',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

