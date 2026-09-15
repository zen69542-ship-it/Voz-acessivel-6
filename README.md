# Convive

Site institucional sobre acessibilidade e inclusão digital, feito para a **Feira Tecnológica 2026 — ETEC Guariba** (componente curricular Programação para Internet).

O projeto não é só uma página falando *sobre* acessibilidade — os recursos descritos nele estão de fato implementados e funcionando no próprio site (leitura em voz alta, alto contraste, paletas para daltonismo, modo seguro para epilepsia/fotossensibilidade, fonte para dislexia, modo de acessibilidade motora, tradução para Libras).

## Estrutura do projeto

```
├── index.html            Página inicial
├── missao.html           Por que a inclusão importa (núcleo da missão)
├── preconceito.html      Preconceito, discriminação e desigualdade
├── polarizacao.html      Um consenso incompleto (debate global sobre o tema)
├── legislacao.html       Leis e decretos que sustentam a acessibilidade escolar
├── acessibilidade.html   Recursos de acessibilidade ativos + conteúdo educativo
├── tecnologia.html       Arquitetura técnica, como fizemos e como testamos
├── equipe.html           Equipe do projeto
├── contato.html          Formulário, canais de contato e QR codes da feira
├── style.css             Estilos principais (design system, layout, temas)
├── motor.css / motor.js  Módulo de acessibilidade motora
├── libras.css / libras.js / libras-data.js   Painel de Libras próprio do site
├── script.js             Lógica geral (painel de acessibilidade, narrador, animações)
├── favicon.svg           Ícone do site
├── ROTEIRO-APRESENTACAO.md   Roteiro de apresentação para a feira, dividido entre os 7 integrantes
└── img/                  Imagens usadas nas páginas
```

## Como rodar localmente

É um site estático — não tem build nem dependências para instalar. Duas formas de abrir:

1. **Direto no navegador**: dando duplo clique em `index.html`.
   ⚠️ Alguns recursos (como o widget do VLibras) só funcionam servidos por `http(s)://`, não abrindo o arquivo direto (`file://`). Se notar algo estranho só nesse modo, use a opção 2.
2. **Com um servidor local** (recomendado): na pasta do projeto, rode:
   ```bash
   python3 -m http.server 8000
   ```
   e acesse `http://localhost:8000` no navegador.

## Recursos de acessibilidade implementados

- Leitura da página em voz alta (Web Speech API)
- Alto contraste, fonte ampliável e fonte facilitada para dislexia
- Paletas para os 7 tipos de daltonismo
- Modo seguro para epilepsia e fotossensibilidade (desliga toda animação e neutraliza cores/imagens)
- Acessibilidade motora: toque ampliado, espaçamento maior, remoção de gestos, confirmação de ações, cursor grande, foco ampliado e tempo estendido para avisos
- Tradução para Libras: painel próprio do site + [VLibras](https://www.vlibras.gov.br/), o tradutor automático oficial do Governo Federal

Todos esses ajustes ficam no painel de acessibilidade, acessível pelo botão flutuante no canto inferior direito de qualquer página.

## Publicando com GitHub Pages

1. Suba este repositório para o GitHub.
2. Vá em **Settings → Pages**.
3. Em "Source", selecione a branch `main` e a pasta `/ (root)`.
4. Salve — o GitHub gera um link (algo como `https://seu-usuario.github.io/nome-do-repo/`) em alguns minutos.

## Projeto

Feira Tecnológica 2026 — ETEC Guariba — Programação para Internet.
