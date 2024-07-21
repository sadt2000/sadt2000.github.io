console.log(123);

const starBtn=document.querySelector("#start_btn");
const showAnsBtn=document.querySelector("#show_answer_btn");
const restarBtn=document.querySelector("#restart_btn");
const guessHistoryList=document.querySelector("#guess_history_list");
let answer;
const guessInput=document.querySelector("#guess_input");
const guessBtn=document.querySelector("#guess_btn");
const gameMsgToast=document.querySelector("#game_msg_toast");
const toastBootstrap=new bootstrap.Toast(gameMsgToast,{delay:1000, 
    
});
gameMsgToast.addEventListener("hide.bs.toast",()=>{
    console.log("toast hide");
})
const modalBootstrap =new bootstrap.Modal("#end_game_modal");
const modalend_game_btn =document.querySelector("#end_game_btn");

modalend_game_btn.addEventListener("click",function(){
    modalBootstrap.hide();
    initGame();
});
//開始遊戲 初始化
function initGame(){
    ///產出answer
    answer=generateAns();
    console.log(answer);
    ///清空紀錄
    guessHistoryList.innerHTML="";
    //starbutton
    starBtn.disabled=true;
    restarBtn.disabled=false;
    showAnsBtn.disabled=false;

};

function generateAns(){
    const numArr=[0,1,2,3,4,5,6,7,8,9];
    numArr.sort((a,b)=>getRandomArbitrary(-1,1));
    return numArr.slice(0,4).join("");
}
function getRandomArbitrary(min,max){
    return Math.random()*(max-min)+min;
}

starBtn.addEventListener("click",initGame);
restarBtn.addEventListener("click",initGame);
//秀答案
showAnsBtn.addEventListener("click",()=>{
    showinit(`answer:${answer}`);
});
//guessBtn
guessBtn.addEventListener("click",()=>{
    const val=guessInput.value.trim();
    console.log(val);
    //輸入合法的輸入
    if(val==="" || isNaN(val))
    {        
        showinit("請輸入合法數字");
        guessInput.value="";
        return;
    }
    //輸入的是不重複的的4個字
    if(val.length>4 ||new Set(val).size!==4)
    {
        showinit("請確認輸入數字的數量");
        guessInput.value="";
        return;
    }

    //a,b
    let a=0,b=0;
    for(let i=0;i<answer.length;i++)
    {
        if(val[i]===answer[i]){
            a++;
        }
        else if(answer.includes(val[i])){
            b++;
        }
    }
    if(a===4)
    {       
        modalBootstrap.show();
    }
    guessInput.value="";

    appendHistory(a,b,val);

})
//猜測紀錄
function appendHistory(a,b,input){
    const li=document.createElement("li");
    li.classList.add("list-group-item");
    const span=document.createElement("span");    
    const badgeColor= a===4?"bg-success":"bg-danger";
    span.classList.add("badge",badgeColor);
    span.textContent=`${a}A${b}B`;
    li.append(span,input);
    guessHistoryList.append(li);

}
//猜中modal show
function showinit(msg){
    gameMsgToast.querySelector(".toast-body").textContent=msg;   
    toastBootstrap.show();  
}

