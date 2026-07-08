# Validação

Ferramentas para verificar que o app produz **os mesmos resultados da calculadora oficial
da AHA**. Não fazem parte do app — são só para testes (por humanos ou agentes de IA).

## Requisitos

- [Node.js](https://nodejs.org) 18+ (usa `fetch`/`https` nativo, **sem `npm install`**)
- Conexão com a internet (a validação chama o backend oficial da AHA em tempo real)

## Rodar

```bash
# 60 pacientes aleatórios (padrão)
node validation/validate.js

# N pacientes com semente fixa (reprodutível)
node validation/validate.js 200 12345
```

Saída esperada:

```
Comparações: 300 | idênticas: 300 | divergentes: 0 | pacientes: 60
Maior diferença: 0.0000
✅ App idêntico à calculadora oficial da AHA
```

Código de saída **0** = tudo idêntico · **1** = houve divergência.

## Como funciona

- `harness.js` — extrai o `COEF`, as funções `buildTerms`/`riskFor` e o `RANGES`
  **diretamente** de `../calculadora-prevent.html` (não reimplementa nada) e roda um paciente.
- `validate.js` — gera pacientes aleatórios cobrindo os 4 modelos (base, +RAC, +HbA1c,
  completo), chama o backend oficial da AHA
  (`professional.heart.org/aha-service/PHDSearch/PreventCalculate`) e compara os desfechos
  DCV, ASCVD e Insuficiência Cardíaca em 10 e 30 anos.

> Observação: o backend oficial retorna apenas DCV, ASCVD e IC. Os desfechos **Doença
> Coronariana e AVC** exibidos no app usam os mesmos coeficientes publicados (conferidos
> contra o suplemento do artigo), mas não são comparáveis por esta rota.

## Conferir coeficientes contra a fonte canônica (avançado)

Os coeficientes do app foram validados bit a bit contra o material suplementar do artigo,
usando o pacote R [`preventr`](https://github.com/martingmayer/preventr) (que transcreve as
tabelas oficiais). O arquivo `R/sysdata.rda` desse pacote contém os coeficientes rotulados;
comparar cada um com o `COEF` do app reproduz a verificação (2.140 coeficientes, diferença 0).
