import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function POST(req:Request){
    try {
        const {userId}=auth()
        const {name}= await  req.json()
        if(!name){
            return new NextResponse("Name is Required",{status:400})
        }
        if(!userId){
          return   new NextResponse("Unauthorized",{status:401})
        }
        const store= await prismadb.store.create({
            data:{
                name,
                userId
            }
        })

        return NextResponse.json(store)
    }catch (e) {
        console.log('STORE_POST',e)
        return new NextResponse("Internal Error",{status:500})
    }
}

