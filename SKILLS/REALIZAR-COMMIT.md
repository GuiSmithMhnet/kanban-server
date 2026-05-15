# Skill: Realizar Commit

## Objetivo

Orientar e executar commits Git no repositório atual com um padrão consistente de mensagem.

Use esta skill apenas quando o usuário pedir explicitamente algo como:

- "use a skill REALIZAR-COMMIT"
- "execute a skill de commit"
- "faça o commit usando a skill REALIZAR-COMMIT"

Não execute esta skill por semelhança.

Não execute esta skill automaticamente quando o usuário apenas pedir para "commitar".

Se o pedido parecer compatível, mas não citar explicitamente a skill, pergunte antes:

- "Você quer que eu use a skill REALIZAR-COMMIT?"

## Escopo

Esta skill faz apenas duas coisas:

- orientar rapidamente o que será commitado
- executar o commit

Esta skill não deve:

- abrir pull request
- fazer push
- alterar branch
- executar rebase
- resolver conflitos
- reescrever histórico

## Fluxo obrigatório

1. Ler `git status --short` para entender o escopo atual.
2. Inspecionar os arquivos modificados que entrarão no commit.
3. Agrupar mentalmente as alterações em um único tema de commit.
4. Definir uma mensagem no padrão desta skill.
5. Executar `git add` apenas dos arquivos que pertencem ao escopo do commit.
6. Executar `git commit` com a mensagem final.

Se houver alterações não relacionadas ao pedido do usuário, não inclua essas alterações no commit.

Se o working tree estiver misturado e não for seguro separar o escopo sem risco, pare e informe isso ao usuário.

## Padrão de mensagem

Toda mensagem de commit deve seguir este formato:

```txt
tipo(escopo): resumo
```

Se o escopo não agregar valor, use:

```txt
tipo: resumo
```

### Tipos permitidos

- `feat`: nova funcionalidade visível
- `fix`: correção de bug
- `refactor`: mudança estrutural sem alterar comportamento esperado
- `ui`: ajuste visual ou de experiência
- `docs`: documentação
- `chore`: manutenção, configuração ou tarefa operacional
- `db`: migration, ajuste de schema ou operação ligada ao banco

### Regras da mensagem

- usar letras minúsculas no `tipo`
- usar resumo curto, direto e no imperativo
- evitar ponto final
- evitar mensagens genéricas como `ajustes`, `update`, `changes`
- inferir `tipo` e `escopo` pelo contexto real das alterações

### Exemplos

- `feat(espacos): add user list grid`
- `fix(convites): validate expired invite before accept`
- `ui(usuarios): replace table with data grid`
- `docs: update system documentation page`
- `db(convites): add cancelado status migration`

## Critério de execução

Quando esta skill for explicitamente solicitada, ela pode executar `git add` e `git commit` diretamente, sem pedir confirmação final extra.

Mesmo assim, antes do commit, a resposta deve informar de forma objetiva:

- quais arquivos entrarão no commit
- qual mensagem será usada

Se o usuário tiver pedido uma mensagem específica, respeite a mensagem se ela não violar claramente o padrão desejado do projeto.

Se violar, ajuste para o padrão e informe a adaptação.

## Regras de segurança

Nunca inclua no commit:

- arquivos não relacionados ao pedido
- segredos
- arquivos de ambiente local
- artefatos temporários

Nunca use comandos destrutivos para "limpar" a árvore de trabalho.

Não use `git add .` se houver risco de capturar alterações fora do escopo.

Prefira adicionar caminhos específicos.

## Resposta final esperada

Depois de executar a skill, informe:

- a mensagem de commit usada
- os arquivos incluídos
- se houve arquivos modificados deixados de fora por estarem fora de escopo
