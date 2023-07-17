import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import {tr} from "date-fns/locale";


export async function POST(req:Request,{params}:{params:{storeId:string}}){
    try {
        const {userId}=auth()
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

        const product= await prismadb.product.create({
            data:{
                name,
                price,
                colorId,
                categoryId,
                storeId: storeByCurrentUser.id,
                isFeatured,
                isArchived,
                sizeId,
                images:{
                    createMany:{
                        data:[...images.map((image:{url:string})=>image)]
                    }
                }
            }
        })

        return NextResponse.json(product)
    }catch (e) {
        console.log('STORE_POST',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function GET(req:Request,{params}:{params:{storeId:string}}){
    try {
        const {searchParams}=new URL(req.url)

        const categoryId= searchParams.get('categoryId')||undefined;
        const sizeId=searchParams.get('sizeId')||undefined
        const colorId = searchParams.get('colorId')||undefined
        const isFeatured= searchParams.get('isFeatured')


        if(!params.storeId){
            return  new NextResponse("Store ID Not Found",{status:404})
        }


        const products= await prismadb.product.findMany({
            where:{
                storeId:params.storeId,
                categoryId,
                colorId,sizeId,isFeatured:isFeatured?true:undefined,isArchived: false
            },
            include:{
                images: true,
                category:true,
                size:true,
                color:true
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        return NextResponse.json(products)
    }catch (e) {
        console.log('STORE_POST',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

