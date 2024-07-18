//新增用
const addInputyear = document.querySelector("#addinputyear");//年
const addInputmonth = document.querySelector("#addinputmonth");//月
const addInputday = document.querySelector("#addinputday");//日
const addInputitem = document.querySelector("#add_item");//代辦事項
const addInputtime = document.querySelector("#add_time");//時間
const addInputcolor = document.querySelector("#add_color");//顏色
const addbtn = document.querySelector("#add_btn");//新增按鈕
const key = "id";//key值
//點選用
const todoContainer = document.querySelector("#todo_container");//container    
const addmodalBootstrap = new bootstrap.Modal("#addmodal");//modal用來顯示隱藏
const modal = document.querySelector("#addmodal");//找到Modal
//刪除修改&承接
const updatebtn = document.querySelector("#update_btn");
const savebtn = document.querySelector("#save_btn");
const removebtn = document.querySelector("#remove_btn");
let removedateRecordli;//remove承接變數 點選的日期
let removetodolistid;//點選的日期ID
let removetodoliid;//remove承接變數  代辦事項ID
let removetodolisttodoli;//remove承接變數 localStorage(get)  
let updatetodoListItem; //選到的代辦事項
let updatetodolisttodoli; //localStorage(get)     

///產生日曆
function populateCalendar(year, month) {
  const weekdates = getDatesMonth(year, month);//取得選擇月份的所有日期&星期    
  const container = document.querySelector('#todo_container');

  //清除頁面內容 保留月份選擇&星期
  const carousel = document.querySelector('#carouselExampleDark');
  const weekRow = document.querySelector('#week');
  container.innerHTML = '';
  container.appendChild(carousel);
  container.appendChild(weekRow);

  //取到該月份第一天所在的星期
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = weekdates.length;//取天數
  let currentDayIndex = 0;//當月需要格數

  // 計算需要的格子 & rows行數
  const totalSlots = firstDayOfMonth + daysInMonth;
  const rows = Math.ceil(totalSlots / 7);

  //獲取上個月和下個月的天數
  const lastMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const lastDaysInMonth = new Date(year, lastMonth + 1, 0).getDate();
  const nextDaysInMonth = new Date(year, nextMonth + 1, 0).getDate();
  let nextDayCounter = 1;//預設補充下個月格數的第一天的日期
  let lastDayCounter = lastDaysInMonth - firstDayOfMonth + 1;//預設補充上個月格數的第一天    
  //對應當天日期
  const todate = new Date();
  const nowyear = todate.getFullYear();
  const nowmonth = todate.getMonth();
  const nowday = todate.getDate();
  const today = `${nowyear}${nowmonth + 1}${nowday}`;
  ///生成日曆格子 row   
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const row = document.createElement('div');
    row.classList.add('row', 'mt-0', 'list_row');
    //col
    for (let colIndex = 0; colIndex < 7; colIndex++) {
      const col = document.createElement('div');
      col.classList.add('col', 'text-start', 'p-1');
      //判斷上個月、當月、下個月格數及對應格子          
      if (rowIndex === 0 && colIndex < firstDayOfMonth) {
        // 填充上個月的日期  
        const lestcolid = `${year}${String(month).padStart(2, '0')}${String(lastDayCounter).padStart(2, '0')}`;//上個月ID               
        col.innerHTML = `<div class="weekday text-secondary">${lastDayCounter}</div><div class="todo_list" data-id="${lestcolid}"></div>`;
        lastDayCounter++;
        //產生上個月li
        setTimeout(() => loadTodosForDate(lestcolid), 0);
      } else if (currentDayIndex < daysInMonth) {
        const { date } = weekdates[currentDayIndex];
        const colid = `${year}${String(month + 1).padStart(2, '0')}${String(date).padStart(2, '0')}`;//當月ID      
        if (today === colid) {
          col.innerHTML = `<div class="weekday badge  text-bg-primary">${date}</div><div class="todo_list" data-id="${colid}"></div>`;//給ID 之後代辦清單要抓取
        } else {
          col.innerHTML = `<div class="weekday">${date}</div><div class="todo_list" data-id="${colid}"></div>`;//給ID 之後代辦清單要抓取
        }
        currentDayIndex++;
        setTimeout(() => loadTodosForDate(colid), 0);
      } else {
        // 填充下個月的日期        
        const nextcolid = `${year}${String(month + 2).padStart(2, '0')}${String(nextDayCounter).padStart(2, '0')}`;//下個月ID        
        col.innerHTML = `<div class="weekday text-secondary">${nextDayCounter}</div><div class="todo_list" data-id="${nextcolid}"></div>`;
        nextDayCounter++;
        setTimeout(() => loadTodosForDate(nextcolid), 0);
      }
      row.appendChild(col);
    }
    container.appendChild(row);
  }
}
//獲取當前月份輪播的月份 active
function getActiveMonthName() {
  const activeItem = document.querySelector('.carousel-item.active');
  return activeItem ? activeItem.getAttribute('name') : null;
}
//畫面更新
function onCarouselChange() {
  const activeMonthName = getActiveMonthName();
  if (activeMonthName) {
    const year = new Date().getFullYear(); //取得年
    const month = parseInt(activeMonthName, 10) - 1; //月份索引      
    populateCalendar(year, month);//帶入行事曆
  }
  //月份輪播控制
  const prev = document.querySelector(".carousel-control-prev");
  const next = document.querySelector(".carousel-control-next");
  if (activeMonthName === "6") {
    prev.style.display = "none";
  } else {
    prev.style.display = "";
  }
  if (activeMonthName === "8") {
    next.style.display = 'none';
  } else {
    next.style.display = "";
  }
}
//讀取
document.addEventListener('DOMContentLoaded', () => {
  // 初始化行事曆
  const year = new Date().getFullYear(); // 使用當前年
  const month = new Date().getMonth(); // 使用當前月
  populateCalendar(year, month); //產生月曆  

  // 月份輪播事件
  const carousel = document.querySelector('#carouselExampleDark');
  carousel.addEventListener("slid.bs.carousel", onCarouselChange);//滑動事件
});

