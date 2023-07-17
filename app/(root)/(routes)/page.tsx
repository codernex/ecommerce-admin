"use client"

import {UserButton} from "@clerk/nextjs";
import {useStoreModal} from "@/hooks/use-store-modal";
import {useEffect, useState} from "react";


const SetupPage=()=>{
    const onOpen=useStoreModal(state=>state.onOpen)
    const isOpen=useStoreModal(state=>state.isOpen)

    useEffect(()=>{
        if(!isOpen){
            onOpen()
        }
    },[isOpen,onOpen])


    return(
        <div>
            <UserButton afterSignOutUrl={'/'}/>
        </div>
    )
}

export default SetupPage