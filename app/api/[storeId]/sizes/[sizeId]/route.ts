import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(req:Request,{params}:{params:{sizeId:string}}){
    try {


        if(!params.sizeId){
            return new NextResponse('Billboard Id Required',{status:400})
        }


        const billboard= await prismadb.size.findUnique({
            where:{
                id: params.sizeId
            }
        })
        return NextResponse.json(billboard)

    }catch (e) {
        console.log('SIZE_GET',e)
        return new NextResponse("Internal Error",{status:500})
    }
}
export async function PATCH(req:Request,{params}:{params:{sizeId:string,storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        const {name,value}= await req.json()

        if(!name){
            return new NextResponse('Size Name is required',{status:400})
        }

        if(!value){
            return new NextResponse('Size Value is required',{status:400})
        }
        if(!params.sizeId){
            return new NextResponse('Store Id Required',{status:400})
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
        const billboard= await prismadb.size.updateMany({
            where:{
                id:params.sizeId,
                storeId:storeByCurrentUser.id
            },
            data:{
                name,
                value
            }
        })


        return NextResponse.json(billboard)

    }catch (e) {
        console.log('SIZES_UPDATE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{sizeId:string,storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.sizeId){
            return new NextResponse('Size Id Required',{status:400})
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

        const billboard= await prismadb.size.deleteMany({
            where:{
                id: params.sizeId,
                storeId: storeByCurrentUser.id
            }
        })
        return NextResponse.json(billboard)

    }catch (e) {
        console.log('SIZES_DELETE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}