const indexDao = require("../dao/indexDao");

exports.createTodo = async function(req,res){
    const {userIdx} = req.verifiedToken;
    const{contents,type} = req.body;
    
    if(!userIdx||!contents||!type){
        return res.send({
            isSuccess:false,
            code:400,
            message:"생성할 입력값이 누락됐습니다."
        });
    }

    // contents 20글자 초과 불가
    if (contents.length > 20){
        return res.send({
            isSuccess:false,
            code:401,
            message:"생성할 컨텐츠는 20글자 이하로 설정해주세요."
        });
    }


    // type : do, decide, delete, delegate
    const validTypes = ["do","decide","delegate","delete"];
    if(!validTypes.includes(type)){
        return res.send({
            isSuccess:false,
            code:402,
            message:"생성할 유효한 타입이 아닙니다.",
        });
    }

    const insertTodoRow = await indexDao.insertTodo(userIdx,contents,type);
    
    if(!insertTodoRow){
        return res.send({
            isSuccess:false,
            code:403,
            message:"생성 요청에 실패했습니다. 관리자에게 문의해주세요",
        });
    }

    return res.send({
        isSuccess:true,
        code:200,
        message:"일정 생성 성공",
    });
};

exports.readTodo = async function(req,res){
    const {userIdx}= req.verifiedToken;
    const todo = {};
    const types =["do","decide","delegate","delete"];

    for (let type of types){
        let selectTodoByTypeRows = await indexDao.selectTodoByType(userIdx,type);

        if(!selectTodoByTypeRows){
            return res.send({
                isSuccess:false,
                code:404,
                message:"일정 조회 실패, 관리자에게 문의해주세요",
            });
        }
        todo[type] = selectTodoByTypeRows;
    }

    return res.send({
        result:todo,
        isSuccess:true,
        code:201,
        message:"일정 조회 성공",
    });
}

// todo 수정
exports.updateTodo = async function(req,res){
    const {userIdx} = req.verifiedToken;
    let {todoIdx, contents,status} = req.body;

    if(!userIdx || !todoIdx){
        return res.send({
            isSuccess:false,
            code:405,
            message:"수정할 userIdx와 todoIdx를 보내주세요",
        });
    }

    if(!contents){
        contents = null;
    }

    if(!status){
        status = null;
    }
    
    const isVaildTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);
    if(isVaildTodoRow.length<1){
        return res.send({
            isSuccess:false,
            code:406,
            message:"수정을 위한 유효한 요청이 아닙니다. userIdx와 todoIdx를 확인하세요",
        });
    }
    const updateTodoRow = await indexDao.updateTodo(
        userIdx,
        todoIdx,
        contents,
        status
    );
    if (!updateTodoRow) {
        return res.send({
          isSuccess: false,
          code: 407,
          message: "수정 실패. 관리자에게 문의해주세요.",
        });
      }
    
      return res.send({
        isSuccess: true,
        code: 202,
        message: "수정 성공",
      });
};

// todo 삭제
exports.deleteTodo = async function(req,res){
    const {userIdx} = req.verifiedToken;
    const {todoIdx} = req.params;

    if(!userIdx || !todoIdx){
        return res.send({
            isSuccess:false,
            code:408,
            message:"삭제할 userIdx와 todoIdx를 입력해주세요",
        });
    }
   
    const isVaildTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);
    if(isVaildTodoRow.length<1){
        return res.send({
            isSuccess:false,
            code:409,
            message:"삭제를 위한 유효한 요청이 아닙니다. userIdx와 todoIdx를 확인하세요",
        });
    }
    const deleteTodoRow = await indexDao.deleteTodo(userIdx,todoIdx);
    if (!deleteTodoRow) {
        return res.send({
          isSuccess: false,
          code: 410,
          message: "삭제 실패, 관리자에게 문의해주세요.",
        });
      }
    
      return res.send({
        isSuccess: true,
        code: 203,
        message: "삭제 성공",
      });
};