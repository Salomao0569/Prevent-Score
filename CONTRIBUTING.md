# Como contribuir

Obrigado pelo interesse em contribuir com a **Calculadora PREVENT™**! 🎉
Toda ajuda é bem-vinda — de correções de texto a novas funcionalidades.

## 🐛 Relatar um problema ou sugerir uma ideia

1. Verifique se já não existe uma [issue](https://github.com/Salomao0569/Prevent-Score/issues) parecida.
2. Abra uma nova issue descrevendo:
   - **O que aconteceu** (ou o que você gostaria de ver);
   - **Como reproduzir** (se for um bug): valores digitados, navegador, etc.;
   - **O que era esperado**.

## 🔧 Enviar uma melhoria (Pull Request)

1. Faça um **fork** do repositório.
2. Crie uma branch descritiva:
   ```bash
   git checkout -b minha-melhoria
   ```
3. Faça suas alterações em `calculadora-prevent.html`.
4. Teste abrindo o arquivo no navegador e conferindo o resultado.
5. Faça commit e push:
   ```bash
   git commit -m "Descreve a mudança"
   git push origin minha-melhoria
   ```
6. Abra um **Pull Request** explicando o que mudou e por quê.

## 🧱 Arquitetura do projeto

- **Arquivo único**: todo o app (HTML + CSS + JavaScript) vive em `calculadora-prevent.html`. Isso é intencional — mantém a calculadora portátil e offline. Por favor, **não** adicione dependências externas ou etapas de build sem discutir antes numa issue.
- **Idioma da interface**: português (pt-BR).
- **Sem backend**: o cálculo é 100% client-side. Nenhum dado do paciente deve sair do navegador.

## 🧪 Mexeu no cálculo? Revalide!

Este projeto tem um compromisso central: **os resultados devem ser idênticos aos da calculadora oficial da AHA**.

Se a sua mudança tocar em:
- coeficientes das equações,
- construção dos termos / transformações,
- faixas de validação, ou
- a fórmula do CKD-EPI,

então valide o resultado contra a calculadora oficial em
<https://professional.heart.org/en/guidelines-and-statements/prevent-calculator>
para **vários pacientes** (diferentes sexos, idades e modelos) antes de abrir o PR. Descreva no PR como você validou.

Mudanças puramente visuais/textuais não precisam de revalidação.

## 💡 Onde ajudar

Veja a seção **"Ideias para contribuir"** no [README](README.md#-ideias-para-contribuir). Boas primeiras tarefas: traduções, fontes offline e melhorias de acessibilidade.

## 📜 Licença

Ao contribuir, você concorda que sua contribuição será licenciada sob a licença **MIT** do projeto.
