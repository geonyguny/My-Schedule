readTodo();

async function readTodo(){
    // 토큰이 없으면 return
    const token = localStorage.getItem("x-access-token");
    if(!token){
        return;
    }

    // 일정 조회 API 호출하기
    const config = {
        method: "get",
        url: url+"/todo",
        headers: {"x-access-token": token},
    };

    try{
        const res = await axios(config);
        if (res.data.code !==200){
            alert(res.data.message);
            return false;
        }

        const todoDataSet = res.data.result;
        console.log(todoDataSet);

        for(let section in todoDataSet){
            // 각 세션에 해당하는 ul태그 선택
            const sectionUl = document.querySelector(`#${section} ul`);
            // 각 세션에 해당하는 데이터
            const arrayForEachSection = todoDataSet[section];

            let result = "";
            for(let todo of arrayForEachSection){
                let element = `
                <li class="list-item" id=${todo.todoIdx}>
                    <div class="done-text-container">
                        <input type="checkbox" class="todo-done" ${
                            todo.status === "C" ? "checked" : ""
                        } />
                        <p class="todo-text">
                            ${todo.contents}
                        </p>
                    </div>
                    <div class="update-delete-container">
                        <i class="fa-solid fa-pencil"></i>
                        <i class="fa-solid fa-trash"></i>
                    </div>
                    </li>
                    `;
                    result += element;
            }
            sectionUl.innerHTML = result;
        }
    }catch(err){
        console.error(err);
    }
}

//일정 CUD
const matrixContainer = document.querySelector(".matrix-container");
matrixContainer.addEventListener("keypress", cudController);
matrixContainer.addEventListener("click", cudController);

function cudController(event){
    const token = localStorage.getItem("x-access-token");
    if(!token){
        return;
    }


const target = event.target;
const targetTagName = target.tagName;
const eventType = event.type;
const key = event.key;

console.log(target,targetTagName,eventType,key);

// create 이벤트 처리
if (targetTagName === "INPUT" && key === "Enter"){
    createTodo(event, token);
    return;
}

// update 이벤트 처리

// 체크박스 업데이트
if (target.className == "todo-done" && eventType === "click"){
    updateTodoDone(event, token);
    return;
}

// 컨텐츠 업데이트
const firstClassName = target.className.split(" ")[0];
if(firstClassName === "todo-update" && eventType === "click"){
    updateTodoContents(event, token);
    return;
}

// delete 이벤트 처리
if(firstClassName === "todo-delete" && eventType === "click"){
    deleteTodo(event,token);
    return;
}


async function createTodo(){
    const contents = event.target.value;
    const type = event.target.closest(".matrix-item").id;
    
    if(!contents){
        alert("내용을 입력해주세요");
        return;
    }

    const config = {
        method: "post",
        url: url+"/todo",
        headers: {"x-access-token": token},
        data:{
            contents:contents,
            type:type,
        },
    };

    try{
        const res = await axios(config);
        
        if (res.data.code !==200){
            alert(res.data.message);
            return false;
        }

        // DOM 업데이트
        readTodo();
        event.target.value ="";
        return true;
    } catch(err){
        console.error(err);
        return false;
    }
}

async function updateTodo(event, token){
    const status = event.target.checked ? "C" : "A";
    const todoIdx = event.target.closest(".list-item").id;
    
    if(!contents){
        alert("내용을 입력해주세요");
        return;
    }

    const config = {
        method: "patch",
        url: url+"/todo",
        headers: {"x-access-token": token},
        data:{
            todoIdx: todoIdx,
            status: status,
        },
    };

    try{
        const res = await axios(config);
        
        if (res.data.code !==200){
            alert(res.data.message);
            return false;
        }

        // DOM 업데이트
        readTodo();
        event.target.value ="";
        return true;
    } catch(err){
        console.error(err);
        return false;
    }
}

async function updateTodoContents(event, token){
    const contents = prompt("내용을 입력해주세요.");
    const todoIdx = event.target.closest(".list-item").id;
    
    if(!contents){
        alert("내용을 입력해주세요");
        return;
    }

    const config = {
        method: "patch",
        url: url+"/todo",
        headers: {"x-access-token": token},
        data:{
            todoIdx: todoIdx,
            contents: contents,
        },
    };

    try{
        const res = await axios(config);
        if (res.data.code !==200){
            alert(res.data.message);
            return false;
        }

    // DOM 업데이트
    readTodo();
    } catch(err){
        console.error(err);
        return false;
    }
}

async function deleteTodo(event, token){
    const isValidReq = confirm(
        "삭제하시겠습니까? 삭제 후에는 복구가 어렵습니다."
    );

    if(!isValidReq){
        return false;
    }

    const todoIdx = event.target.closest(".list-item").id;
    
    const config = {
        method: "delete",
        url: url+ "/todo/" + todoIdx,
        headers: {"x-access-token": token},
    };

    try{
        const res = await axios(config);
        
        if (res.data.code !==200){
            alert(res.data.message);
            return false;
        }

        // DOM 업데이트
        readTodo();
        event.target.value ="";
        return true;
    } catch(err){
        console.error(err);
        return false;
    }
}
}