const PDFDocument = require('pdfkit');

export default async function handler(req, res) {
    // Add CORS headers, just in case they test it locally opening index.html directly
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { lead, scores, analysisCategories, chartImage } = req.body;

        // Create a document
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        // Set response headers to force download (attachment)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Diagnostico_${lead?.company || 'Empresa'}.pdf"`);

        // Stream the PDF to the response
        doc.pipe(res);

        // Styling
        const primaryColor = '#1A1A1A';
        const goldColor = '#C8A869';

        // Header
        doc.fillColor(goldColor)
           .fontSize(24)
           .text('WINNERS CLUB', { align: 'center' });
        
        doc.moveDown();
        
        doc.fillColor(primaryColor)
           .fontSize(20)
           .text('Diagnóstico Empresarial 360°', { align: 'center' });

        doc.moveDown(2);

        // Lead Info
        doc.fontSize(14).fillColor(goldColor).text('Dados da Empresa');
        doc.moveDown(0.5);
        doc.fillColor(primaryColor).fontSize(12);
        
        if (lead) {
            doc.text(`Nome: ${lead.name}`);
            doc.text(`Empresa: ${lead.company}`);
            doc.text(`E-mail: ${lead.email}`);
            doc.text(`Telefone: ${lead.phone}`);
            doc.text(`Data: ${new Date(lead.date).toLocaleDateString('pt-BR')}`);
        }

        doc.moveDown(2);

        // Scores
        doc.fontSize(14).fillColor(goldColor).text('Pontuações por Área');
        doc.moveDown(0.5);
        doc.fillColor(primaryColor).fontSize(12);
        
        if (scores) {
            for (const [category, score] of Object.entries(scores)) {
                if (category !== 'Geral') {
                    doc.text(`${category}: ${score.toFixed(1)} / 10`);
                }
            }
            
            doc.moveDown(1);
            doc.fontSize(16).fillColor(goldColor).text(`Nota Geral: ${scores['Geral'].toFixed(1)} / 10`);
        }

        doc.moveDown(2);

        // Chart Image
        if (chartImage) {
            try {
                // Strip the data:image/png;base64, part
                const base64Data = chartImage.replace("data:image/png;base64,", "");
                const imgBuffer = Buffer.from(base64Data, 'base64');
                
                doc.image(imgBuffer, {
                    fit: [400, 400],
                    align: 'center'
                });
            } catch(e) {
                console.error("Error drawing chart image", e);
            }
        }
        
        doc.addPage();

        // Textual Analysis
        doc.fontSize(18).fillColor(goldColor).text('Análise Estratégica');
        doc.moveDown(1);

        if (analysisCategories) {
            for (const { category, text } of analysisCategories) {
                doc.fontSize(14).fillColor(primaryColor).text(category, { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(12).text(text);
                doc.moveDown(1.5);
            }
        }

        // Finalize PDF file
        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
}
