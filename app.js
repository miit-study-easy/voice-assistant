//elements
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#speak");
const time = document.querySelector("#time");
const battery = document.querySelector("#battery");
const internet = document.querySelector("#internet");
const turn_on = document.querySelector("#turn_on");
const msgs = document.querySelector(".messages");

let voiceIndex = 2;

document.querySelector("#start_jarvis_btn").addEventListener("click", () => {
	recognition.start();
	document.querySelector("#stop_jarvis_btn").style.display = "flex";
})

document.querySelector("#stop_jarvis_btn").addEventListener("click", () => {
  recognition.stop();
	document.querySelector("#stop_jarvis_btn").style.display = "none"
})

//jarvis commands
let jarvisComs = [
	"# Switch to Burmese and back",
	"# Say hello to Jarvis",
	"# Thank Jarvis",
	"Ask for commands",
	"Choose voice for Jarvis",
	"Close this - to close opened popups",
	"Change my information",
	"# What's the weather/temperature?",
	"# Show the full weather report",
	"# Are you there? - check voice recognition on/off status",
	"# clear chat",
	"# Shut down - stop voice recognition",
	"# Open Google",
	"Search for ... - search on Google",
	"# Open YouTube",
	"Play ... - search on YouTube",
	"Get news regarding ... - search news articles",
	"Open LMS",
	"# Open Outlook/Mail",
	"# Ask for today's date",
	"# Open full calendar"
];

// weather setup
function weather(location) {
	const weatherCont = document.querySelector(".temp").querySelectorAll("*");
	
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
	const xhr = new XMLHttpRequest();

	xhr.open('GET', url, true);

	xhr.onload = function () {
			if (this.status === 200) {
					let data = JSON.parse(this.responseText);
					weatherCont[0].textContent = `Location : ${data.name}`;
					weatherCont[1].textContent = `Country : ${data.sys.country}`;
					weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
					weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
					weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
					weatherCont[5].textContent = `Original Temperature : ${ktc(data.main.temp)}°C`;
					weatherCont[6].textContent = `Feels like: ${ktc(data.main.feels_like)}°C`;
					weatherCont[7].textContent = `Min temperature: ${ktc(data.main.temp_min)}°C`;
					weatherCont[8].textContent = `Max temperature: ${ktc(data.main.temp_max)}°C`;
					weatherStatement = `The weather in ${data.name} is ${data.weather[0].description} and the temperature feels like ${ktc(data.main.feels_like)} degrees Celsius`;
					weatherStatementB = `ဒီနေ့ ${data.name} ရှိရာသီဥတုက ${data.weather[0].description} ဖြစ်ပြီးအပူချိန်မှာဖြင့် ${ktc(data.main.feels_like)} degrees celsius ရှိပါတယ်`;

			} else {
					weatherCont[0].textContent = "Weahter Info Not Found";
			}
	}
	console.log(weatherCont);
	xhr.send();
}

function ktc(k) {
	k = (k - 273.15);
	return k.toFixed(2);
}

// Time setup
function updateTime() {
	let date = new Date();
	let hrs = date.getHours();
	let mins = date.getMinutes();
	let secs = date.getSeconds();
	if(hrs<10) {
		hrs = '0'+hrs;
	}
	if(mins<10) {
		mins = '0'+mins;
	}
	if(secs<10) {
		secs = '0'+secs;
	}
	time.textContent = `${hrs} : ${mins} : ${secs}`;
}

let def = 2500;
function autoJarvis(ti) {
	setTimeout(() => {
		recognition.start();
		document.querySelector("#stop_jarvis_btn").style.display = "flex";
	}, ti)
}

