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

connection.on("SalaAlterada", sala => {
        var lista = document.getElementById(`sala${sala.id}-jogadores`);
        lista.innerText = '';
        for (var jogador of sala.jogadores) {
            var li = document.createElement('li');
            li.textContent = jogador.nome;

            lista.appendChild(li);
        }
});

let salaSelecionada = {};
let jogadorSelecionado = null;

connection.on("EntrouSala", (sala, jogador) => {
   salaSelecionada = sala;

   if (jogadorSelecionado == null) {
       jogadorSelecionado = jogador;
   }

   document.getElementById("div-jogo").style.visibility = "visible";
   
   document.getElementById("jogador1").innerText = `Jogador X: ${salaSelecionada.jogadores[0].nome}`;
   
   if (sala.jogadores.length == 2) {
       document.getElementById("jogador2").innerText = `Jogador O: ${salaSelecionada.jogadores[1].nome}`;    
   }
});

connection.on("AlterarVez", (sala, numero) => {
   salaSelecionada = sala;
   var jogadorAnterior = sala.jogadorDaVez == "X" ? "O" : "X";
   
   document.getElementById(`casa${numero}`).style.backgroundImage = `url(./images/${jogadorAnterior}.png)`;
});

connection.on("JogadorGanhou", (ganhador, ganhadorNome) => {
    alert(`O jogador ${ganhador} - ${ganhadorNome} ganhou a partida`);
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

function opcaoJogada(numero) {
    connection.invoke("CasaClicada", salaSelecionada.id, numero)
        .catch(err => console.error(err.toString()));
}