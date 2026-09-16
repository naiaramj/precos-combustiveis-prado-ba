# Preços de Combustíveis — Prado/BA

Projeto acadêmico desenvolvido para a disciplina de **Arquitetura de Dados Relacionais I**, com o objetivo de organizar, consultar e divulgar informações sobre os preços de combustíveis em postos de Prado, Bahia.

O projeto contempla desde a modelagem e implementação de um banco de dados relacional até o desenvolvimento de uma interface web para disponibilização das informações à comunidade.

## Sobre o projeto

Os dados foram obtidos por meio de coletas realizadas em **cinco postos de combustíveis de Prado/BA**, contemplando:

- Gasolina Comum
- Gasolina Aditivada
- Etanol
- Diesel

Foram realizadas **cinco coletas em datas diferentes para cada posto**, no período de **12/08/2026 a 12/09/2026**, totalizando **100 registros de preços**.

## Funcionalidades

O site permite:

- consultar o menor e o maior preço de cada combustível;
- visualizar o preço médio e a quantidade de amostras por posto e combustível;
- consultar os preços mais recentes;
- acompanhar a evolução dos preços por posto e combustível;
- visualizar a evolução do preço médio dos combustíveis;
- comparar a evolução dos diferentes combustíveis em cada posto.

## Banco de dados

O banco de dados foi desenvolvido em **MySQL** e estruturado em 3ª Forma Normal (3FN).

As principais entidades são:

- `POSTO`
- `TELEFONE_POSTO`
- `COMBUSTIVEL`
- `COLETA_PRECO`

Os scripts utilizados na implementação estão disponíveis na pasta `database`:

```text
database/
├── 01-criacao-banco.sql
├── 02-insercao-dados.sql
└── 03-consultas.sql
```

## Modelagem

Os modelos conceitual e lógico utilizados no desenvolvimento do banco estão disponíveis na pasta `docs`.

```text
docs/
├── modelo-conceitual.png
└── modelo-logico.png
```

## Tecnologias utilizadas

- MySQL
- HTML5
- CSS3
- JavaScript
- Chart.js
- Git e GitHub
- GitHub Pages

## Estrutura do projeto

```text
precos-combustiveis-prado-ba/
├── css/
│   └── style.css
├── dados/
│   └── coletas.csv
├── database/
│   ├── 01-criacao-banco.sql
│   ├── 02-insercao-dados.sql
│   └── 03-consultas.sql
├── docs/
│   ├── modelo-conceitual.png
│   └── modelo-logico.png
├── js/
│   └── script.js
├── index.html
└── README.md
```

## Fonte dos dados

Os preços utilizados neste projeto foram coletados diretamente em postos de combustíveis de **Prado/BA** para fins acadêmicos.

Os valores apresentados correspondem ao período das coletas e podem não representar os preços atualmente praticados pelos estabelecimentos.

## Autora

**Naiara Moreira**

Graduanda em Análise e Desenvolvimento de Sistemas — UVV.