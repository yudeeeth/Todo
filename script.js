//global todoobject that holds all info
let todoObj = {};
let GistId;
let GistToken;
let url = "https://api.github.com/gists/";

window.addEventListener("load", (event) => {
    //adding event listeners
    window.addEventListener("click", (event) => {
        if (event.target == document.getElementById("createModal")) {
            hideModal("createModal");
        } else if (event.target == document.getElementById("registerModal")) {
            hideModal("registerModal");
        }
    });
    document
        .getElementById("showCreateModal")
        .addEventListener("click", (event) => {
            document.getElementById("createModal").style.visibility = "visible";
        });
    document.getElementById("createButton").addEventListener("click", () => {
        addToObj();
        hideModal("createModal");
    });
    document.getElementById("registerButton").addEventListener("click", () => {
        register();
        hideModal("registerModal");
    });

    // setup
    if (localStorage.getItem("todoObj") == null) {
        //setlastUpdate in registerItelf
        document.getElementById("registerModal").style.visibility = "visible";
    } else {
        GistId = localStorage.getItem("GistId");
        GistToken = localStorage.getItem("GistToken");
        getData();
    }
});

const hideModal = (id) => {
    document.getElementById(id).style.visibility = "hidden";
    if (id == "createModal") {
        document.getElementById("createTitle").value = "";
        document.getElementById("createTag").value = "";
    } else {
        document.getElementById("registerUsername").value = "";
        document.getElementById("registerGistId").value = "";
        document.getElementById("registerGistToken").value = "";
    }
};
//sync will update screen alwaystodoObj") == null
const sync = (destination) => {
    //debug
    if (destination == "local") {
        localStorage.setItem("todoObj", `${JSON.stringify(todoObj)}`);
        // localStorage.setItem("lastSync", `${new Date().getTime()}`);
    } else {
        let Filename = localStorage.getItem("filename");
        console.debug(Filename);
        axios
            .patch(
                `${url}${GistId}`,
                {
                    files: {
                        [Filename]: {
                            content: JSON.stringify(todoObj),
                        },
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${GistToken}`,
                    },
                }
            )
            .then((res) => {
                console.debug(res);
                console.debug("successsssssssss");
            })
            .catch((err) => {
                console.error(err);
            });
    }
    console.log(destination);
};
// display the todos from todoobj in screen inside main
const renderTodo = () => {
    let htmlToAdd = "";
    for (let key in todoObj) {
        let val = todoObj[key];
        if (val.tag != "deleted") {
            htmlToAdd += `
            <div class="nonThemed" id="todoContainer">
                <p id="todoTitle" class="centred">${val.title} </p>
                <button id="${key}" class="done themed round" onclick="deleteTodo(${key})"><i class="fas fa-check scale"></i></button>
            </div>
            `;
        }
    }
    document.getElementById("mainContent").innerHTML = htmlToAdd;
};
//basically change tag to deleted
const deleteTodo = (id) => {
    // if(todoObj[id].tag=="deleted"){
    //     delete todoObj[id];
    // }
    // else
    todoObj[id].tag = "deleted";
    sync("local");
    sync("remote");
    renderTodo();
};
// registers the user with gist id and gist token
const register = () => {
    let username = document.getElementById("registerUsername").value;
    GistId = document.getElementById("registerGistId").value;
    GistToken = document.getElementById("registerGistToken").value;
    // validate step here
    localStorage.setItem("username", username);
    localStorage.setItem("GistId", GistId);
    localStorage.setItem("GistToken", GistToken);
    localStorage.setItem("lastSync", `${new Date().getTime()}`);
    //simulate request
    getData();
};
//gets data from remote and syncs with local
const getData = () => {
    axios
        .get(`${url}${GistId}`, {
            params: {
                t: new Date().getTime(),
            },
            headers:{
                Authorization: `token ${GistToken}`
            }
        })
        .then((res) => {
            console.debug(res);
            //assing res to todoObj
            let Filename = Object.keys(res.data.files)[0];
            localStorage.setItem("filename", Filename);
            todoObj = JSON.parse(res.data.files[Filename].content);
            sync("local");
            renderTodo();
        })
        .catch((err) => {
            console.error(err);
        });
};
//adds the task to obj and syncs with remote and local
const addToObj = () => {
    let title = document.getElementById("createTitle").value;
    if (title == "" || title == null || title == undefined) {
        hideModal("createModal");
    }
    let tag = document.getElementById("createTag").value;
    if (tag == "" || tag == null || tag == undefined) {
        tag = "notag";
    }
    let currid = new Date().getTime();
    todoObj[currid] = { title, tag };
    // sync to local and remote
    sync("local");
    sync("remote");
    //render screen
    renderTodo();
};
