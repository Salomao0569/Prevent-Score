# Calculadora PREVENT™ — Risco Cardiovascular (AHA 2024)

[![Licença: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-green.svg)](LICENSE)
![HTML](https://img.shields.io/badge/HTML-arquivo%20%C3%BAnico-orange)
![Status](https://img.shields.io/badge/valida%C3%A7%C3%A3o-100%25%20vs%20AHA%20oficial-brightgreen)

Calculadora de risco cardiovascular baseada nas equações **PREVENT™** (Predicting Risk of cardiovascular disease EVENTs) da **American Heart Association** (Khan et al., *Circulation* 2024), em um **único arquivo HTML**, offline e sem dependências.

> 🇬🇧 *A single-file, offline, dependency-free implementation of the AHA PREVENT™ cardiovascular risk equations (2024), in Brazilian Portuguese. Validated bit-for-bit against the official AHA calculator.*

---

## ✨ Recursos

- **Risco em 10 e 30 anos** para os 3 desfechos exibidos pela calculadora oficial da AHA: **DCV total, ASCVD e Insuficiência Cardíaca**
- **4 modelos**, selecionados automaticamente conforme os dados disponíveis:
  - Base
  - + RAC urinária (UACR)
  - + HbA1c
  - Completo (UACR + HbA1c)
- **Conversor creatinina → TFG** embutido (CKD-EPI Creatinina 2021, sem raça)
- Faixas de validação clínica com aviso quando um valor está fora do intervalo
- **Tema claro/escuro**, resumo para prontuário (copiar) e impressão
- **100% client-side e offline** — nenhum dado sai do navegador

## 🚀 Como usar

Não precisa instalar nada.

1. Baixe o arquivo [`calculadora-prevent.html`](calculadora-prevent.html)
2. Abra no navegador (duplo clique)
3. Preencha os campos — o cálculo é instantâneo

Ou clone o repositório:

```bash
git clone https://github.com/Salomao0569/Prevent-Score.git
```

## ✅ Fidelidade validada

A calculadora foi verificada de forma exaustiva contra a **calculadora oficial da AHA**:

- **~20.000 comparações** contra o motor de cálculo oficial da AHA (o mesmo que alimenta o site `professional.heart.org`) — **zero divergências**
- **Enumeração 100% completa** das combinações discretas (sexo × diabetes × tabagismo × anti-hipertensivo × estatina × modelo)
- **Varredura densa** de cada variável contínua em toda a faixa válida — diferença máxima **0,0000**
- **Coeficientes conferidos bit a bit** contra o material suplementar do artigo
- Conversor **CKD-EPI 2021** validado ponta a ponta

### Rodar a validação você mesmo

Requer [Node.js](https://nodejs.org) 18+ e internet (não precisa de `npm install`):

```bash
node validation/validate.js 60      # 60 pacientes aleatórios vs backend oficial da AHA
# ou:  npm run validate
```

Saída esperada: `✅ App idêntico à calculadora oficial da AHA`. Detalhes em [`validation/`](validation/).

## 🤖 Amigável para agentes de IA

Este repositório é preparado para contribuições assistidas por IA (Claude Code, Cursor, Copilot, etc.):

- **[`AGENTS.md`](AGENTS.md)** — instruções que agentes de IA leem automaticamente: arquitetura, onde está cada parte do cálculo e a **regra de ouro** (os resultados devem permanecer idênticos aos da AHA).
- **[`validation/`](validation/)** — harness executável que qualquer IA pode rodar para **verificar a própria mudança** contra a calculadora oficial da AHA, antes de abrir um PR.

## 📚 Referência científica

> Khan SS, Matsushita K, Sang Y, et al. **Development and Validation of the American Heart Association's PREVENT Equations.** *Circulation.* 2024;149(6):430–449. [doi:10.1161/CIRCULATIONAHA.123.067626](https://doi.org/10.1161/CIRCULATIONAHA.123.067626)

Conversor de TFG: Inker LA, et al. *New Creatinine- and Cystatin C–Based Equations to Estimate GFR without Race.* N Engl J Med. 2021;385:1737-1749.

## 🤝 Como contribuir

Contribuições são muito bem-vindas! Veja o guia em [CONTRIBUTING.md](CONTRIBUTING.md).

### 💡 Ideias para contribuir

- 🌎 **Traduções** — versões em inglês e espanhol da interface
- ♿ **Acessibilidade** — melhorias de leitura por leitores de tela e navegação por teclado
- 🔤 **Fontes offline** — embutir as fontes no arquivo para eliminar a chamada ao Google Fonts
- 🇺🇸 **Suporte a SDI** — campo de CEP/ZIP e tabela de deciles do SDI para usuários dos EUA
- 🧪 **Cistatina C** — opção do CKD-EPI Creatinina-Cistatina C 2021
- 🧰 **Testes automatizados** — incluir no repositório o harness de validação contra a AHA
- 📄 **Exportação** — melhorar a saída em PDF / relatório clínico
- 🎨 **UI/UX** — refinamentos visuais e de responsividade em telas pequenas

Abra uma *issue* para discutir ideias ou relatar problemas.

## ⚠️ Aviso clínico

Ferramenta de **apoio à decisão** para prevenção primária em adultos de **30 a 79 anos sem DCV prévia**. **Não substitui** o julgamento clínico nem a avaliação médica individual. Valores fora das faixas validadas são limitados ao extremo mais próximo, com alerta. Não use em pacientes com DCV conhecida, DRC em estágio terminal ou outras contraindicações descritas na literatura da PREVENT.

## 📄 Licença

Distribuído sob a licença **MIT** — veja [LICENSE](LICENSE).