//產生todo_li
function loadTodosForDate(id) {
  const todoListElement = document.querySelector(`.todo_list[data-id="${id}"]`);
  const existingData = JSON.parse(localStorage.getItem(key)) || [];
  const dateRecord = existingData.find(item => item.id === id);  //抓取欄位是否有todoList資料       
  if (dateRecord !== undefined && dateRecord.todoList.length !== 0) {
    dateRecord.todoList.forEach(todo => {
      const li = document.createElement('li');
      li.classList.add('todo_li');
      li.style.backgroundColor = todo.color;
      li.dataset.id = todo.id;
      li.textContent = `${todo.time} - ${todo.item}`;
      todoListElement.appendChild(li);
    });
  }
}

//新增
addbtn.addEventListener("click", () => {
  const get = localStorage.getItem(key);
  const yearval = addInputyear.value.trim();
  const monthval = addInputmonth.value.trim();
  const dayval = addInputday.value.trim();
  const itemval = addInputitem.value.trim();
  const times = addInputtime.value.trim();
  const colorval = addInputcolor.value;
  const id = `${yearval}${monthval}${dayval}`;

  let addtodoList = getstorage();
  // 查找是否已有此日期的紀錄
  let addDateRecord = addtodoList.find(item => item.id === id);
  if (addDateRecord) {
    // 如果已有此日期的紀錄，添加新的代辦事項            
    addDateRecord.todoList.push({ id: new Date().valueOf(), time: times, item: itemval, color: colorval });
  } else {
    // 如果沒有此日期，創建新的
    addDateRecord = {
      id: id,
      year: yearval,
      month: String(monthval).padStart(2, '0'),
      date: String(dayval).padStart(2, '0'),
      todoList: [{ id: new Date().valueOf(), time: times, item: itemval, color: colorval }],
    };
    addtodoList.push(addDateRecord);
  }
  // 更新 localStorage
  localStorage.setItem(key, JSON.stringify(addtodoList));
  addmodalBootstrap.hide();
  onCarouselChange();//更新畫面
});

//欄位輸入判斷
addInputyear.addEventListener("input", inputFn);
addInputmonth.addEventListener("input", inputFn);
addInputday.addEventListener("input", inputFn);
addInputtime.addEventListener("input", inputFn);
addInputitem.addEventListener("input", inputFn);
//新增&修改共用
function inputFn() {
  if (addInputtime.value.trim() === "" || addInputitem.value.trim() === "") {
    addbtn.disabled = true;
    savebtn.disabled = true;
    return;
  }
  addbtn.disabled = false;
  savebtn.disabled = false;
}

//從 localStorage 獲取現有的數據
function getstorage() {
  // 從 localStorage 獲取現有的數據
  let existingData = localStorage.getItem(key);
  if (existingData) {
    // 如果已有數據，解析為 JSON 結構
    existingData = JSON.parse(existingData);
  } else {
    // 如果沒有已有數據，初始化為空數組
    existingData = [];
  }
  return existingData;
}

//選取到格子的日期 回傳年月日
function splitDateId(dataId) {
  const year = dataId.slice(0, 4);
  const month = dataId.slice(4, 6);
  const day = dataId.slice(6, 8);
  return { year, month, day };
}

