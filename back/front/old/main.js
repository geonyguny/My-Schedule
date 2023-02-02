async function dummy(){
        try{
            const res = await axios({
                method: "post",
                url: "http://127.0.0.1:3000/sign-in",
                headers: {},
                data: {email:"test@naver.com",password:"aaaa1111"},
            });    
            console.log(res);
        } catch(err){
            console.error(err);	
    }
};

dummy();