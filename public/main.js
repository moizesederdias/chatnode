
console.log('Arquivo: main.js');
const socket = io();

let username = '';
let userlist = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('#chatTextInput');
let chatList = document.querySelector('.chatList');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

function renderUserList(){

    let ul = document.querySelector('.userList');
    ul.innerHTML = '';

    userlist.forEach( nome => {
        ul.innerHTML += '<li>'+nome+'</li>' ;
    });

}

function addMessage(type, user, msg ){

    chatList = document.querySelector('.chatList');

    switch(type){

        case 'status':

            chatList.innerHTML += '<li class="status">'+msg+'</li>';
            break;

        case 'msg':

            if( username == user ){
                chatList.innerHTML += '<li class="m-txt"><span class="me">'+user+'</span> '+msg+'</li>';
            }
            else{
                chatList.innerHTML += '<li class="m-txt"><span>'+user+'</span> '+msg+'</li>';
            }
            break;

    }

    chatList.scrollTop = chatList.scrollHeight;

}

loginInput.addEventListener('keyup', (e) =>{

    if(e.keyCode===13){

        let name = loginInput.value.trim();

        if(name != ''){

            username = name;
            document.title = 'Chat('+username+')';
            console.log(username,' pressionou ENTER');
            socket.emit( 'join-request', username );

        }
    }
});

textInput.addEventListener('keyup', (e) =>{
    if(e.keyCode===13){

        let txt = textInput.value.trim();
        textInput.value = '';

        if(txt != ''){

            addMessage('msg', username, txt);
            socket.emit('send-msg', txt);

        }
    }
});




socket.on('user-ok', (list) => {

    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    userlist = list ;    
    console.log('usuário OK: ', userlist);
    renderUserList();
    chatList.innerHTML = '';
    addMessage('status', null, 'Conectado!');
    textInput.focus();

});

socket.on('list-update', (dados) => {

    if(dados.joined){
        addMessage('status', null, dados.joined+' entrou no chat.');
    }
    
    if(dados.left){
        addMessage('status', null, dados.left+' saiu do chat.');
    }

    userlist = dados.list ;  
    renderUserList();

})


socket.on('show-msg', (dados) => {

    addMessage('msg', dados.username, dados.message);

});

socket.on('disconnect', () => {

    addMessage('status', null, 'Você foi desconectado!');
    userlist = [];    
    renderUserList();

});

socket.on('connect_error', () => {

    addMessage('status', null, 'Tentando reconectar...');

});


socket.on('connect', () => {

    addMessage('status', null, 'Reconectado!');

    if(username != ''){

        socket.emit( 'join-request', username );

    }    

});


