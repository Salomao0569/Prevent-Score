# AGENTS.md — Guia para agentes de IA

> Este arquivo orienta assistentes de IA (Claude Code, Cursor, Copilot, etc.) que forem
> ler, editar ou revisar este repositório. Humanos: veja o [README](README.md) e o
> [CONTRIBUTING](CONTRIBUTING.md).

## O que é este projeto

Calculadora de risco cardiovascular baseada nas equações **PREVENT™** da American Heart
Association (Khan et al., *Circulation* 2024). Tudo vive em **um único arquivo**:
`calculadora-prevent.html` (HTML + CSS + JavaScript, sem dependências, offline).

## 🚦 REGRA DE OURO

**Os resultados numéricos DEVEM permanecer idênticos aos da calculadora oficial da AHA.**

Se você alterar qualquer coisa que afete o cálculo, **valide antes de concluir**:

```bash
node validation/validate.js 60        # 60 pacientes aleatórios vs backend oficial da AHA
```

- Saída esperada: `✅ App idêntico à calculadora oficial da AHA` (código de saída 0).
- Requer internet (a validação chama o backend oficial da AHA em tempo real).
- Se aparecer qualquer divergência, a mudança está **errada** — reverta ou corrija.

Mudanças puramente visuais/textuais (CSS, rótulos) não precisam de revalidação.

## Onde está o quê (em `calculadora-prevent.html`)

| Item | O que é |
|---|---|
| `const COEF = {...}` | Coeficientes das equações PREVENT (idênticos ao suplemento do artigo — **não editar sem fonte oficial**). |
| `function buildTerms(...)` | Monta os termos do modelo (transformações, centragem, interações). |
| `function riskFor(...)` | Aplica coeficientes → logito → probabilidade. |
| `const RANGES = {...}` | Faixas de validação de entrada (clamping). Devem casar com as da AHA. |
| Handler `#crApply` | Conversor creatinina → TFG (CKD-EPI Creatinina 2021). |
| `function ascvdCategory(...)` | Classificação de risco (limiares ACC/AHA: 5 / 7,5 / 20%). |

## Restrições de arquitetura (respeite)

- **Arquivo único**: não separe em vários arquivos, não adicione bundler/build.
- **Sem dependências externas** e **sem backend**: nada de npm no app, nada de chamadas de rede
  em produção. Todo cálculo é client-side. (A pasta `validation/` é só ferramenta de teste, não faz parte do app.)
- **Sem dados do paciente saindo do navegador** — privacidade é requisito.
- **Idioma da interface**: português (pt-BR).
- **Não** inclua chaves, tokens, endpoints privados ou referências a sistemas de terceiros.

## Como validar coeficientes contra a fonte canônica (opcional, avançado)

Os coeficientes foram conferidos bit a bit contra o material suplementar do artigo, via o
pacote R `preventr` (que os transcreve). Se precisar reconferir, veja `validation/README.md`.

## Estilo

- Combine o estilo do código existente (nomes, indentação, densidade de comentários).
- Prefira mudanças pequenas e focadas. Explique o "porquê" nos commits/PRs.
