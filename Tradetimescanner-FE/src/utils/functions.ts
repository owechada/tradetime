const ispremuser=(authuser:any) :boolean =>{


    if (authuser.exp_date == "NULL" || authuser.subscription_id=="NULL") {
        return(false);
      } 
      
      
      else {
        var today = new Date();
        var expirydate = new Date(authuser.exp_date);
        if (expirydate.getTime() <= today.getTime()) {
          return(false);
        } else {
          return(true);
        }
    
      }
    
  
}
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
export{ispremuser, isSameDay}