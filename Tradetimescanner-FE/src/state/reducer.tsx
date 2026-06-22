const user = localStorage.getItem(`UserData`);
const token = localStorage.getItem(`AuthToken`);
const showwizarState: string | null = localStorage.getItem("ShowWizard");

const userobj = JSON.parse(user ?? "{}");
const default_state = {
 
  config: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
  authuser: userobj,
  isloading: false,
  scandetails:{
    market:"",
    country:"",
    state:"",
    timezone:"",
    starttime:"",
    endtime:"",



  },
  strategyres:"",
  scanresult:{},
NextStep:()=>{},
PrevStep:()=>{}

 };

const reducer = (
  state: any = default_state,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case "set-config":
      return { ...state, config: action.payload };
 
    case "set-authuser":
      return { ...state, authuser: action.payload };
  
    case "set-loading":
      return { ...state, isloading: action.payload };
   
    case "set-loading":
      return { ...state, isloading: action.payload };
   
    case "set-scandetails":
      return { ...state, scandetails: action.payload };
   
   
    case "set-scanresult":
      return { ...state, scanresult: action.payload };
   
      case "set-strategy":
        return { ...state, strategyres: action.payload };
     
    case "set-nextaction":
      return { ...state, NextStep: action.payload };
   
    case "set-prevaction":
      return { ...state, PrevStep: action.payload };
   

    default:
      return { ...state };
  }
};

export { reducer };
