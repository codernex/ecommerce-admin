import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(req:Request,{params}:{params:{billboardId:string}}){
    try {


        if(!params.billboardId){
            return new NextResponse('Billboard Id Required',{status:400})
        }


        const billboard= await prismadb.billboard.findUnique({
            where:{
                id: params.billboardId
            }
        })
        return NextResponse.json(billboard)

    }catch (e) {
        console.log('BILLBOARDS_GET',e)
        return new NextResponse("Internal Error",{status:500})
    }
}
export async function PATCH(req:Request,{params}:{params:{billboardId:string,storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        const {label,imageUrl}= await req.json()

        if(!label){
            return new NextResponse('Label is required',{status:400})
        }

        if(!imageUrl){
            return new NextResponse('ImageURL is required',{status:400})
        }
        if(!params.billboardId){
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
        const billboard= await prismadb.billboard.updateMany({
            where:{
                id:params.billboardId,
                storeId:storeByCurrentUser.id
            },
            data:{
                label,
                imageUrl
            }
        })


        return NextResponse.json(billboard)

    }catch (e) {
        console.log('BILLBOARDS_UPDATE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{billboardId:string,storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.billboardId){
            return new NextResponse('Billboard Id Required',{status:400})
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

        const billboard= await prismadb.billboard.deleteMany({
            where:{
                id: params.billboardId,
                storeId: storeByCurrentUser.id
            }
        })
        return NextResponse.json(billboard)

    }catch (e) {
        console.log('BILLBOARDS_DELETE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}