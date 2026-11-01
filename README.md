# G-City

G-City é um catálogo de ferramentas estáticas para criar cenários e aventuras de RPG. A página inicial oferece alternância entre português e inglês e encaminha a preferência aos geradores. Cada ferramenta é mantida em seu próprio repositório, incluído aqui como submódulo Git.

## Geradores disponíveis

| Gerador | O que cria |
| --- | --- |
| [Spectacular Settlements Generator](./generators/spectacular-settlements/index.html) | Postos comerciais, vilas, cidades, capitais e fortalezas, além de encontros, rumores, tavernas e outros extras. Tem interface em inglês e português, registro de rolagens e modificadores e exportação dos resultados em TXT e PDF. |
| [Forbidden Lands Generator](./generators/forbidden-lands/index.html) | Aldeias, masmorras e castelos. Oferece troca de idioma, exportação em TXT, registro de rolagens e rerrolagem de campos. |

## Executar localmente

Clone o repositório e inicialize os submódulos:

```bash
git clone --recurse-submodules https://github.com/Tadeu-Raphael/gcity.github.io.git
cd gcity.github.io
```

Se o repositório já foi clonado sem submódulos, inicialize-os com:

```bash
git submodule update --init --recursive
```

Abra `index.html` diretamente no navegador. Para servir o projeto por HTTP local, também é possível iniciar um servidor na pasta raiz:

```bash
python -m http.server
```

Depois, abra <http://localhost:8000>.

## Estrutura do projeto

```text
├── index.html                 # Catálogo e página inicial
├── assets/icons/lucide/       # Subconjunto local de ícones SVG
├── css/
│   ├── landing.css            # Estilos da página inicial
│   └── paper-ui.css           # Tema visual compartilhado inspirado em papel
├── js/
│   └── ui-icons.js            # Substitui emojis da interface por ícones Lucide
└── generators/
    ├── spectacular-settlements/  # Submódulo do gerador de assentamentos
    └── forbidden-lands/          # Submódulo dos geradores de Forbidden Lands
```

Os geradores são projetos independentes e incluem cópias locais do tema visual e dos ícones, com os respectivos avisos de licença. Nenhum deles carrega layout, CSS, scripts ou imagens do repositório raiz; por isso, cada submódulo pode funcionar sozinho ou dentro do GitHub Pages do G-City. Consulte o README de cada projeto para detalhes de suas páginas e funcionalidades. Para atualizar o catálogo e os submódulos:

```bash
git pull --recurse-submodules
git submodule update --init --recursive
```

## Aparência

O catálogo e os geradores usam o tema local `css/paper-ui.css`, adaptado da linguagem visual de papel do [Ephemera](https://github.com/kerrshift/ephemera). Os ícones usam um subconjunto local de SVGs Lucide, funcionando no GitHub Pages e em arquivos locais sem CDN. A integração mantém HTML, CSS e JavaScript estáticos: não exige React, Tailwind, serviços externos ou etapas de build. Os avisos de licença estão em [`licenses/EPHEMERA-MIT.txt`](./licenses/EPHEMERA-MIT.txt) e [`licenses/LUCIDE-ISC.txt`](./licenses/LUCIDE-ISC.txt).
