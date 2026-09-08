# Quando o agente diz “sucesso”, quem prova que aconteceu?

A próxima fronteira dos agentes de IA não é fazê-los executar mais coisas.

É conseguir provar, depois de uma ação consequencial, que o que aconteceu no mundo externo corresponde ao que foi autorizado.

Esse problema está ficando mais urgente porque os agentes deixaram de ser apenas interfaces conversacionais. Eles consultam sistemas, chamam APIs, alteram registros, movimentam dados, iniciam workflows e, cada vez mais, executam ações que produzem efeitos reais.

Nesse cenário, uma mensagem do agente dizendo “concluído” não é uma prova.

Um HTTP 200 também não é.

E um log produzido pelo próprio executor tampouco deveria ser tratado como verificação independente.

## O problema da autorização não termina na autorização

A primeira geração de controles para agentes concentrou-se em identidade e acesso: quem é o agente, quais ferramentas pode usar e quais operações estão dentro do seu escopo.

Essa camada é necessária. Mas ela responde a uma pergunta diferente:

**o agente podia tentar fazer isso?**

Não responde:

**o efeito externo realmente correspondeu ao que foi autorizado?**

A diferença parece pequena até o momento em que uma ação crítica produz um estado diferente daquele que deveria produzir.

Um agente pode estar autenticado.
Pode ter autorização válida.
Pode chamar a ferramenta correta.
Pode receber uma resposta tecnicamente bem-sucedida.

E ainda assim o estado externo pode estar errado, incompleto, divergente ou simplesmente impossível de verificar.

## O novo limite de confiança

Para sistemas agentivos de produção, a fronteira de confiança deveria ser explícita:

**INTENT → AUTHORIZATION → EXECUTION → OBSERVED EFFECT**

A intenção define o que se pretende realizar.

A autorização transforma essa intenção em uma permissão delimitada.

A execução realiza a operação por meio de um worker.

A observação independente lê o sistema externo.

Só então uma camada de verificação pode responder se existe correspondência entre o efeito autorizado e o efeito observado.

Essa separação é importante porque o executor não deve ser o juiz da própria execução.

## Três respostas são melhores que uma falsa certeza

Em sistemas reais, o resultado não deveria ser simplesmente “sucesso” ou “falha”.

Há pelo menos três situações distintas:

**CONFIRMED** — existe evidência independente suficiente de que o efeito observado corresponde ao autorizado.

**DEVIATED** — existe evidência de que o efeito observado não corresponde ao autorizado.

**INCONCLUSIVE** — não existe evidência suficiente para afirmar nenhuma das duas coisas.

A terceira resposta é particularmente importante.

Um sistema sério precisa ter permissão técnica para dizer “não sei”.

Transformar ausência de evidência em sucesso é uma das formas mais perigosas de automação.

## Isso muda a arquitetura

O agente não deveria possuir sozinho toda a autoridade da cadeia.

Uma arquitetura mais confiável separa responsabilidades:

- uma camada interpreta a intenção;
- uma política determina o que pode ser autorizado;
- uma autoridade assina o escopo;
- um worker executa;
- um observador independente lê o efeito externo;
- um verificador compara autorização e observação;
- um ledger preserva a evidência;
- uma receipt permite auditoria posterior.

O ponto não é tornar agentes menos autônomos.

É permitir que sejam mais autônomos sem exigir que a empresa simplesmente acredite neles.

## A pergunta que eu faria antes de colocar um agente em produção

Não perguntaria apenas:

“Ele consegue executar?”

Perguntaria:

**“Se amanhã esse agente executar uma ação crítica e disser que deu certo, quem consegue provar independentemente o que realmente aconteceu?”**

Se a resposta for “o próprio agente”, ainda existe um problema arquitetural.

Se a resposta for “temos logs”, a pergunta seguinte é: quem produziu esses logs, eles são íntegros e eles provam o efeito externo ou apenas a chamada?

Se a resposta for “temos uma API retornando sucesso”, ainda falta observar o estado que realmente importa.

A era dos agentes autônomos exige uma nova disciplina: não basta autorizar a ação. É preciso conseguir verificar o efeito.

Essa é, na minha visão, uma das próximas camadas fundamentais da infraestrutura de IA.

— Reinaldo Freitas
Founder, Spiral Codes

## Sources / market references

- Fetch.ai AEVS — Agent Execution Verification System
- Ory / Tetrate — runtime authorization and parameter-level authorization for agents
- MCP ecosystem — authorization and security hardening
- Spiral Intent — independent execution assurance architecture
