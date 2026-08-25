# Middia.com — Operação Last Mile V6

Versão GitHub Pages do painel operacional Last Mile.

## V6
- Identidade visual baseada na logo Middia.com (azul e verde).
- Logo aplicada no sistema.
- Gestão de despesas em formato de planilha.
- Cadastro de despesa/pagamento com dados bancários e de PIX: valor, data, horário, forma, status, beneficiário, CPF/CNPJ, instituição, agência, conta, chave PIX, pagador, responsável, categoria e base.
- Exportação das despesas para CSV, compatível com Excel.
- SLA com período, motorista, base e localidade.
- Cadastro de motoristas com nascimento, rota, valor por pacote, dados bancários, PIX e base.
- Estrutura de usuários/admin e IA mantidas para futura conexão com backend.
- Dados fictícios removidos. A V6 usa uma nova chave de armazenamento local, portanto não carrega os dados demonstrativos da V5.
- Mantidos 4 espaços iniciais de base (`Base 1` a `Base 4`) para serem renomeados com os nomes reais.

## Publicar no GitHub Pages
Envie todos os arquivos deste pacote para a raiz do repositório e substitua os anteriores. Depois faça Ctrl+F5 ao abrir a página publicada.

## Observação
Login seguro, envio automático de aniversário por WhatsApp e IA externa exigem backend/autenticação e não devem guardar senhas/chaves de API no GitHub Pages.
