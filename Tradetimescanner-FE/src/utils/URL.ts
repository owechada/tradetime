//const productionURL ="http://localhost:3000/"
const productionURL = "https://app.tradetimescanner.com/"; //DO NOT TOUCH ⛔️

//✅
//const baseURL = "http://localhost:8000/";
const baseURL = "https://server.tradetimescanner.com/"; //live ✅

//✅
const captchakey = "6LdSI4sqAAAAAK4t_xBqBHJI-xfLqiWz2zTqp1J7"; //live ✅
//const captchakey = "6LfkJIsqAAAAAGpj7S4SWD5cER5SabTKPiyeGEzI"; //local
//✅

const stripe_PK_live =
  "pk_live_51NNEElGM2UhJC322RHwWVYkpF03qf8YooLmuDhxMnI6l29GvUSRTKEvptUU0v2iwvGXv7MhUDQl5Ee9H8Kby6cQS004VvAuEKG";
const stripe_PK_test =
  "pk_test_51NNEElGM2UhJC32234JWWO7iiacZAIKsvBGZIX8E9hs4I5H61FUjQqDdHppXFz8myrSh4AFCeoruvoWS0joYiz5x00chaJvq2j";
//✅
export const MontlyPaymentLink =
  "https://buy.stripe.com/eVq9ATbnNamsdAJ1U40Fi02";
export const YearlyPaymentLink =
  "https://buy.stripe.com/eVqaEXdvVams68h2Y80Fi03";
export const TestPaymentLink = "https://buy.stripe.com/test_4gwcOjfBF5bA8lGeUU";

export const CrptoPaymentLink ="https://buy.stripe.com/9B6aEXezZ0LSfIR7eo0Fi06";
//✅
export const TrialMontlyPaymentLink =
  "https://buy.stripe.com/3cIcN50J9bqw7cl0Q00Fi05"; // live free trial ✅
//export const TrialMontlyPaymentLink ="https://buy.stripe.com/test_cNi9AT1Nd0LS4090Q00Fi01"; //Test free trial
export { baseURL, captchakey, stripe_PK_live, stripe_PK_test, productionURL };
