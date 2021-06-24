// IMPORTANDO O VENOM E O DIALOGFLOW
const venom = require("venom-bot");
const dialogflow = require("@google-cloud/dialogflow");

// INICIANDO O DIALOGFLOW E CONFIGURANDO COM O USO DA KEY GERADA EM JSON,
// DEVE SE ENCONTRAR NA RAIZ DO PROJETO
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "guiazap-ephqvf.json",
});
// FUNCOES USADAS DA DOCUMENTACAO NORMAL QUE ESTAO NO README.md EM LINKS ÚTEIS
async function detectIntent(
  projectId,
  sessionId,
  query,
  contexts,
  languageCode
) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}
async function executeQueries(projectId, sessionId, queries, languageCode) {
  let context;
  let intentResponse;
  for (const query of queries) {
    try {
      console.log(`Sending Query: ${query}`);
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        query,
        context,
        languageCode
      );
      console.log("Detected intent");
      return `${intentResponse.queryResult.fulfillmentText}`;
    } catch (error) {
      console.log(error);
    }
  }
} // FIM DA CONFIGURACAO E FUNCOES DO DIALOGFLOW

// INICIANDO O VENOM BOT
// PARAMETROS USADO PELO VENOM
const parameters = {
  headless: true, // Headless chrome
  devtools: false, // Abre devtools por padrão
  useChrome: true, // Se false, usará a instância do Chromium
  debug: false, // Abre uma sessão de depuração
  logQR: true, //  registra QR automaticamente no terminal
  browserArgs: [""], // Parâmetros a serem adicionados à instância do navegador Chrome
  refreshQR: 15000, // Atualizará o QR a cada 15 segundos, 0 irá carregar o QR uma vez. O padrão é 30 segundos
  autoClose: 60000, // Fechará automaticamente se não estiver sincronizado, 'false' não fechará automaticamente. O padrão é 60 segundos (#Important !!! Irá definir automaticamente 'refreshQR' para 1000 #)
  disableSpins: true, // Desativará a animação do Spinnies, útil para contêineres (docker) para um registro melhor
};
// INICIANDO CREATE DO VENOM
venom.create("sessionName").then((client) => start(client));

// FUNCAO START DO CLIENTE DO VENOM BOT
function start(client) {
  // FUNCAO QUE CAPTURA AS MENSAGEM CHEGADAS DO WPP USANDO O VENOM
  client.onMessage(async message => {

        const contact = await client.getContact(message.from).then(result => {
          return result.pushname || result.verifiedName || ''
      }).catch(error => {
        console.log(error);
      });

    // EXECUTANDO QUERY DIALOGFLOW
    let textResponse = await executeQueries("guiazap-ephqvf", message.from, [message.body], 'pt-BR');

    // ENVIANDO QUERY RETORNADA
    await client.sendText(message.from, textResponse);



    //enviando texto simples com imagens
    if (textResponse === "Vou te falar como funciona o serviço de Chatbot para WhatsApp...") {
      await client
        .sendImage(
          `${message.from}`,
          "img/whatsapp.jpg",
          "image-name",
          "Não é novidade nenhuma que o Whatsapp é o queridinho dos Brasileiros.\n" +
            "94% da população possui um telefone com o mensageiro instalado e isso é muito bom para quem procura compartilhar e crescer suas vendas seja de produto físico ou Digital.\n" +
            "\n" +
            "🚀 A idéia é, transformar uma rotina cansativa em *lucros*, por isso eu criei um *Treinamento Profissional*, onde mostro como você poderá Ganhar Dinheiro criando respostas automáticas para o WhatsApp.\n" +
            "\n"+
            "👉🏻 Clique no Link abaixo. Você será Direcionado para a página do curso e verá todas as vantagens do curso.\n \n" +
            "https://bit.ly/chatbot-wa\n" +                       
            "-------------------------\n" +
            "👉🏻Para Voltar Digite *#* ou *0* para Sair\n"
        )        
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }

    //enviando texto simples com imagens Outro Assunto
    if (textResponse ==="Muito bem, você escolheu *Falar Sobre Outro Assunto*..."    ) {
      await client
        .sendImage(
          `${message.from}`,
          "img/marcos.jpg",
          "image-name",         

          `Certo ${contact}\n Fale diretamente com o Prof. Marcos clicando no link abaixo.\n` +            
            "-------------------------\n" +
            "https://wa.me/5585985282207\n" +            
            "-------------------------\n" +
            "👉🏻Para Voltar Digite # ou 0 para Sair\n"
        )
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }

    //enviando texto simples com imagens Treinamento Gratis
    if (textResponse ==="Você escolheu Curso Grátis..."    ) {
      await client
        .sendImage(
          `${message.from}`,
          "img/treinamento.jpg",
          "image-name",
          `${contact}\n Acesse o link para se inscrever no treinamento gratuito logo abaixo. Você não paga nada é totalmente gratuito.\n` +            
            "-------------------------\n" +
            "https://bit.ly/chatbot-gratis\n" +            
            "-------------------------\n" +
            "👉🏻Para Voltar Digite # ou 0 para Sair\n"
        )
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }

    //LinkPreview
    if (textResponse === "Muito bem, você escolheu o melhor...") {
      await client
        .sendLinkPreview(
          `${message.from}`,
          "https://youtu.be/wg0FDrOkL9k",
          "Segue o primeiro vídeo 👍\n" + "-------------------------\n" + "👉🏻Para Voltar Digite # ou 0 para Sair"
        )
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }

    //enviando texto simples com imagens Grupo Vip
    if (textResponse ==="Muito bem, você está no caminho certo..."    ) {
      await client
        .sendImage(
          `${message.from}`,
          "img/marcos.jpg",
          "image-name",
          `Certo ${contact}\nFale diretamente com o Prof. Marcos clicando no link abaixo.\n` +            
            `-------------------------\n` +
            `https://wa.me/5585985282207\n` +            
            `-------------------------\n` +
            `👉🏻Para Voltar Digite # ou 0 para Sair\n`
        )
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }

    //codigo teste
    if (textResponse === "Contato.") {
      await client
      setProfileStatus(
        'Estou de ferias! ✈️'
        )
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }
  });
}
// FIM DO VENOM BOT
//para rodar projeto dar um node index.js
// para atualizar => npm i venom-bot@3.0.5 <--- (colocar o numero da versão)
