## Descrição
Esse projeto foi criado para gerar um agente de viagens que use LLMs (ChatGPT) para criar um roteiro de viagens personalizado, adicionando contexto através de RAG onde foi-se adicionando arquivos de pdf com dicas de viagem para locais especificos, também se fez uma busca na internet utilizando o duckduckgo para encontrar preços de passagens e a wikipedia para adicionar mais contexto.

## Instalação

```bash
$ yarn install
```

## Running 
A primeira vez que for rodar deve-se fazer uma cópia do arquivo `config/development.env` e renomeá-lo para `config/local.env` adicionando uma chave válida para usar o api do OPENAI
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev
```
O servidor deve ficar rodando na porta 3000

## Testes
Não implementados ainda

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Como usar
Após rodar o app como descrito anteriormente pode se chamar o endpoint de `http://localhost/healt-check` para verificar se o app está rodando normalmente.
Depois disso deve-se chamar o diretório raiz passando os parametros de origem, destino, pais e data 
no momento só foi adicionado context de 3 países, Inglaterra, Portugal e Alemanha, todos retirados do site dicasdeviagem.com

Um exemplo de chamada seria:
`http://localhost/?pais=inglaterra&origem=Salvador&data=Dezembro de 2024&destino=Londres`

Com a seguinte resposta
```
Claro, vou preparar um roteiro de viagem para você em Londres em Dezembro de 2024, incluindo eventos sazonais e o preço
das passagens de Salvador para Londres.

Roteiro de Viagem para Londres em Dezembro de 2024:

Dia 1:
- Chegada em Londres
- Check-in no hotel
- Passeio pela região de Westminster, visitando o Big Ben, o Parlamento e a Abadia de Westminster
- Jantar em um restaurante local

Dia 2:
- Café da manhã
- Visita ao Museu Britânico
- Almoço em um pub tradicional
- Tarde livre para compras na Oxford Street
- Jantar em um restaurante típico de Londres

Dia 3:
- Café da manhã
- Visita à Torre de Londres e à Tower Bridge
- Almoço em um mercado de rua
- Tarde no bairro de Camden Town, conhecido por suas lojas alternativas e mercados
- Jantar em um restaurante com culinária internacional

Dia 4:
- Café da manhã
- Passeio pelo bairro de Notting Hill, famoso pelas casas coloridas e pelo mercado de Portobello Road
- Almoço em um café local
- Tarde no Museu de História Natural
- Jantar em um restaurante com vista para o Rio Tâmisa

Dia 5:
- Café da manhã
- Visita ao Palácio de Buckingham para a troca da guarda
- Almoço em um restaurante próximo ao Palácio
- Tarde livre para explorar o bairro de Covent Garden
- Jantar em um restaurante com música ao vivo

Dia 6:
- Café da manhã
- Visita ao Museu de Arte Moderna Tate Modern
- Almoço em um restaurante com vista para a Catedral de São Paulo
- Tarde no bairro de South Bank, com suas atrações culturais e gastronômicas
- Jantar em um restaurante com culinária britânica contemporânea

Dia 7:
- Café da manhã
- Últimas compras e passeios pela cidade
- Check-out do hotel
- Transfer para o aeroporto

Preço das passagens de Salvador para Londres em Dezembro de 2024:
- O preço das passagens de ida e volta para Londres em Dezembro de 2024 varia de acordo com a companhia aérea e a
antecedência da compra. Recomendo pesquisar em sites de busca de passagens aéreas para encontrar as melhores opções
disponíveis.

Espero que este roteiro seja útil para a sua viagem a Londres em Dezembro de 2024. Aproveite a cidade e os eventos
sazonais que estarão acontecendo durante a sua estadia!
```

## License
[MIT licensed](LICENSE).
