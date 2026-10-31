# G-City

G-City é um catálogo de ferramentas estáticas para criar cenários e aventuras de RPG. A página inicial reúne os geradores e cada ferramenta é mantida em seu próprio repositório, incluído aqui como submódulo Git.

## Geradores disponíveis

| Gerador | O que cria |
| --- | --- |
| [Spectacular Settlements Generator](./generators/spectacular-settlements/index.html) | Postos comerciais, vilas, cidades, capitais e fortalezas, além de encontros, rumores, tavernas e outros extras. Tem interface em inglês e português, registro de rolagens e modificadores e exportação dos resultados em TXT. |
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

Inicie um servidor HTTP na pasta raiz:

```bash
python -m http.server
```

Abra <http://localhost:8000>. O servidor é necessário para carregar os componentes compartilhados da página inicial.

## Estrutura do projeto

```text
├── index.html                 # Catálogo e página inicial
├── components/
│   ├── header/header.html     # Cabeçalho compartilhado
│   └── footer/footer.html     # Rodapé compartilhado
├── css/landing.css            # Estilos da página inicial
├── js/layout.js               # Carrega cabeçalho e rodapé
└── generators/
    ├── spectacular-settlements/  # Submódulo do gerador de assentamentos
    └── forbidden-lands/          # Submódulo dos geradores de Forbidden Lands
```

Os geradores são projetos independentes; consulte o README de cada submódulo para detalhes de suas páginas e funcionalidades. Para atualizar o catálogo e os submódulos:

```bash
git pull --recurse-submodules
git submodule update --init --recursive
```
