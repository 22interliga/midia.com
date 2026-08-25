# Last Mile DS — V5

Versão frontend para GitHub Pages.

## Novidades V5
- SLA com período (data inicial/final), motorista, base e localidade.
- Cadastro de motoristas com nome, telefone, nascimento, rota desejada, valor por pacote, banco, agência, conta, PIX e base.
- Estrutura inicial com 4 bases configuráveis e possibilidade de expansão.
- Gestão de despesas com descrição, valor, data, forma de pagamento, categoria e base.
- Usuários/Admin com perfis: Super Admin, Dono/Admin, Operação, Financeiro e Consulta.
- Aniversariantes do dia e preparação de mensagem de feliz aniversário.
- Assistente inteligente local para SLA, bases, motoristas e ocorrências.
- Waybill agora registra base e localidade.

## Atenção sobre produção
GitHub Pages é somente frontend. Login seguro, banco de dados real, disparo automático por WhatsApp/SMS/e-mail e IA real devem ser conectados por backend/API. Não coloque chaves de API ou senhas no JavaScript público.

## Publicar
Envie `index.html`, `app.js`, `styles.css`, `manifest.webmanifest` e `sw.js` para a raiz do repositório configurado no GitHub Pages.