window.onload = () => {
	turn_on.play();
	turn_on.addEventListener("ended", () => {
		setTimeout(() => {
			autoJarvis(def);
			if(localStorage.getItem("jarvis_setup") === null) {
				readOut("Please fill out the form");
			}
		}, 200);
	});

	// jarvis commands adding
	jarvisComs.forEach((e) => {
		document.querySelector(".commands").innerHTML += `<p># ${e}</p></br>`;
	})

	readOut("     ");

	updateTime(); 
	setInterval(updateTime, 1000); 

	// battery setup
	let batteryPromise = navigator.getBattery();
	batteryPromise.then(batteryCallback);

	function batteryCallback(batteryObject) {
		printBatteryStatus(batteryObject);
		changeBatteryIcon(batteryObject);

		setInterval(() => {
			printBatteryStatus(batteryObject);
			changeBatteryIcon(batteryObject);
			navigator.onLine ? (internet.textContent = "online") : (internet.textContent = "offline") ;
		}, 5000);
	}

	function changeBatteryIcon(batteryObject) {
		const batteryIcon = document.querySelector(".bicon");
		
		batteryIcon.classList.contains

		if(batteryIcon.classList.contains("fa-battery-full")) {
			batteryIcon.classList.remove("fa-battery-full");
		}
		if(batteryIcon.classList.contains("fa-battery-three-quarters")) {
			batteryIcon.classList.remove("fa-battery-three-quarters");
		}
		if(batteryIcon.classList.contains("fa-battery-half")) {
			batteryIcon.classList.remove("fa-battery-half");
		}
		if(batteryIcon.classList.contains("fa-battery-quarter")) {
			batteryIcon.classList.remove("fa-battery-quarter");
		}
		if(batteryIcon.classList.contains("fa-battery-empty")) {
			batteryIcon.classList.remove("fa-battery-empty");
		}

		if(batteryObject.level==1) {
			batteryIcon.classList.add("fa-battery-full");
		} else if(batteryObject.level<0.25) {
			batteryIcon.classList.add("fa-battery-empty");
		} else if(batteryObject.level<0.5) {
			batteryIcon.classList.add("fa-battery-quarter");
		} else if(batteryObject.level<0.75) {
			batteryIcon.classList.add("fa-battery-half");
		} else {
			batteryIcon.classList.add("fa-battery-three-quarters");
		}
	}

	function printBatteryStatus(batteryObject) {
		document.querySelector(".battery").style.width = "180px";
		battery.textContent = `${Math.round(batteryObject.level*100)}% Remaining`;

		if(batteryObject.charging == true) {
			battery.textContent = `${Math.round(batteryObject.level*100)}% Charging`;
		}
	}

	//internet setup
	navigator.onLine ? (internet.textContent = "online") : (internet.textContent = "offline") ;
}

// create a new chat
function createMsg(who, msg) {
	let newMsg = document.createElement("p");
	newMsg.innerText = msg;
	newMsg.setAttribute("class", who);
	msgs.appendChild(newMsg);
}

//jarvis setup
if(localStorage.getItem("jarvis_setup")!==null) {
	weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
}

//jarvis info setup
const setup = document.querySelector(".jarvis_setup");
setup.style.display = "none";
if(localStorage.getItem("jarvis_setup") === null) {
	setup.style.display = "block";
	setup.querySelector("button").addEventListener("click", userInfo);
}

//userinfo function
function userInfo() {
	
	let setupInfo = {
		name: setup.querySelectorAll("input")[0].value,
		bio: setup.querySelectorAll("input")[1].value,
		location: setup.querySelectorAll("input")[2].value,
		phoneNo: setup.querySelectorAll("input")[3].value,
		occupation: setup.querySelectorAll("input")[4].value
	}
	let testArr = [];

	setup.querySelectorAll("input").forEach((e) => {
		testArr.push(e.value);
	})

	if(testArr.includes("")) {
		readOut("Please enter your complete information");
		noRepeat(def);
	} else {
		localStorage.setItem("jarvis_setup", JSON.stringify(setupInfo));
		setup.style.display = "none";
		weather(JSON.parse(localStorage.getItem("jarvis_setup")).location)
	}
}

//speech lang
let speech_lang = "my-MM";
if(localStorage.getItem("lang")===null) {
	localStorage.setItem("lang", "en-US");
}

//speech recognition setup

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = localStorage.getItem("lang");

