const chatContainer = document.getElementById("chat");
const url = 'https://api.pawan.krd/v1/chat/completions';
let chats = [];


function countTripleBackticks(str) {
    const match = str.match(/```/g);
    return match ? match.length : 0;
}

document.getElementsByTagName('input')[0].addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      // Aquí puedes agregar el código que deseas ejecutar cuando el usuario presione Enter
      console.log('El usuario presionó Enter');
      submitMessage();
    }
});
const welcome = document.getElementById("welcome");
const aside = document.getElementsByTagName("aside")[0];
let actualChat = -1;
const newChat = () => {
    actualChat++;
    aside.innerHTML+= `
        <div id="${actualChat}" class="asideChat" onclick="loadChat(id)">
            <p>Chat #${(parseInt(actualChat)+1)}</p>
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
const loadChat = async (id, newChat = false) => {

    console.log("Chat pasado #",actualChat);
    const chatPasado = document.getElementById( (newChat && actualChat> 0 ? actualChat - 1 : actualChat));
    chatPasado.classList.remove('chatActive');



    actualChat = id;
    console.log("Chat cargado: #"+id, chats[actualChat]);

    const chatActual = document.getElementById(id);
    chatActual.classList.add('chatActive');
    
    let chatHTML = "";
    console.log(chats[id].length > 2);
    if(chats[id].length > 1)
        welcome.style.display = "none";
    else
        welcome.style.display = "flex";
    chats[id].forEach(chat => {
        if(chat.role == "user"){
            chatHTML+=`
            <div class="mmContainer">
                <div class="myMessage">
                    <p>${chat.content}</p>
                </div>
            </div>
        `;
        }
        if(chat.role == "assistant"){
            chatHTML+=`
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
const submitMessage = async () => {
    if(actualChat == -1)
        newChat();
    const input = document.getElementsByTagName('input')[0];
    
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
    chatContainer.innerHTML+= gptMessage;
    window.scrollTo(0, document.body.scrollHeight);
        
    chat(input.value, actualChat);

    input.value = "";
    input.disabled = false;
}
const chat = async ( message, i ) => {
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
        for (let index = 0; index < vueltas/2; index++) {
            data.choices[0].message.content = data.choices[0].message.content.replace('```', '<br><code>')
            data.choices[0].message.content = data.choices[0].message.content.replace('```', '</code>')
        }
        console.log("Formateadote:",data.choices[0].message.content);
        const gptMessage = `
            <div class="gptContainer">
                <div class="gptMessage">
                    <p>${data.choices[0].message.content}</p>
                </div>
            </div>
        `;
        chats[i].push( data.choices[0].message )
        chatContainer.innerHTML+= gptMessage;
        window.scrollTo(0, document.body.scrollHeight);
    })
    .catch(error => {
        console.log(error);
    });
}

//chat("hola");