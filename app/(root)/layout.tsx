import {auth, redirectToSignIn} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import {store} from "next/dist/build/output/store";
import {redirect} from "next/navigation";

export default async function SetupLayout({children}:React.PropsWithChildren){
    const {userId}=auth()

    if(!userId){
       return  redirectToSignIn()
    }

    const store=await prismadb.store.findFirst({
        where:{
            userId
        }
    })
    if(store){
        return redirect(`/${store.id}`)
    }
    return(
        <div>
            {
                children
            }
        </div>
    )
}