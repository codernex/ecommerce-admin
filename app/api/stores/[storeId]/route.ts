import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function PATCH(req:Request,{params}:{params:{storeId:string}}){
    try {
    const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        const {name}= await req.json()

        if(!name){
            return new NextResponse('Name is required',{status:400})
        }

        if(!params.storeId){
            return new NextResponse('Store Id Required',{status:400})
        }

        const store= await prismadb.store.updateMany({
            where:{
                userId,
                id:params.storeId
            },
            data:{
                name
            }
        })
        return NextResponse.json(store)

    }catch (e) {
        console.log('STORE_UPDATE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.storeId){
            return new NextResponse('Store Id Required',{status:400})
        }

        const store= await prismadb.store.deleteMany({
            where:{
                id:params.storeId,
                userId
            }
        })
        return NextResponse.json(store)

    }catch (e) {
        console.log('STORE_DELETE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}