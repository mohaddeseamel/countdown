const inputContainer = document.getElementById('input-container');
const countdownForm  = document.getElementById('countdownForm');
const dateEl         = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const timeElements = document.querySelectorAll('span');
const countdownBtn = document.getElementById('countdown-button');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let saveCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60 ;
const day = 24 * hour;

const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min',today);


//Take values from Form input
function updateCountdown(e){
    e.preventDefault()
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    saveCountdown = {
        title: countdownTitle,
        date: countdownDate
    };
    console.log(saveCountdown);
    localStorage.setItem('countdown', JSON.stringify(saveCountdown))

    //check for valid date
    if(countdownDate === ''){
        alert('please select a date for the countdown.')
    }else{
        //Get number version of current Date, updateDom
         countdownValue = new Date(countdownDate).getTime();
         updateDom();
    }
}
//populate Countdown / complete Ui
function updateDom(){
    countdownActive = setInterval(() =>{
        const now = new Date().getTime();
        const distance = countdownValue - now;
        const days = Math.floor(distance/day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        //hidden Input
        inputContainer.hidden = true;

        //If the countdown has ended, show complete
        if(distance < 0){
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        }else{
            //Else show the countdown in progress
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    },second);
}

//reset All values
function reset(){
    //Hide countdown , show Input
    countdownEl.hidden = true;
    inputContainer.hidden = false;
    completeEl.hidden = true;
    clearInterval(countdownActive);

    //Reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.clear('countdown')
}

function restorePreviousCountdown(){
    //Get countdown from localStorage if available
    if(localStorage.getItem('countdown')){
        inputContainer.hidden = true;
        saveCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = saveCountdown.title;
        countdownDate = saveCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}

//Event Listener
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click' , reset);

//on load check localStorage
restorePreviousCountdown();