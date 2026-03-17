const { Resend } = require('resend');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Responder OPTIONS para CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Aceitar apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { lead, scores, overallScore, pdfBase64 } = req.body;

    // Validar dados obrigatórios
    if (!lead || !scores || !overallScore || !pdfBase64) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Verificar se a API key está configurada
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY não configurada');
      return res.status(500).json({ error: 'Configuração de e-mail ausente' });
    }

    // Inicializar Resend
    const resend = new Resend(apiKey);

    // Formatar scores para exibição no e-mail
    const scoresFormatted = Object.entries(scores)
      .map(([category, score]) => `${category}: ${score.toFixed(1)}/10`)
      .join('\n');

    // Converter base64 para buffer
    const pdfBuffer = Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ''), 'base64');

    // Enviar e-mail
    const { data, error } = await resend.emails.send({
      from: 'Diagnóstico 360° <onboarding@resend.dev>', // Email padrão do Resend (você pode configurar domínio próprio)
      to: ['eduardokopeski@gmail.com'],
      subject: `Novo Diagnóstico - ${lead.empresa || 'Empresa não informada'}`,
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .header {
                background-color: #C8A869;
                color: white;
                padding: 20px;
                text-align: center;
              }
              .content {
                padding: 20px;
              }
              .section {
                margin-bottom: 20px;
              }
              .label {
                font-weight: bold;
                color: #C8A869;
              }
              .scores {
                background-color: #f4f4f4;
                padding: 15px;
                border-radius: 5px;
                white-space: pre-line;
              }
              .overall-score {
                font-size: 24px;
                font-weight: bold;
                color: #C8A869;
                text-align: center;
                padding: 20px;
                background-color: #f4f4f4;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📊 Novo Diagnóstico Empresarial 360°</h1>
            </div>
            <div class="content">
              <div class="section">
                <h2>Dados do Lead</h2>
                <p><span class="label">Nome:</span> ${lead.nome || 'Não informado'}</p>
                <p><span class="label">Empresa:</span> ${lead.empresa || 'Não informada'}</p>
                <p><span class="label">E-mail:</span> ${lead.email || 'Não informado'}</p>
                <p><span class="label">Telefone:</span> ${lead.telefone || 'Não informado'}</p>
              </div>

              <div class="section">
                <h2>Pontuação Geral</h2>
                <div class="overall-score">
                  ${overallScore.toFixed(1)}/10
                </div>
              </div>

              <div class="section">
                <h2>Pontuação por Área</h2>
                <div class="scores">
${scoresFormatted}
                </div>
              </div>

              <div class="section">
                <p style="color: #666; font-size: 14px;">
                  O relatório completo em PDF está anexado a este e-mail.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `Diagnostico-${lead.empresa?.replace(/\s+/g, '-') || 'Empresa'}-${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfBuffer,
        }
      ]
    });

    if (error) {
      console.error('Erro ao enviar e-mail:', error);
      return res.status(500).json({ error: 'Erro ao enviar e-mail', details: error });
    }

    console.log('E-mail enviado com sucesso:', data);
    return res.status(200).json({ success: true, messageId: data.id });

  } catch (error) {
    console.error('Erro no processamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};