//sr result
recognition.onresult = function(event) {
	let current = event.resultIndex;
	let transcript = event.results[current][0].transcript;
	transcript = transcript.toLowerCase();
	//let userData = localStorage.getItem("jarvis_setup");
	
	createMsg("usermsg", transcript);

	if(localStorage.getItem("lang")==="my-MM") {

		//switch to eng
		if(transcript.includes("အင်္ဂလိပ်") && transcript.includes("ပြောင်း")) {
			readOutBurmese("အင်္ဂလိပ်ဘာသာ ပြောင်းနေသည်");
			noRepeat(def);
			speech_lang = "en-US";
			localStorage.setItem("lang", "en-US");
			recognition.stop();
			location.reload();
		}

		//say hi
		if(transcript.includes("မင်္ဂလာပါ")) {
			readOutBurmese("မင်္ဂလာပါ။ ဘာအကူအညီလိုပါသလဲ");
			noRepeat(8000);
		}

		//say thank you
		if(transcript.includes("ကျေးဇူး")) {
			readOutBurmese("ကူညီခွင့်ရတာ ဝမ်းသာပါတယ်");
			noRepeat(def);
		}

		//check presence
		if ((transcript.includes("ဖွင့်") || transcript.includes("ဖွာ့") || transcript.includes("ရှိ")) && (transcript.includes("ထား") || transcript.includes("လား"))) {
			readOutBurmese("ဟုတ်ကဲ့ ဒီမှာရှိပါတယ်");
			noRepeat(def);
		}

		//stop voice recognition
		if(transcript.includes("ရပ်မယ်") || transcript.includes("ပိတ်မယ်")) {
			readOutBurmese("ပိတ်ပါပြီ");
			recognition.stop();
		}

		// clear chat
		if ((transcript.includes("cb") || transcript.includes("chat box")) && transcript.includes("ရှင်း")) {
			readOutBurmese("Chat box ရှင်းလိုက်ပါပြီ");
			noRepeat(def);
			document.querySelector(".messages").innerHTML = "";
		}

		//open google
		if(transcript.includes("google ဖွင့်")) {
			readOutBurmese("google ဖွင့်နေပါသည်");
			noRepeat(def);
			window.open("https://www.google.com/");
		}

		//open youtube
		if(transcript.includes("youtube ဖွင့်")) {
			readOutBurmese("youtube ဖွင့်နေပါသည်");
			noRepeat(def);
			window.open("https://www.youtube.com/");
		}

		//open outlook
		if(transcript.includes("ဖွင့်") && (transcript.includes("အီးမေး") || transcript.includes("email"))) {
			readOutBurmese("outlook ဖွင့်နေပါသည်");
			noRepeat(def);
			window.open("https://outlook.office.com/mail/");
		}

		//open google calendar
		if(transcript.includes("ပြက္ခဒိန်") && transcript.includes("ဖွင့်")){
			readOutBurmese("google ပြက္ခဒိန်ဖွင့်နေပါသည်");
			noRepeat(def);
			window.open("https://calendar.google.com/");
		}

		//ask for today's date
		if(transcript.includes("ဒီ") && transcript.includes("နေ့") && transcript.includes("ဘာ")) {
			let dayNameB = "";
			switch(dayName) {
				case "Sunday": 
					dayNameB = "တနင်္ဂနွေ";
					break;
				case "Monday": 
					dayNameB = "တနင်္လာ";
					break;
				case "Tuesday": 
					dayNameB = "အင်္ဂါ";
					break;
				case "Wednesday": 
					dayNameB = "ဗုဒ္ဓဟူး";
					break;
				case "Thursday": 
					dayNameB = "ကြာသပတေး";
					break;
				case "Friday": 
					dayNameB = "သောကြာ";
					break;
				case "Saturday": 
					dayNameB = "စနေ";
					break;
			}
			readOutBurmese(`ဒီနေ့က ${dayNumber} ရက် ${dayNameB} နေ့ဖြစ်ပါတယ်`);
			noRepeat(5000);
		}

		// weather report
		if((transcript.includes("ရာသီဥတု") || transcript.includes("မိုးလေဝသ")) && !(transcript.includes("အပြည့်"))) {
			readOutBurmese(weatherStatementB);
			noRepeat(8000);
		}

		if ((transcript.includes("ရာသီဥတု") || transcript.includes("မိုးလေဝသ")) && transcript.includes("အပြည့်")) {
			readOutBurmese("မိုးလေဝသ သတင်းအပြည့် ဖွင့်နေပါသည်");
			noRepeat(def);
			window.open(`https://www.google.com/search?q=weather+in+${JSON.parse(localStorage.getItem("jarvis_setup")).location}`);
		}
	}

	if(localStorage.getItem("lang")==="en-US") {

		//switch to burmese
		if(transcript.includes("switch") && (transcript.includes("burmese") || transcript.includes("myanmar"))) {
			readOut("Switching to burmese. Please say hello in burmese first");
			noRepeat(5000);
			speech_lang = "my-MM";
			localStorage.setItem("lang", "my-MM");
			recognition.stop();
			location.reload();
		}

		//say hi
		if(transcript.includes("hey") || transcript.includes("hello")) {
			readOut("Hello, how may I assist you?");
			noRepeat(def);
		}

		//say thank you
		if(transcript.includes("thank you") || transcript.includes("thanks")) {
			readOut("I'm glad to be of service.");
			noRepeat(def);
		}

		//ask for commands
		if(transcript.includes("commands")) {
			readOut("These are the list of commands I follow");
			noRepeat(def);
			document.querySelector(".commands").style.display = "block";
		}

		//choose voice
		if(transcript.includes("voice") && (transcript.includes("choose") ||  transcript.includes("pick") || transcript.includes("change") || transcript.includes("show"))) {
			readOut("These are the list of voice options");
			noRepeat(def);
			document.querySelector(".voices").style.display = "block";
		}
		if(transcript.includes("voice") && (transcript.includes("one") || transcript.includes("1") || transcript.includes("david"))) {
			voiceIndex = 0;
			readOut("Voice of David activated");
			noRepeat(def);
		}
		if(transcript.includes("voice") && (transcript.includes("two") || transcript.includes("2") || transcript.includes("mark"))) {
			voiceIndex = 1;
			readOut("Voice of Mark activated");
			noRepeat(def);
		}
		if(transcript.includes("voice") && (transcript.includes("three") || transcript.includes("3") || transcript.includes("zira"))) {
			voiceIndex = 2;
			readOut("Voice of Zira activated");
			noRepeat(def);
		}

		//close pop up tab
		if(transcript.includes("close this")) {
			readOut("pop up closed");
			noRepeat(def);
			document.querySelector(".commands").style.display = "none";
			setup.style.display = "none";
			document.querySelector(".voices").style.display = "none";
		}

		//change info
		if(transcript.includes("change my information")) {
			readOut("Opening the information tab");
			noRepeat(def);
			
			setup.style.display = "flex";
			setup.querySelector("button").addEventListener("click", userInfo);
		}

		// weather report
		if (transcript.includes("temperature") || transcript.includes("weather")) {
			readOut(weatherStatement);
			noRepeat(8000);
		}

		if (transcript.includes("full") && transcript.includes("report")) {
			readOut("opening the weather report");
			noRepeat(def);
			window.open(`https://www.google.com/search?q=weather+in+${JSON.parse(localStorage.getItem("jarvis_setup")).location}`);
		}

		//open google calendar
		if(transcript.includes("calendar")){
			readOut("Opening google calendar");
			noRepeat(def);
			window.open("https://calendar.google.com/");
		}

		// check presence
		if (transcript.includes("are you there")) {
			readOut("Yes I am here");
			noRepeat(def);
		}

		// clear chat
		if (transcript.includes("clear chat") || transcript.includes("clear this chat")) {
			readOut("Chat cleared");
			noRepeat(def);
			document.querySelector(".messages").innerHTML = "";
		}

		// close voice recognition
		if (transcript.includes("shut down") || transcript.includes("shutdown")) {
			readOut("Shutting down");
			recognition.stop();
		}

		//open google
		if(transcript.includes("open google")) {
			readOut("opening google");
			noRepeat(def);
			window.open("https://www.google.com/");
		}

		//google search
		if(transcript.includes("search for")) {
			let input = transcript;
			let a = input.indexOf("search for");
			input = input.split("");
			input.splice(0, a+10);
			input.shift();
			input.pop();
			input = input.join("");
			readOut(`here are the search results for ${input}`);
			noRepeat(def);
			input = input.split(" ").join("+")
			window.open(`https://www.google.com/search?q=${input}`);
		}

		//open youtube
		if(transcript.includes("open youtube")) {
			readOut("opening youtube");
			noRepeat(def);
			window.open("https://www.youtube.com/");
		}

		//youtube play
		if(transcript.includes("play")) {
			let input = transcript;
			let a = input.indexOf("play");
			input = input.split("");
			input.splice(0, a+4);
			input.shift();
			input.pop();
			input = input.join("");
			readOut(`playing ${input}`);
			noRepeat(def);
			input = input.split(" ").join("+")
			window.open(`https://www.youtube.com/search?q=${input}`);
		}

		// news
		if(transcript.includes("news regarding")) {
			let input = transcript;
			let a = input.indexOf("regarding");
			input = input.split("");
			input.splice(0, a+9);
			input.shift();
			input.pop();
			readOut("Here are some headlines on "+input.join(""));
			getNews(input.join(""));
			recognition.stop();
		}

		//lms
		if(transcript.includes("open lms")) {
			readOut("opening the learning management system");
			noRepeat(def);
			window.open("https://lms.miit.edu.mm/");
		}

		//outlook
		if(transcript.includes("open outlook") || transcript.includes("open mail")) {
			readOut("opening outlook");
			noRepeat(def);
			window.open("https://outlook.office.com/mail/");
		}

		//ask for today's date
		if(transcript.includes("date") || transcript.includes(" day")) {
			readOut(`Today is ${dayName} the ${dayNumber}, ${monthName}`);
			noRepeat(def);
		}
		
	}	
}

