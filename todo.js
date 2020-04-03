console.log("fail ühendatud");

window.addEventListener('load', function () {
    loadFromFile();
})

class Entry{
    constructor(title, description, date){
        this.title = title;
        this.description = description;
        this.date = date;
        this.done = false;
    }
}

class toDo{

    constructor(){
        console.log("toDo sees");

        document.querySelector("#add").addEventListener("click", ()=>{this.addEntry()})

        this.entries = [];
    }

    addEntry(){
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue));

        console.log(this.entries);

        this.render();
    }

    render(){
        if(document.querySelector(".todo-list")){
            document.body.removeChild(document.querySelector(".todo-list"));
        }

        const ul = document.createElement("ul");
        ul.className = "todo-list";


        this.entries.forEach((entryValue, entryIndex)=>{
            const li = document.createElement("li");
            const removeButton = document.createElement("div");
            removeButton.setAttribute("id","delete_button");

            const checkButton = document.createElement("input");
            checkButton.setAttribute("id","check_button");
            checkButton.setAttribute("type","checkbox");

            const removeIcon = document.createTextNode("Eemalda");


            li.classList.add("entry");

            removeButton.addEventListener("click", ()=>{
                ul.removeChild(li);
                this.entries.splice(entryIndex, 1);
            });

            if(entryValue.done){
                li.classList.add("task-done");
            }

            li.addEventListener("click", (event)=>{
                event.target.classList.add("task-done");
                this.entries[entryIndex].done = true;
            });

            li.innerHTML = `<div id="text_box">
            <div id="list_title">${entryValue.title} </div>
            <div id="list_description">${entryValue.description} </div>
            <div id="list_date">${entryValue.date}</div></div>`;
            removeButton.appendChild(removeIcon);

            li.appendChild(removeButton);
            li.appendChild(checkButton);
            ul.appendChild(li);
        });

        document.body.appendChild(ul);
    }
}




const ToDo = new toDo();

function saveToFile(){
    $.post('server.php', {save: ToDo.entries}).done(function(){
        console.log(ToDo.entries);
        console.log('Success');
    }).fail(function(){
        alert('FAIL');
    }).always(function(){
        console.log('Tegime midagi AJAXiga');
    });
}


function GetSortOrder(prop) {
    return function(a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

function loadFromFile(){



    const sort_order = document.querySelector("#sort_order").value;
    //console.log();
    $.get('database.txt', function(data){
        let content = JSON.parse(data).content;
        console.log(content);
        ToDo.entries = [];
        //content.sort(GetSortOrder("title"));
        content.sort(GetSortOrder(sort_order));
        content.forEach(function(todo){

            ToDo.entries.push(new Entry(todo.title, todo.description, todo.date));
        });
        ToDo.render();
    })



}



$('#load').click(loadFromFile);
$('#save').click(saveToFile);
$('#add').click(ToDo.addEntry);

loadFromFile();