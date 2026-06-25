const form = document.querySelector('form')
const display = document.querySelector('.display-task-cards')
const tasksCount = document.querySelector('.tasks-count')
const completedTasksCount = document.querySelector('.completed-tasks-count')
const pendingTasksCount = document.querySelector('.pending-tasks-count')
const countTask = document.querySelector('.countTask');
const search = document.querySelector('#search');
const category = document.querySelector('#filter-cat');
const clearAll = document.querySelector('.clear-all-button');
const overlay = document.querySelector('.overlay')
const cancel = document.querySelector('.cancel')
const clear_all_btn = document.querySelector('.clear-all')
// theme toggle
const theme_toggle = document.querySelector('.theme-toggle')
let root = document.documentElement;

root.setAttribute("data-theme","dark")

theme_toggle.addEventListener('click',(e)=>{
    const theme = root.getAttribute("data-theme");
    if(theme=="light"){
        root.setAttribute("data-theme","dark");
        theme_toggle.innerHTML = `<i class="ri-sun-fill"></i>`
    }
    else{
        root.setAttribute("data-theme","light");
        theme_toggle.innerHTML = `<i class="ri-moon-fill"></i>`
    }

    // root.classList.toggle("light")
})






// get tasks from localStorange
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const renderUI = (tasks)=>{
        display.innerHTML = "";
        if(!tasks) return
        tasks.forEach(task => {
            display.innerHTML +=
             `
                <div class="task-card" data-id="${task.id}" data-status="${task.status}" data-category="${task.category}">
                    <div class="task-check">
${task.status.toLowerCase()=="pending" ? `<i class="ri-checkbox-blank-circle-line status"></i>` : `<i class="ri-checkbox-circle-fill status"></i>`}
                    </div>

                    <div class="task-mid">
                        <p class="task-name">${task.title}</p>
                        <div>
                            <span class="task-category">${task.category}</span>
                            <span class="task-time">${task.date}</span>
                            <span class="task-status-2 ${task.status.toLowerCase()=="pending" ? `pending` : `completed`}">• ${task.status}</span>
                        </div>
                    </div>

                    <div class="task-end">
                        <i class="ri-edit-box-line edit"></i>
                        <i class="ri-delete-bin-line delete"></i>
                    </div>
                </div>
            `
        });
        countTask.innerText = tasks.length;
}
const countTasks = ()=>{
    let totalTasks = 0 , tasksDone = 0 , tasksRemaining = 0;
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach((elem)=>{
        totalTasks++;
        if(elem.status.toLowerCase()=="pending") tasksRemaining++;
        else tasksDone++;
    })
    tasksCount.innerText = totalTasks;
    completedTasksCount.innerText = tasksDone;
    pendingTasksCount.innerText = tasksRemaining;
}
const inputChange = (e)=>{
    let text = e.target.value;
    if(text=="") return;
    let grandParent = e.target.closest('.task-card');
    let taskId = grandParent.dataset.id;
    // find task by dataset.id 
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let task = tasks.find((e)=>e.id==taskId)
    task.title = text;
    localStorage.setItem('tasks',JSON.stringify(tasks))
    renderUI(tasks)
}
const editTask = (target)=>{
    let grandParent = target.closest('.task-card').querySelector('.task-mid')
    let taskname = grandParent.querySelector('.task-name')

    let input = document.createElement("input");
    input.setAttribute('class','edit-task-input')
    input.addEventListener('change',inputChange)
    taskname.remove();
    grandParent.prepend(input)
}
const deleteTask = (target)=>{
    let grandParent = target.closest('.task-card');
    let taskId = grandParent.dataset.id;
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(e=>e.id!=taskId)
    localStorage.setItem('tasks',JSON.stringify(tasks));
    countTasks()
    renderUI(tasks);
}
const toggleChechBox = (target)=>{
    const grandParent = target.closest('.task-card')
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let task = tasks.find(e=>grandParent.dataset.id==e.id);
    task.status = task.status.toLowerCase() == "pending" ? "Completed" : "pending"
    const parent = target.parentElement;
    parent.innerHTML = `${task.status.toLowerCase()== "pending" ? `<i class="ri-checkbox-blank-circle-line"></i>` : `<i class="ri-checkbox-circle-fill"></i>`}`
    localStorage.setItem('tasks',JSON.stringify(tasks));
    countTasks();
    renderUI(tasks);
}
//using Event Delegation to capturing events instead of using attaching separate event listeners to every task card 
// Attaching a single listener to the parent container
display.addEventListener('click',(e)=>{
    // in event Capturing phase
    // it goes Top - Bottom
    // console.log("Event-Capturing")
    // console.log("grandParent-->",e.target.parentElement.parentElement);
    // console.log("parent-->",e.target.parentElement);
    // console.log("child -> ",e.target);
    // in event Bubbling phase
    //  it goes Bottom - Top
    // console.log("Event-Bubbling")
    // console.log("child -> ",e.target);
    // console.log("parent-->",e.target.parentElement);
    // console.log("grandParent-->",e.target.parentElement.parentElement);
    let target = e.target;
    if(target.classList.contains('edit')) {
        editTask(target);
    }
    else if(target.classList.contains('delete')){
        deleteTask(target);
    }else if(target.classList.contains('status')){
        toggleChechBox(target);
    }

})
// creates a new date
const createDate = ()=>{
    const date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'long'
    });
    return formatter.format(date)
}
// creates a task and add it to the tasks list in localStorage 
const createTask = (task)=>{
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks',JSON.stringify(tasks))
    countTasks()
    renderUI(tasks)
}


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    // console.log(e)
    // input.value
    // return the current value of the input
    // Here i used input.value because the getAttribute('value') gets me the what written in the HTML of the input which is Empty string ""
    
    // input.getAttribute('value')
    // returns the original value of the input written in the html
    const [title,category] = e.target
    if(title.value == "") return;
    let task = {
        id:Date.now(),
        title:title.value,
        category:category.value,
        status:'Pending',
        date:createDate()   
    }
    createTask(task)
    form.reset()
})

search.addEventListener('input',(e)=>{
    let text = e.target.value;
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    let filteredTasks = tasks.filter((t)=>t.title.toLowerCase().includes(text))
    renderUI(filteredTasks); 
})

category.addEventListener('change',(e)=>{
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    let CATEGORY = e.target.value
    if(CATEGORY=="all") {
        renderUI(tasks)
        return
    }
    let filteredTasks = tasks.filter((t)=>t.category.toLowerCase()==CATEGORY)
    renderUI(filteredTasks);
})

clearAll.addEventListener('click',(e)=>{
    overlay.style.display = "flex"
})

cancel.addEventListener('click',(e)=>{
    overlay.style.display = "none"
})

clear_all_btn.addEventListener('click',()=>{
    localStorage.setItem('tasks',JSON.stringify([]));
    overlay.style.display = "none"
    countTasks()
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    countTasks();
    renderUI(tasks);
})

countTasks()
renderUI(tasks)