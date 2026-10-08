const campoTarefa =
    document.getElementById("campo-tarefa");

const botaoAdicionar =
    document.getElementById("botao-adicionar");

const botaoLimpar =
    document.getElementById("botao-limpar");

const listaTarefas =
    document.getElementById("lista-tarefas");

const contadorTarefas =
    document.getElementById("contador-tarefas");

const botaoModoEscuro =
    document.getElementById("botao-modo-escuro");

const janelaImagem =
    document.getElementById("janela-imagem");

const imagemEster =
    document.getElementById("imagem-ester");

const fecharImagem =
    document.getElementById("fechar-imagem");


// =====================================================
// FASE 1: GERENCIAMENTO DOS DADOS
// =====================================================

// Array que guarda as tarefas
const listaDeTarefas = [];


// =====================================================
// FASE 2: PERSISTÊNCIA COM LOCALSTORAGE
// =====================================================

const CHAVE_STORAGE = "lista_tarefas";


// Função para SALVAR as tarefas
function salvarNoLocalStorage() {

    // Converte o array de objetos para texto JSON
    const tarefasEmTexto =
        JSON.stringify(listaDeTarefas);

    // Salva o texto no navegador
    localStorage.setItem(
        CHAVE_STORAGE,
        tarefasEmTexto
    );
}


// Função para CARREGAR as tarefas
function carregarDoLocalStorage() {

    // Procura os dados salvos
    const dadosSalvos =
        localStorage.getItem(CHAVE_STORAGE);


    // Se existirem dados salvos...
    if (dadosSalvos) {

        // Converte o texto JSON de volta para objeto
        const tarefasSalvas =
            JSON.parse(dadosSalvos);


        // Coloca as tarefas salvas no array
        tarefasSalvas.forEach(
            function(tarefa) {

                listaDeTarefas.push(tarefa);

            }
        );

    }

}


// =====================================================
// FASE 3: EVENTOS
// =====================================================

botaoAdicionar.addEventListener(
    "click",
    adicionarTarefa
);


campoTarefa.addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {

            adicionarTarefa();

        }

    }
);


// =====================================================
// FASE 4: ADICIONAR TAREFA
// =====================================================

function adicionarTarefa() {

    const texto =
        campoTarefa.value.trim();


    // Palavra especial "ester"
    if (texto.toLowerCase() === "ester") {

        abrirImagemEster();

        campoTarefa.value = "";

        campoTarefa.focus();

        return;
    }


    // Verifica se o campo está vazio
    if (texto === "") {

        mostrarMensagem(
            "✏️ Digite uma tarefa primeiro!"
        );

        campoTarefa.focus();

        return;
    }


    // Cria um objeto representando a tarefa
    const novaTarefa = {

        texto: texto,

        concluida: false,

        importante: false

    };


    // Adiciona a tarefa ao array
    listaDeTarefas.push(
        novaTarefa
    );


    // Salva no localStorage
    salvarNoLocalStorage();


    // Atualiza a tela
    renderizarTarefas();


    campoTarefa.value = "";

    campoTarefa.focus();

}


// =====================================================
// FASE 5: RENDERIZAR TAREFAS
// =====================================================