//選擇的格子   
todoContainer.addEventListener("click", (e) => {
  const arryclass = Array.from(e.target.classList); // 抓格子類別作為判斷
  const dataweek = e.target.dataset.week; // 判斷週的week  
  //判斷抓取格子是正確的&點選的是todoList 讓modalshow
  if (arryclass[0] === "col" && dataweek === undefined) {
    //找到todolist的id
    const todoListElement = e.target.querySelector(".todo_list");
    const id = todoListElement ? todoListElement.dataset.id : null;

    // 選取到格子的日期 後續分成年月日
    const targetdate = splitDateId(id);

    // 移除之前的監聽器，避免重複執行
    modal.removeEventListener("show.bs.modal", handleModalShow);
    //綁定新的監聽器
    modal.addEventListener("show.bs.modal", handleModalShow);

    function handleModalShow() {
      modal.querySelector("#addinputyear").value = targetdate.year;
      modal.querySelector("#addinputmonth").value = targetdate.month;
      modal.querySelector("#addinputday").value = targetdate.day;
      modal.querySelector("#add_item").value = "";
      modal.querySelector("#add_time").value = "";
      modal.querySelector("#add_color").value = "";
      modal.querySelector("#addinputyear").disabled = true;
      modal.querySelector("#addinputmonth").disabled = true;
      modal.querySelector("#addinputday").disabled = true;
      modal.querySelector("#add_time").disabled = false;
      modal.querySelector("#add_item").disabled = false;
      modal.querySelector("#add_color").disabled = false;
      updatebtn.classList.add("d-none");
      removebtn.classList.add("d-none");
      addbtn.classList.remove("d-none");
    }
    addmodalBootstrap.show();
    inputFn();
  } else if (arryclass.includes("todo_li")) {
    const todoListElement = e.target.closest(".todo_list"); // 找到上一層的 todo_list
    if (todoListElement) {
      const todoListid = todoListElement.dataset.id; //找到 todoList 的 ID

      //移除之前的監聽器，避免重複執行
      modal.removeEventListener("show.bs.modal", handleModalShow);
      //綁定新的監聽器
      modal.addEventListener("show.bs.modal", handleModalShow);

      function handleModalShow() {
        const todolisttodoli = getstorage();
        const dateRecordli = todolisttodoli.find(item => item.id === todoListid);
        if (dateRecordli) {
          modal.querySelector("#addinputyear").value = dateRecordli.year;
          modal.querySelector("#addinputmonth").value = dateRecordli.month;
          modal.querySelector("#addinputday").value = dateRecordli.date;
          modal.querySelector("#addinputyear").disabled = true;
          modal.querySelector("#addinputmonth").disabled = true;
          modal.querySelector("#addinputday").disabled = true;
          modal.querySelector("#add_item").disabled = true;
          modal.querySelector("#add_time").disabled = true;
          modal.querySelector("#add_color").disabled = true;
          const todoliid = parseInt(e.target.dataset.id); // 抓到 todo_li 的 ID
          const todoListItem = dateRecordli.todoList.find(todo => todo.id === todoliid);
          if (todoListItem) {
            modal.querySelector("#add_item").value = todoListItem.item;
            modal.querySelector("#add_time").value = todoListItem.time;
            modal.querySelector("#add_color").value = todoListItem.color;
            updatebtn.classList.remove("d-none");
            removebtn.classList.remove("d-none");
            addbtn.classList.add("d-none");

            // 儲存變數承接
            updatetodoListItem = todoListItem; // 選到的代辦事項
            updatetodolisttodoli = todolisttodoli; // localStorage(get)
            // 刪除變數承接
            removedateRecordli = dateRecordli; // 點選的日期
            removetodoliid = todoliid; // 代辦事項ID
            removetodolisttodoli = todolisttodoli; // localStorage(get)
            removetodolistid = todoListid; // 點選的日期ID
          }
        }
      }
      addmodalBootstrap.show();
    }
  } else {
    console.log("選到的不是show的位置");
  }
});
//儲存
savebtn.addEventListener("click", () => {
  updatetodoListItem.item = addInputitem.value;
  updatetodoListItem.time = addInputtime.value;
  updatetodoListItem.color = addInputcolor.value;
  localStorage.setItem(key, JSON.stringify(updatetodolisttodoli));
  savebtn.classList.add("d-none");
  addmodalBootstrap.hide();
  return onCarouselChange();
});
//修改
updatebtn.addEventListener("click", () => {
  updatebtn.classList.add("d-none");
  savebtn.classList.remove("d-none");
  modal.querySelector("#add_item").disabled = false;
  modal.querySelector("#add_time").disabled = false;
  modal.querySelector("#add_color").disabled = false;
  inputFn();
})
//刪除     
removebtn.addEventListener("click", () => {
  // removedateRecordli;//點選的日期
  // removetodoliid=todoliid;//代辦事項ID
  // removetodolisttodoli=todolisttodoli;//localStorage(get)       
  // removetodolistid=todoListid;//點選的日期ID     

  //刪除選到的代辦事項
  const todoListliItemindex = removedateRecordli.todoList.findIndex(todo => todo.id === removetodoliid);
  removedateRecordli.todoList.splice(todoListliItemindex, 1);
  localStorage.setItem(key, JSON.stringify(removetodolisttodoli));

  //判斷todolist裡 還有沒有代辦事項 沒有就全都刪除      
  const todoListItemindex = removetodolisttodoli.findIndex(todo => todo.id === removetodolistid);//找到要刪除索引 
  if (removedateRecordli.todoList.length === 0) {
    removetodolisttodoli.splice(todoListItemindex, 1);
    localStorage.setItem(key, JSON.stringify(removetodolisttodoli));
  }
  addmodalBootstrap.hide();
  return onCarouselChange();
})
//取得日期
function getDatesMonth(year, month) {
  const weekdates = [];
  const daysInmonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInmonth; day++) {
    const date = new Date(year, month, day);
    const weekday = date.getDay();
    weekdates.push({ date: day, weekday });
  }
  return weekdates;
}