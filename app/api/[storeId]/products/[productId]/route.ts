import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import {tr} from "date-fns/locale";

export async function GET(req:Request,{params}:{params:{productId:string}}){
    try {


        if(!params.productId){
            return new NextResponse('Product Id Required',{status:400})
        }


        const product= await prismadb.product.findUnique({
            where:{
                id: params.productId
            },
            include:{
                images:true,
                category:true,
                size:true,
                color:true
            }
        })
        return NextResponse.json(product)

    }catch (e) {
        console.log('Products_GET',e)
        return new NextResponse("Internal Error",{status:500})
    }
}
export async function PATCH(req:Request,{params}:{params:{productId:string,storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        const {name,colorId,sizeId,categoryId,price,images,isFeatured,isArchived}= await  req.json()

        if(!images||!images.length){
            return new NextResponse("Images are required",{status:400})
        }

        if(!name){
            return new NextResponse("Product name is Required",{status:400})
        }
        if(!colorId){
            return new NextResponse("Product Color is Required",{status:400})
        }
        if(!sizeId){
            return new NextResponse("Product Size is Required",{status:400})
        }
        if(!categoryId){
            return new NextResponse("Product Category is Required",{status:400})
        }
        if(!price){
            return new NextResponse("Product price is Required",{status:400})
        }

        if(!params.productId){
            return new NextResponse("Product Id is Required",{status:400})
        }

        if(!params.storeId){
            return new NextResponse("Store Id is Required",{status:400})
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
        await prismadb.product.update({
            where:{
                id:params.productId
            },
            data:{
                name,
                colorId,
                sizeId,
                categoryId,
                isFeatured,isArchived,
                images:{
                    deleteMany:{}
                }
            }
        })

        const product= await prismadb.product.update({
            where:{
                id:params.productId
            },
            data:{
                images:{
                    createMany:{
                        data:[...images.map((image:{url:string})=>image)]
                    }
                }
            }
        })


        return NextResponse.json(product)

    }catch (e) {
        console.log('PRODUCT_UPDATE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{productId:string,storeId:string}}){
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.productId){
            return new NextResponse('Product Id Required',{status:400})
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

        const product= await prismadb.product.delete({
            where:{
                id: params.productId
            }
        })
        return NextResponse.json(product)

    }catch (e) {
        console.log('PRODUCTS_DELETE',e)
        return new NextResponse("Internal Error",{status:500})
    }
}