# 📄 CV Generator

> Crie currículos profissionais em minutos. Um gerador de CV moderno, responsivo e open-source.

[![GitHub stars](https://img.shields.io/github/stars/gustavodeoliveiradev/cv-generator?style=social)](https://github.com/gustavodeoliveiradev/cv-generator/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/gustavodeoliveiradev/cv-generator?style=social)](https://github.com/gustavodeoliveiradev/cv-generator/network)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![Preview](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/version-0.1.0-blue)

---

## 🎯 Sobre o Projeto

O **CV Generator** é uma aplicação web que permite criar currículos profissionais de forma intuitiva, com:

- ✏️ **Edição em tempo real** - Veja seu CV sendo construído enquanto digita
- 🎨 **Múltiplos temas** - Escolha entre diferentes estilos profissionais  
- 🔤 **Fontes personalizáveis** - Seleção de fontes do Google Fonts
- 💾 **Persistência local** - Seus dados são salvos automaticamente
- 📱 **Totalmente responsivo** - Funciona em desktop, tablet e mobile
- 📄 **Exportação PDF** - Baixe seu currículo em alta qualidade

**Demo:** [https://gustavodeoliveiradev.github.io/cv-generator/](https://gustavodeoliveiradev.github.io/cv-generator) *(em breve)*

---

## 🚀 Roadmap de Desenvolvimento

Projeto construído em **7 dias** com commits diários. Acompanhe nossa evolução:

| Dia | Data | Feature | Status | Commit |
|:---:|:----:|---------|:------:|--------|
| 1 | 11/04/2026 | Estrutura modular + Formulário base | ✅ | `feat: modular architecture` |
| 2 | 12/04/2026 | **3 Temas visuais + Fontes dinâmicas** | ✅ | `feat: theme system with 3 styles and google fonts` |
| 3 | 13/04/2026 | Preview responsivo mobile | ⏳ | - |
| 4 | 14/04/2026 | Exportação PDF real | ⏳ | - |
| 5 | 15/04/2026 | Validações + UX polish | ⏳ | - |
| 6 | 16/04/2026 | Import/Export JSON + Drag-drop | ⏳ | - |
| 7 | 17/04/2026 | Deploy + README definitivo | ⏳ | - |

**Legenda:** ✅ Concluído | 🔄 Em andamento | ⏳ Pendente

---

## 🛠️ Stack Tecnológica

### Core
- **HTML5** semântico e acessível
- **CSS3** com variáveis CSS e Grid/Flexbox
- **JavaScript ES6+** modular (sem frameworks)

### Features
- **Google Fonts API** - Integração dinâmica de fontes
- **html2canvas + jsPDF** - Geração de PDF (Dia 4)
- **localStorage** - Persistência de dados
- **GitHub Pages** - Hospedagem gratuita

### Arquitetura
```
📁 cv-generator/
├── 📄 index.html          # Estrutura principal
├── 📁 css/
│   ├── base.css           # Variáveis e reset
│   ├── layout.css         # Grid e responsivo
│   ├── components.css     # UI components
│   ├── preview.css        # Estilos do CV
│   └── themes/            # Temas customizados
├── 📁 js/
│   ├── app.js             # Entry point
│   ├── state.js           # Gerenciamento de estado
│   ├── storage.js         # localStorage
│   ├── preview.js         # Renderização
│   ├── formHandler.js     # Eventos do formulário
│   └── utils.js           # Funções utilitárias
└── 📄 README.md           # Este arquivo
```

---

## 📦 Instalação

### Clone o repositório
```bash
git clone https://github.com/gustavodeoliveiradev/cv-generator.git
cd cv-generator
```

### Rode localmente
Como é um projeto estático, você pode:

**Opção 1 - Live Server (VS Code)**
```bash
# Instale a extensão "Live Server" no VS Code
# Clique com botão direito em index.html → "Open with Live Server"
```

**Opção 2 - Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Opção 3 - Node.js**
```bash
npx serve .
```

Acesse `http://localhost:8000`

---

## 🎨 Temas Disponíveis

| Tema | Descrição | Preview |
|------|-----------|---------|
| **Default** | Clean e minimalista | *Dia 1* |
| **Modern** | Cores vibrantes, design 2024 | *Dia 2* |
| **Classic** | Tradicional, corporativo | *Dia 2* |
| **Creative** | Para designers e artistas | *Dia 2* |
| **Tech** | Estilo developer-friendly | *Dia 2* |

---

## 📝 Funcionalidades

### ✅ Implementadas (Dia 2)
- [x] Formulário multi-etapas intuitivo
- [x] Preview em tempo real (live)
- [x] Adicionar/remover experiências dinamicamente
- [x] Adicionar/remover educação dinamicamente
- [x] Persistência automática no localStorage
- [x] Arquitetura modular (Separação de responsabilidades)
- [x] Design responsivo base
- [x] Validações visuais de campos
- [x] Sistema de 3 temas visuais (Minimalista, Moderno, Criativo)
- [x] Switcher de fontes do Google Fonts (5 opções)
- [x] Persistência de preferências de tema
- [x] Transições suaves entre temas
- [x] Preview em tempo real das mudanças

### 🔄 Em Desenvolvimento
- [ ] Switcher de temas (Dia 2)
- [ ] Seletor de fontes Google Fonts (Dia 2)
- [ ] Exportação PDF real (Dia 4)
- [ ] Validações de formulário avançadas (Dia 5)

### ⏳ Futuras
- [ ] Importação/Exportação JSON
- [ ] Drag & drop para reordenar seções
- [ ] Múltiplos idiomas (i18n)
- [ ] Modo escuro no editor
- [ ] QR Code no CV

---

## 🤝 Como Contribuir

Quer ajudar? Siga os passos:

1. **Fork** o projeto
2. Crie uma **branch** (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. Abra um **Pull Request**

### Convenções de Commit
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação (sem mudança de código)
refactor: refatoração
test: testes
chore: manutenção
```

---

## 📸 Screenshots

### Editor (Dia 1)
*Em breve*

### Preview do CV
*Em breve*

### Mobile
*Em breve*

---

## 🎯 Objetivos de Aprendizado

Este projeto demonstra domínio em:

- **Arquitetura Frontend** - Modularização, padrões de projeto
- **Manipulação de DOM** - Event delegation, templates dinâmicos
- **Estado da Aplicação** - Gerenciamento sem frameworks
- **Persistência** - localStorage, import/export de dados
- **UX/UI** - Design responsivo, feedback visual, acessibilidade
- **DevOps** - CI/CD com GitHub Actions, deploy automatizado

---

## 📚 Recursos Úteis

- [roadmap.sh - Single Page CV](https://roadmap.sh/projects/single-page-cv) - Projeto base
- [Google Fonts API](https://developers.google.com/fonts/docs/getting_started)
- [html2canvas](https://html2canvas.hertzen.com/) - Screenshots HTML
- [jsPDF](https://parall.ax/products/jspdf) - Geração de PDF

---

## 👨‍💻 Autor

**Gustavo de Oliveira**

- GitHub: [@gustavodeoliveiradev](https://github.com/gustavodeoliveiradev)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2026 Gustavo de Oliveira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 💜 Agradecimentos

- [roadmap.sh](https://roadmap.sh) pela ideia do projeto base
- Comunidade open-source pelas ferramentas incríveis
- **Mestre Kimi** pela mentoria e arquitetura modular 😉

---

<p align="center">
  <strong>⭐ Star este repo se te ajudou!</strong><br>
  <small>Construído com 💙 e muito café durante 7 dias</small>
</p>

---

**Última atualização:** 11/04/2026 - Dia 1 concluído ✅
