import { useState } from "react"



interface roleDTO{
    name:string;
    code:any;
}
const usePickerhook=()=>{

var [pickedRole, setPickedRole]=useState<roleDTO> ({name:"",code:""})



    return {pickedRole,setPickedRole}
}

export {usePickerhook}