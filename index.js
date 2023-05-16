const chatContainer = document.getElementById("chat");
const url = 'https://api.pawan.krd/v1/chat/completions';
let chats = [];


function countTripleBackticks(str) {
    const match = str.match(/```/g);
    return match ? match.length : 0;
}

document.getElementsByTagName('input')[0].addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        // Aquí puedes agregar el código que deseas ejecutar cuando el usuario presione Enter
        console.log('El usuario presionó Enter');
        submitMessage();
    }
});
const welcome = document.getElementById("welcome");
const aside = document.getElementsByTagName("aside")[0];
const allChats = document.getElementById("allChats");
let actualChat = -1;

const newChat = () => {
    actualChat = chats.length;
    allChats.innerHTML += `
        <div class="chatContainer">
            <div id="${actualChat}" class="asideChat" onclick="loadChat(id)">
                <p>Chat #${(parseInt(actualChat) + 1)}</p>
                </div>
            <svg onclick="deleteChat(${actualChat})" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="48px" height="48px"><path d="M17,22H7c-1.657,0-3-1.343-3-3V6h16v13C20,20.657,18.657,22,17,22z" opacity=".35"/><path d="M16,4H8V3c0-0.552,0.448-1,1-1h6c0.552,0,1,0.448,1,1V4z"/><path d="M19,3C18.399,3,5.601,3,5,3C3.895,3,3,3.895,3,5c0,1.105,0.895,2,2,2c0.601,0,13.399,0,14,0c1.105,0,2-0.895,2-2	C21,3.895,20.105,3,19,3z"/><path d="M14.812,18.215l-7.027-7.027c-0.384-0.384-0.384-1.008,0-1.392l0.011-0.011c0.384-0.384,1.008-0.384,1.392,0l7.027,7.027	c0.384,0.384,0.384,1.008,0,1.392l-0.011,0.011C15.82,18.599,15.196,18.599,14.812,18.215z"/><path d="M7.785,16.812l7.027-7.027c0.384-0.384,1.008-0.384,1.392,0l0.011,0.011c0.384,0.384,0.384,1.008,0,1.392l-7.027,7.027	c-0.384,0.384-1.008,0.384-1.392,0l-0.011-0.011C7.401,17.82,7.401,17.196,7.785,16.812z"/></ svg>
        </div>
    `;
    chats[actualChat] = [
        {
            role: "system",
            content: "Eres el chatgpt más poderoso del mundo"
        }];

    console.log(actualChat);
    loadChat(actualChat, true);
}
const retrieveChats = () => {
    chats = localStorage.getItem("chats") ? JSON.parse(localStorage.getItem("chats")) : [];
    allChats.innerHTML = "";
    chats.forEach((chat, i) => {
        allChats.innerHTML += `
        <div class="chatContainer">
        <div id="${i}" class="asideChat" onclick="loadChat(id)">
            <p>Chat #${(i + 1)}</p>
            </div>
        <svg onclick="deleteChat(${i})" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="48px" height="48px"><path d="M17,22H7c-1.657,0-3-1.343-3-3V6h16v13C20,20.657,18.657,22,17,22z" opacity=".35"/><path d="M16,4H8V3c0-0.552,0.448-1,1-1h6c0.552,0,1,0.448,1,1V4z"/><path d="M19,3C18.399,3,5.601,3,5,3C3.895,3,3,3.895,3,5c0,1.105,0.895,2,2,2c0.601,0,13.399,0,14,0c1.105,0,2-0.895,2-2	C21,3.895,20.105,3,19,3z"/><path d="M14.812,18.215l-7.027-7.027c-0.384-0.384-0.384-1.008,0-1.392l0.011-0.011c0.384-0.384,1.008-0.384,1.392,0l7.027,7.027	c0.384,0.384,0.384,1.008,0,1.392l-0.011,0.011C15.82,18.599,15.196,18.599,14.812,18.215z"/><path d="M7.785,16.812l7.027-7.027c0.384-0.384,1.008-0.384,1.392,0l0.011,0.011c0.384,0.384,0.384,1.008,0,1.392l-7.027,7.027	c-0.384,0.384-1.008,0.384-1.392,0l-0.011-0.011C7.401,17.82,7.401,17.196,7.785,16.812z"/></ svg>
        </div>
        `;
    })
}
retrieveChats();
const loadChat = async (id, newChat = false) => {
    if (actualChat != -1) {
        console.log("Chat pasado #", actualChat);
        const chatPasado = document.getElementById((newChat && actualChat > 0 ? actualChat - 1 : actualChat));
        if(chatPasado)
            chatPasado.classList.remove('chatActive');
    }

    actualChat = id;
    console.log("Chat cargado: #" + id, chats[actualChat]);

    const chatActual = document.getElementById(id);
    if(!chatActual) return;
    const chatHeader = document.getElementsByTagName("h2")[0];
    chatHeader.innerHTML = "Chat #" + (parseInt(id) + 1);
    chatActual.classList.add('chatActive');

    let chatHTML = "";
    console.log(chats[id].length > 2);
    if (chats[id].length > 1)
        welcome.style.display = "none";
    else
        welcome.style.display = "flex";
    chats[id].forEach(chat => {
        if (chat.role == "user") {
            chatHTML += `
            <div class="mmContainer">
                <div class="myMessage">
                    <p>${chat.content}</p>
                </div>
            </div>
        `;
        }
        if (chat.role == "assistant") {
            chatHTML += `
            <div class="gptContainer">
                <div class="gptMessage">
                    <p>${chat.content}</p>
                </div>
            </div>
        `;
        }
    })
    chatContainer.innerHTML = chatHTML;

}
const deleteChat = (i) => {
    chats = chats.slice(0, i).concat(chats.slice(i + 1));
    localStorage.setItem("chats", JSON.stringify(chats));
    retrieveChats();
    if(chats.length == 0)
        actualChat = -1;
    else 
        actualChat = chats.length - 1;

    loadChat(actualChat);
}
const deleteAll = () => {
    chats = [];
    localStorage.setItem("chats", JSON.stringify(chats));
    retrieveChats();
}
const submitMessage = async () => {
    if (actualChat == -1)
        newChat();
    const input = document.getElementsByTagName('input')[0];
    const textarea = document.getElementById('system');
    if (input.value.trim().length == 0) return;

    input.disabled = true;
    const gptMessage = `
        <div class="mmContainer">
            <div class="myMessage">
                <p>${input.value}</p>
            </div>
        </div>
    `;

    welcome.style.display = "none";
    if(chats[actualChat].length <= 2)
        chats[actualChat].find(chat => chat.role == "system").content = textarea.value;
    textarea.value = "";
    chatContainer.innerHTML += gptMessage;
    window.scrollTo(0, document.body.scrollHeight);

    chat(input.value, actualChat);

    input.value = "";
    input.disabled = false;
}
const chat = async (message, i) => {
    console.log(chats);
    chats[i].push(
        {
            role: "user",
            content: message
        }
    );

    const data = {
        'model': "gpt-4",
        'max_tokens': 100,
        'messages': chats[i]
    };

    // request headers
    const headers = {
        'Authorization': 'Bearer pk-LnnsrJkKMLQPYgGEmDAFcJOooguSgBtuhSqzXTlwtFQKjcol',
        'Content-Type': 'application/json',
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: headers
    };

    await fetch(url, options).then(response => response.json())
        .then(data => {
            console.log(data);
            const vueltas = countTripleBackticks(data.choices[0].message.content)
            for (let index = 0; index < vueltas / 2; index++) {
                data.choices[0].message.content = data.choices[0].message.content.replace('```', '<br><code>')
                data.choices[0].message.content = data.choices[0].message.content.replace('```', '</code>')
            }
            console.log("Formateadote:", data.choices[0].message.content);
            const gptMessage = `
            <div class="gptContainer">
                <div class="gptMessage">
                    <p>${data.choices[0].message.content}</p>
                </div>
            </div>
        `;
            chats[i].push(data.choices[0].message)
            localStorage.setItem("chats", JSON.stringify(chats));
            chatContainer.innerHTML += gptMessage;
            window.scrollTo(0, document.body.scrollHeight);
        })
        .catch(error => {
            console.log(error);
        });
}

document.addEventListener('click', function (event) {
    let isClickInside = document.querySelector('aside').contains(event.target);
    let isButtonClick = document.querySelector('#btnAside').contains(event.target);
    let mobile = aside.classList.contains("asideDeployed");
    if (!isClickInside && !isButtonClick && mobile)
        closeAside();
});

const opaquer = document.getElementById("opaquer");

const openAside = () => {
    aside.style.display = "flex";
    opaquer.style.display = "block";
    aside.classList.toggle('asideDeployed');

    setTimeout(function () {
        opaquer.style.backgroundColor = "#00000041";
        aside.style.width = "15rem";
    }, 5);
}
const closeAside = () => {
    aside.classList.toggle('asideDeployed');
    aside.style.width = "0rem";
    opaquer.style.backgroundColor = "#00000000";
    setTimeout(function () {
        aside.style.display = "none";
        opaquer.style.display = "none";
    }, 150);
}
//chat("hola");