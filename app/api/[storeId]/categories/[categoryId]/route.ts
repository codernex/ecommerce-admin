import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(req:Request,{params}:{params:{categoryId:string}}){
    try {


        if(!params.categoryId){
            return new NextResponse('Billboard Id Required',{status:400})
        }


        const category= await prismadb.category.findUnique({
            where:{
                id: params.categoryId
            },
            include:{
                billboard:true
            }
        })
        return NextResponse.json(category)

    }catch (e) {
        console.log('CATEGORY_GET',e)
        return new NextResponse("Internal Error",{status:500})
    }
}
export async function PATCH(req:Request,{params}:{params:{categoryId:string,storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        const {name,billboardId}= await req.json()

        if(!name){
            return new NextResponse('Category Name is required',{status:400})
        }

        if(!billboardId){
            return new NextResponse('Billboard Id is required',{status:400})
        }
        if(!params.categoryId){
            return new NextResponse('Category Id Required',{status:400})
        }

        if(!params.storeId){
            return new NextResponse("Store Id is required",{status:400})
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
        const billboard= await prismadb.category.updateMany({
            where:{
                id:params.categoryId,
                storeId:storeByCurrentUser.id
            },
            data:{
                name:name,
                billboardId:billboardId
            }
        })


        return NextResponse.json(billboard)

    }catch (e) {
        console.log('CATEGORY_UPDATE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{categoryId:string,storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.categoryId){
            return new NextResponse('Category Id Id Required',{status:400})
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

        const billboard= await prismadb.category.deleteMany({
            where:{
                id: params.categoryId,
                storeId: storeByCurrentUser.id
            }
        })
        return NextResponse.json(billboard)

    }catch (e) {
        console.log('CATEGORY_DELETE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}