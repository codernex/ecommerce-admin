import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(req:Request,{params}:{params:{colorId:string}}){
    try {


        if(!params.colorId){
            return new NextResponse('Color Id Required',{status:400})
        }


        const billboard= await prismadb.color.findUnique({
            where:{
                id: params.colorId
            }
        })
        return NextResponse.json(billboard)

    }catch (e) {
        console.log('COLOR_GET',e)
        return new NextResponse("Internal Error",{status:500})
    }
}
export async function PATCH(req:Request,{params}:{params:{colorId:string,storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        const {name,value}= await req.json()

        if(!name){
            return new NextResponse('Color Name is required',{status:400})
        }

        if(!value){
            return new NextResponse('Color Value is required',{status:400})
        }
        if(!params.colorId){
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
        const billboard= await prismadb.color.updateMany({
            where:{
                id:params.colorId,
                storeId:storeByCurrentUser.id
            },
            data:{
                name,
                value
            }
        })


        return NextResponse.json(billboard)

    }catch (e) {
        console.log('COLORS_UPDATE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{colorId:string,storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.colorId){
            return new NextResponse('Color Id Required',{status:400})
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

        const billboard= await prismadb.color.deleteMany({
            where:{
                id: params.colorId,
                storeId: storeByCurrentUser.id
            }
        })
        return NextResponse.json(billboard)

    }catch (e) {
        console.log('COLORS_DELETE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}