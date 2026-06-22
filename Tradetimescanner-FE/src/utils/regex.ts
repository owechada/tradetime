const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const numReg = /^[0-9]+$/
const textReg = /^[a-zA-Z\s]+$/
const passwordReg = /^(?=.*\d)(?=.*[a-zA-Z]).*$/
const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
const urlregex =/^(https?:\/\/)?(www\.)?([a-zA-Z0-9_-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/
const LocalNumberRegex = /^\d{1,3}(,\d{3})*$/;


export { emailReg,LocalNumberRegex, textReg, numReg,urlregex, addressRegex, passwordReg }