/*******************************************************\
The following code was written to test if things will work out
\*******************************************************/

/*
const renderscreen = ()=>{
    let Html = "";
    for(let key in todoObj){
        let val = todoObj[key];
        if(val.tag!="del"){
            Html+=`
            <div class="nonThemed" id="todoContainer">
            <p id="todoTitle" class="centred">${val.title} </p>
            <button id="${key}" class="done themed round" onclick="deletetask(${key})"><i class="fas fa-check scale"></i></button>
        </div>
            `;
        }
    }
    document.getElementById('mainContent').innerHTML = Html;
};

const deletetask = (id) =>{
    todoObj[id].tag='del';
    renderscreen();
};

//the following inside window load listener
window.addEventListener("click", (event) => {
        if (event.target == document.getElementById("createModal")) {
            document.getElementById('createModal').style.visibility = 'hidden';
            document.getElementById('createTitle').value="";
            document.getElementById('createTag').value="";
        }
    });
    document.getElementById('createButton').addEventListener('click',(event)=>{
        if(document.getElementById('createTitle')==="" || document.getElementById('createTitle')==null ){
            document.getElementById('createModal').style.visibility = 'hidden';
            document.getElementById('createTitle').value="";
            document.getElementById('createTag').value="";
        }
        else{
            let currid = new Date().getTime();
            let tag = "notag"
            if(document.getElementById('createTag').value!=""){
                tag = document.getElementById('createTag').value;
            }
            todoObj[currid] = {title:document.getElementById('createTitle').value,tag:tag};
            renderscreen();
            document.getElementById('createModal').style.visibility = 'hidden';
            document.getElementById('createTitle').value="";
            document.getElementById('createTag').value="";
        }
    });
    document
        .getElementById("showCreateModal")
        .addEventListener("click", (event) => {
            document.getElementById("createModal").style.visibility = "visible";
        });
*/

/*******************************************************\
The following code ends here
\*******************************************************/



let obj = {};
if (localStorage.getItem("todoObj") == null) {
    register();
}
obj = JSON.stringify(localStorage.getItem("todoObj"));

// if((new Date().getTime()-parseInt(localStorage.getItem('lastSync')))>300000){

// }

// (function loadFromLocal(){
//     obj = Json.stringify(localStorage.getItem('lodoLists'));
// })();

// string->json = Json.parse()
// json->string = json.stringify();
// window.addEventListener('load',addbuttonaction);
// function addbuttonaction(){document.getElementById("addTodo").addEventListener("onclick", () => {
//     console.log("hello");
//     document.getElementById("modal").style.visibility = 'visible';
// });}

// working ask and recieve
// let ax = axios.create({
//     baseURL: "https://api.github.com/gists/",
//     headers: {
//         Authorization: "token ",
//     },
// });

// ax.get("mjyrfdhgcyjhgfivkuyhjgmgfdcjthgm")
//     .then((res) => {
//         let filename = Object.keys(res.data.files)[0];
//         obj = JSON.parse(res.data.files[filename].content);
//     })
//     .catch((err) => {
//         console.error(err);
//     });

//functions

//open modal
function callModal() {
    document.getElementById("modal").style.visibility = "visible";
    document.getElementById("inmodel").focus();
}

//to close modal
window.onclick = (e) => {
    if (e.target == document.getElementById("modal")) {
        resetModal();
    } else if (e.target == document.getElementById("register-modal")) {
        resetRegister();
    }
};

function resetModal(event) {
    document.getElementById("title-new").value = "";
    document.getElementById("modal").style.visibility = "hidden";
}

//function adds task to obj
function addtask() {
    let values = document.getElementById("title-new");
    if (values.value == "") return;
    obj[new Date().getTime()] = values.value;
    localStorage.setItem("todoObj", JSON.stringify(obj));
    let url = `/${localStorage.getItem("gistId")}`;
    let token = `token ${localStorage.getItem("gistToken")}`;
    axios
        .patch(`https://api.github.com/gists${url}`, {
            Authorization: token,
        })
        .then((res) => {
            console.debug(res);
        })
        .catch((err) => console.error(err));
    addtemplate();
    resetModal();
}

function addtemplate() {
    let str = "";
    for (i in obj) {
        str += `
        <header>
                <h2>${obj[i]} </h2><div><button id="${parseInt(
            i
        )}" class="button" onclick="deletetask(this)"><i class="fas fa-check"></i></button></div>
        </header>
        `;
    }
    document.getElementsByTagName("main")[0].innerHTML = str;
}

function deletetask(ele) {
    delete obj[`${parseInt(ele.id)}`];
    addtemplate();
}

function register() {
    let modal = document.getElementById("register-modal");
    modal.style.visibility = "visible";
}

function finishRegister() {
    let name = document.getElementById("registerName").value;
    let nameid = document.getElementById("registerGistId").value;
    let token = document.getElementById("registerGistToken").value;
    localStorage.setItem("username", name);
    localStorage.setItem("gistId", nameid);
    localStorage.setItem("gistToken", token);
    addObjToLocal();
    resetRegister();
}

function addObjToLocal() {
    let url = `/${localStorage.getItem("gistId")}`;
    let token = `token ${localStorage.getItem("gistToken")}`;
    axios
        .get(`https://api.github.com/gists${url}`, {
            Authorization: `${token}`,
        })
        .then((res) => {
            console.log(res);
            let filename = Object.keys(res.data.files)[0];
            let content = res.data.files[filename].content;
            localStorage.setItem("todoObj", content);
            obj = JSON.parse(content);
        })
        .catch((err) => console.error(err));
}

function resetRegister() {
    document.getElementById("register-modal").style.visibility = "hidden";
    document.getElementById("registerName").value = "";
    document.getElementById("registerGistId").value = "";
    document.getElementById("registerGistToken").value = "";
}
