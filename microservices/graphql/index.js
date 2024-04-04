import API from "./API"

(async ()=>{
    try{
     await API.init();
    } catch(e) {
        console.log(e)
    }
})()