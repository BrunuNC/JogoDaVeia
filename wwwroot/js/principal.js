const connection = new signalR.HubConnectionBuilder().withUrl("/principalHub").build(); 

connection.start()
    .then(() => document.getElementById("entrarUsuario").disabled = false)
    .catch(err => console.error(err.toString()));

/* ======================================= Chamadas do Servidor ======================================= */

connection.on("UsuariosLogados", usuarios => {
    const lista = document.getElementById("listaUsuarios");
    lista.innerText = "";

    for (let usuario of usuarios) {
        let li = document.createElement("li");
        li.textContent = usuario;
        lista.appendChild(li);
    }
});

connection.on("SpamMessage", usuario => {
   alert(`${usuario} está enviando uma notificação!`); 
});

connection.on("SalaFechada", salaId => {
   alert(`Sala ${salaId} está fechada`); 
});

connection.on("SalasAlteradas", salas => {
        var lista = document.getElementById(`sala${sala.id}-jogadores`);
        lista.innerText = '';
        for (var jogador of sala.jogadores) {
            var li = document.createElement('li');
            li.textContent = jogador.nome;

            lista.appendChild(li);
        }
});

/* ======================================= Funções do Client abaixo ======================================= */

function entrarUsuario() {
    const usuario = document.getElementById("userName").value;
    if (usuario.length > 0) 
        connection.invoke("EntrarUsuario", usuario)
        .then(() => {
            document.getElementById("userName").disabled = true;
            document.getElementById("entrarUsuario").disabled = true;
        })
        .catch(err => console.error(err.toString()));
}

function spamAll() {
   connection.invoke("SpamAll")
       .catch(err => console.error(err.toString())); 
}

function spamOthers() {
    connection.invoke("SpamOthers")
        .catch(err => console.error(err.toString()));
}

function entrarSala(id) {
    connection.invoke("EntrarSala", id)
        .catch(err => console.error(err.toString()));
}

function spamGroup(id) {
    connection.invoke("SpamGroup", id)
        .catch(err => console.error(err.toString()));
}