function renderizarTarefas() {

    // Limpa a lista antes de desenhar novamente
    listaTarefas.innerHTML = "";


    // Percorre todas as tarefas
    listaDeTarefas.forEach(
        function(tarefa, index) {

            const item =
                document.createElement("li");


            item.classList.add(
                "item-tarefa"
            );


            // Se estiver concluída
            if (tarefa.concluida) {

                item.classList.add(
                    "concluida"
                );

            }


            // Se estiver importante
            if (tarefa.importante) {

                item.classList.add(
                    "importante"
                );

            }


            item.innerHTML = `

                <span class="texto-tarefa">
                    ${tarefa.texto}
                </span>

                <div class="acoes-tarefa">

                    <button
                        class="botao-acao favorito"
                        title="Marcar como importante"
                    >
                        <i class="${
                            tarefa.importante
                            ? "fa-solid"
                            : "fa-regular"
                        } fa-star"></i>
                    </button>

                    <button
                        class="botao-acao concluir"
                        title="Concluir tarefa"
                    >
                        <i class="fa-solid fa-check"></i>
                    </button>

                    <button
                        class="botao-acao excluir"
                        title="Excluir tarefa"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            `;


            // =========================================
            // BOTÃO CONCLUIR
            // =========================================

            const botaoConcluir =
                item.querySelector(".concluir");


            botaoConcluir.addEventListener(
                "click",
                function() {

                    // Inverte o estado
                    tarefa.concluida =
                        !tarefa.concluida;


                    // Salva a alteração
                    salvarNoLocalStorage();


                    // Atualiza a tela
                    renderizarTarefas();


                    if (tarefa.concluida) {

                        mostrarMensagem(
                            "🎉 Tarefa concluída! Muito bem!"
                        );

                    } else {

                        mostrarMensagem(
                            "↩️ Tarefa reaberta!"
                        );

                    }

                }
            );


            // =========================================
            // BOTÃO EXCLUIR
            // =========================================

            const botaoExcluir =
                item.querySelector(".excluir");


            botaoExcluir.addEventListener(
                "click",
                function() {

                    // Remove pelo índice
                    listaDeTarefas.splice(
                        index,
                        1
                    );


                    // Salva a nova lista
                    salvarNoLocalStorage();


                    // Atualiza a tela
                    renderizarTarefas();


                    mostrarMensagem(
                        "🗑️ Tarefa removida!"
                    );

                }
            );


            // =========================================
            // BOTÃO FAVORITO
            // =========================================

            const botaoFavorito =
                item.querySelector(".favorito");


            botaoFavorito.addEventListener(
                "click",
                function() {

                    // Inverte o estado de importante
                    tarefa.importante =
                        !tarefa.importante;


                    // Salva a alteração
                    salvarNoLocalStorage();


                    // Atualiza a tela
                    renderizarTarefas();


                    if (tarefa.importante) {

                        mostrarMensagem(
                            "⭐ Tarefa marcada como importante!"
                        );

                    } else {

                        mostrarMensagem(
                            "☆ Tarefa não é mais importante."
                        );

                    }

                }
            );


            // Coloca a tarefa na lista
            listaTarefas.appendChild(
                item
            );

        }
    );


    // Atualiza o contador
    atualizarContador();

}


// =====================================================
// FASE 6: CONTADOR
// =====================================================

function atualizarContador() {

    const quantidade =
        listaDeTarefas.length;


    if (quantidade === 0) {

        contadorTarefas.textContent =
            "0 tarefas na lista";

    } else if (quantidade === 1) {

        contadorTarefas.textContent =
            "1 tarefa na lista";

    } else {

        contadorTarefas.textContent =
            `${quantidade} tarefas na lista`;

    }

}


// =====================================================
// FASE 7: MENSAGENS
// =====================================================

function mostrarMensagem(texto) {

    const mensagemExistente =
        document.querySelector(
            ".mensagem"
        );


    if (mensagemExistente) {

        mensagemExistente.remove();

    }


    const mensagem =
        document.createElement(
            "div"
        );


    mensagem.classList.add(
        "mensagem"
    );


    mensagem.textContent =
        texto;


    document.body.appendChild(
        mensagem
    );


    setTimeout(
        function() {

            mensagem.remove();

        },
        2000
    );

}


// =====================================================
// FASE 8: BOTÃO LIMPAR
// =====================================================

botaoLimpar.addEventListener(
    "click",
    function() {

        const quantidade =
            listaDeTarefas.length;


        if (quantidade === 0) {

            mostrarMensagem(
                "🧹 A lista já está vazia!"
            );

            return;
        }


        // Apaga todas as tarefas do array
        listaDeTarefas.length = 0;


        // Remove os dados salvos
        localStorage.removeItem(
            CHAVE_STORAGE
        );


        // Atualiza a tela
        renderizarTarefas();


        mostrarMensagem(
            "🧹 Todas as tarefas foram removidas!"
        );

    }
);


// =====================================================
// FASE 9: MODO ESCURO
// =====================================================

botaoModoEscuro.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "modoescuro"
        );


        const icone =
            botaoModoEscuro.querySelector(
                "i"
            );


        if (
            document.body.classList.contains(
                "modoescuro"
            )
        ) {

            icone.classList.remove(
                "fa-moon"
            );

            icone.classList.add(
                "fa-sun"
            );

        } else {

            icone.classList.remove(
                "fa-sun"
            );

            icone.classList.add(
                "fa-moon"
            );

        }

    }
);


// =====================================================
// FASE 10: IMAGEM DA ESTER
// =====================================================

function abrirImagemEster() {

    janelaImagem.classList.add(
        "mostrar"
    );

}


fecharImagem.addEventListener(
    "click",
    function() {

        janelaImagem.classList.remove(
            "mostrar"
        );

    }
);


janelaImagem.addEventListener(
    "click",
    function(event) {

        if (
            event.target === janelaImagem
        ) {

            janelaImagem.classList.remove(
                "mostrar"
            );

        }

    }
);


document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            janelaImagem.classList.remove(
                "mostrar"
            );

        }

    }
);


// =====================================================
// FASE 11: INICIALIZAÇÃO
// =====================================================

// Primeiro carrega as tarefas salvas
carregarDoLocalStorage();

// Depois mostra as tarefas na tela
renderizarTarefas();