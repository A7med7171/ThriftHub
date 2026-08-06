// ===============================
// USERS
// ===============================
// ---------
const chats = [
    {
        id: 1,
        seller: "Ahmed",
        avatar: "../images/uesrs/user1.jfif",
        product: "Vintage Nike Hoodie",
        messages: [
            {
                sender: "other",
                text: "Hello 👋",
                time: "10:30"
            },
            {
                sender: "me",
                text: "Hi! Is this still available?",
                time: "10:31"
            },
            {
                sender: "other",
                text: "Yes, it is.",
                time: "10:32"
            }
        ]
    },

    {
        id: 2,
        seller: "Sara",
        avatar: "../images/uesrs/user2.jfif",
        product: "Nike Air Force",
        messages: [
            {
                sender: "other",
                text: "Hey!",
                time: "09:40"
            }
        ]
    }
];

// ===============================
// CURRENT CHAT
// ===============================

let currentChat = chats[0];

// ===============================
// HTML ELEMENTS
// ===============================

const chatUsers = document.getElementById("chatUsers");
const messages = document.getElementById("messages");
const sellerName = document.getElementById("sellerName");
const input = document.getElementById("messageText");
const sendBtn = document.getElementById("sendBtn");

// ===============================
// LOAD USERS
// ===============================

function loadUsers(){

    chatUsers.innerHTML="";

    chats.forEach(chat=>{

        chatUsers.innerHTML +=`

            <div class="user"
                 onclick="openChat(${chat.id})">

                <img src="${chat.avatar}">

                <div>

                    <h6>${chat.seller}</h6>

                    <small>${chat.product}</small>

                </div>

            </div>

        `;

    });

}

loadUsers();

// ===============================
// OPEN CHAT
// ===============================

function openChat(id){

    currentChat = chats.find(chat=>chat.id===id);

    sellerName.innerText=currentChat.seller;

    renderMessages();

}

// ===============================
// RENDER
// ===============================

function renderMessages(){

    messages.innerHTML="";

    currentChat.messages.forEach(msg=>{

        messages.innerHTML+=`

            <div class="message ${msg.sender}">

                ${msg.text}

                <div class="time">

                    ${msg.time}

                </div>

            </div>

        `;

    });

    messages.scrollTop = messages.scrollHeight;

}

renderMessages();

// ===============================
// SEND MESSAGE
// ===============================

function sendMessage(){

    const text=input.value.trim();

    if(text==="") return;

    const now=new Date();

    const time=
        now.getHours().toString().padStart(2,"0")
        +":"
        +now.getMinutes().toString().padStart(2,"0");

    currentChat.messages.push({

        sender:"me",

        text:text,

        time:time

    });

    input.value="";

    renderMessages();

    fakeReply();

}

// ===============================
// BUTTON
// ===============================

sendBtn.addEventListener("click",sendMessage);

// ===============================
// ENTER
// ===============================

input.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});

// ===============================
// AUTO REPLY
// ===============================

const replies=[

    "Sounds good 👍",

    "Yes, still available.",

    "I can do 600 EGP.",

    "Can you meet today?",

    "Let me check.",

    "Sure 😊",

    "No problem."

];

function fakeReply(){

    setTimeout(()=>{

        const now=new Date();

        const time=
            now.getHours().toString().padStart(2,"0")
            +":"
            +now.getMinutes().toString().padStart(2,"0");

        const random=Math.floor(Math.random()*replies.length);

        currentChat.messages.push({

            sender:"other",

            text:replies[random],

            time:time

        });

        renderMessages();

    },2000);

}