// jarvis speech
function readOut(message) {
	const speech = new SpeechSynthesisUtterance();
	// different voices
	const allVoices = speechSynthesis.getVoices();
	speech.text = message;
	speech.voice = allVoices[voiceIndex];
	speech.volume = 1;
	window.speechSynthesis.speak(speech);
	
	createMsg("jmsg", message);
}

function readOutBurmese(message) {
	const speech = new SpeechSynthesisUtterance();
	speech.text = message;
	speech.volume = 1;
	speech.lang = "my-MM";
	window.speechSynthesis.speak(speech);
	
	createMsg("jmsg", message);
}

function noRepeat(ti) {
	recognition.stop();
	autoJarvis(ti);
}

recognition.onend = () => {
	document.querySelector("#stop_jarvis_btn").style.display = "none";
}

//calendar
const lang = navigator.language;

let date = new Date();
let dayNumber = date.getDate();
let monthx = date.getMonth();

let dayName = date.toLocaleString(lang, {weekday: 'long'});
let monthName = date.toLocaleString(lang, {month: 'long'});
let year = date.getFullYear();

document.querySelector("#month").innerHTML = monthName;
document.querySelector("#day").innerHTML = dayName;
document.querySelector("#date").innerHTML = dayNumber;
document.querySelector("#year").innerHTML = year;

document.querySelector(".calendar").addEventListener("click", () => {
	window.open("https://calendar.google.com/");
})

//news setup

async function getNews(search) {
	var url = `https://newsapi.org/v2/everything?q=${search}&apiKey=5211588834674052b34cb75483d1d33c`;
	var req = new Request(url);
	await fetch(req).then((response) => response.json())
	.then((data) => {
		let arrNews = data.articles;
		arrNews.length = 3;

		arrNews.forEach((e, index) => {
			readOut(index+1+"..."+e.title);
		});

	})
}
