/**
 * Diagnóstico Empresarial 360 - Main Script
 */

// --- 1. CONFIGURATION & DATA ---

const questionsData = [
    // Mentalidade
    { category: 'Mentalidade', text: 'De 0 a 10, qual o seu nível de clareza hoje sobre a visão e o crescimento futuro da sua empresa?' },
    { category: 'Mentalidade', text: 'De 0 a 10, como você avalia sua capacidade de tomar decisões importantes mesmo em momentos de pressão ou incerteza?' },
    { category: 'Mentalidade', text: 'De 0 a 10, o quanto você consegue manter foco estratégico em vez de apenas apagar incêndios no dia a dia?' },
    { category: 'Mentalidade', text: 'De 0 a 10, como você avalia sua capacidade de lidar com problemas e desafios sem perder o equilíbrio emocional?' },
    { category: 'Mentalidade', text: 'De 0 a 10, o quanto você se sente mentalmente preparado para levar sua empresa para o próximo nível de crescimento?' },
    
    // Vendas
    { category: 'Vendas', text: 'De 0 a 10, qual o nível de organização e clareza do processo de vendas da sua empresa?' },
    { category: 'Vendas', text: 'De 0 a 10, qual o nível de previsibilidade de faturamento que sua empresa possui hoje?' },
    { category: 'Vendas', text: 'De 0 a 10, qual o nível de preparo e treinamento da equipe comercial para gerar resultados?' },
    { category: 'Vendas', text: 'De 0 a 10, qual o nível de desenvolvimento de parcerias ou novos canais que ajudam a gerar vendas na sua empresa?' },
    { category: 'Vendas', text: 'De 0 a 10, qual o nível de confiança que você tem hoje na capacidade da sua empresa de gerar vendas de forma constante?' },
    
    // Marketing
    { category: 'Marketing', text: 'De 0 a 10, qual o nível de posicionamento e autoridade da sua empresa nas redes sociais ou no mercado?' },
    { category: 'Marketing', text: 'De 0 a 10, como você avalia a constância da presença da empresa nas redes sociais ou canais de comunicação com o mercado?' },
    { category: 'Marketing', text: 'De 0 a 10, como você avalia a frequência com que sua empresa produz conteúdos ou grava vídeos para atrair clientes e gerar autoridade?' },
    { category: 'Marketing', text: 'De 0 a 10, qual o nível de diferenciação da sua empresa em relação aos concorrentes?' },
    { category: 'Marketing', text: 'De 0 a 10, como você avalia a frequência com que você ou sua equipe realizam reuniões para planejar estratégias de marketing e de geração de novos clientes?' },
    
    // Jornada do Cliente
    { category: 'Jornada do Cliente', text: 'De 0 a 10, qual o nível de organização do processo de atendimento ao cliente na sua empresa?' },
    { category: 'Jornada do Cliente', text: 'De 0 a 10, como você avalia a qualidade da experiência que o cliente vive ao comprar da sua empresa?' },
    { category: 'Jornada do Cliente', text: 'De 0 a 10, qual o nível de acompanhamento que sua empresa faz com o cliente após a venda?' },
    { category: 'Jornada do Cliente', text: 'De 0 a 10, como você avalia a capacidade da empresa de gerar fidelização e recompra de clientes?' },
    { category: 'Jornada do Cliente', text: 'De 0 a 10, qual o nível de satisfação percebida dos clientes com os seus produtos ou serviços?' },
    
    // Liderança
    { category: 'Liderança', text: 'De 0 a 10, qual o nível de clareza de papéis e responsabilidades dentro da sua equipe?' },
    { category: 'Liderança', text: 'De 0 a 10, qual o nível de engajamento e comprometimento das pessoas com os resultados da empresa?' },
    { category: 'Liderança', text: 'De 0 a 10, como você avalia a consistência das reuniões de alinhamento e gestão com a sua equipe?' },
    { category: 'Liderança', text: 'De 0 a 10, como você avalia a capacidade da liderança de delegar responsabilidades sem centralizar tudo no empresário?' },
    { category: 'Liderança', text: 'De 0 a 10, qual o nível de alinhamento da equipe com os objetivos e visão da empresa?' }
];

const categories = ['Mentalidade', 'Vendas', 'Marketing', 'Jornada do Cliente', 'Liderança'];

// --- 2. STATE MANAGEMENT ---

let currentQuestionIndex = 0;
let userAnswers = new Array(questionsData.length).fill(5); // Default to middle value (5)
let leadData = null;
let radarChartInstance = null;

// --- 3. DOM ELEMENTS ---

const screens = {
    welcome: document.getElementById('screen-welcome'),
    quiz: document.getElementById('screen-quiz'),
    lead: document.getElementById('screen-lead'),
    result: document.getElementById('screen-result')
};

// Quiz elements
const questionText = document.getElementById('question-text');
const categoryBadge = document.getElementById('category-badge');
const progressFill = document.getElementById('progress-fill');
const progressCount = document.getElementById('progress-count');
const totalCount = document.getElementById('total-count');
const slider = document.getElementById('answer-slider');
const sliderValue = document.getElementById('slider-value');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const questionCard = document.getElementById('question-card');

// Welcome & Lead elements
const btnStart = document.getElementById('btn-start');
const leadForm = document.getElementById('lead-form');
const btnRestart = document.getElementById('btn-restart');

// Results elements
const scoresList = document.getElementById('scores-list');
const analysisList = document.getElementById('analysis-list');
const ctxRadar = document.getElementById('radarChart');
const btnDownloadPdf = document.getElementById('btn-download-pdf');

// --- 4. INITIALIZATION ---

function init() {
    totalCount.textContent = questionsData.length;

    // Event Listeners
    btnStart.addEventListener('click', startQuiz);
    btnNext.addEventListener('click', handleNext);
    btnPrev.addEventListener('click', handlePrev);

    slider.addEventListener('input', (e) => {
        const val = e.target.value;
        sliderValue.textContent = val;
        userAnswers[currentQuestionIndex] = parseInt(val, 10);
        updateSliderVisuals(val);
    });

    leadForm.addEventListener('submit', handleLeadSubmit);
    btnRestart.addEventListener('click', restartDiagnosis);
    if(btnDownloadPdf) {
        btnDownloadPdf.addEventListener('click', handleDownloadPdf);
    }
}

// --- 5. SCREEN TRANSITIONS ---

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });

    screens[screenName].classList.remove('hidden');
    // small timeout to allow display:flex to apply before animation
    setTimeout(() => {
        screens[screenName].classList.add('active');
    }, 10);

    // Scroll to top
    window.scrollTo(0, 0);
}

// --- 6. QUIZ LOGIC ---

function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(questionsData.length).fill(5);
    renderQuestion();
    showScreen('quiz');
}

function renderQuestion() {
    const q = questionsData[currentQuestionIndex];

    // Auto-remove and re-add fade-in class for animation
    questionCard.classList.remove('fade-in');
    void questionCard.offsetWidth; // trigger reflow
    questionCard.classList.add('fade-in');

    questionText.textContent = q.text;
    categoryBadge.textContent = q.category;
    progressCount.textContent = currentQuestionIndex + 1;

    const percentage = ((currentQuestionIndex) / questionsData.length) * 100;
    progressFill.style.width = `${Math.max(4, percentage)}%`;

    // Reset slider to saved answer or default
    const savedVal = userAnswers[currentQuestionIndex];
    slider.value = savedVal;
    sliderValue.textContent = savedVal;
    updateSliderVisuals(savedVal);

    // Button states
    btnPrev.style.visibility = currentQuestionIndex === 0 ? 'hidden' : 'visible';

    if (currentQuestionIndex === questionsData.length - 1) {
        btnNext.textContent = 'Concluir Diagnóstico';
    } else {
        btnNext.textContent = 'Próxima Pergunta';
    }
}

function updateSliderVisuals(val) {
    const percent = (val / 10) * 100;
    slider.style.background = `linear-gradient(to right, var(--color-secondary) 0%, var(--color-secondary) ${percent}%, #E2E8F0 ${percent}%, #E2E8F0 100%)`;
}

function handleNext() {
    if (currentQuestionIndex < questionsData.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        // Form is finished, fill progress to 100%
        progressFill.style.width = '100%';
        setTimeout(() => {
            showScreen('lead');
        }, 400);
    }
}

function handlePrev() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

// --- 7. LEAD CAPTURE ---

function handleLeadSubmit(e) {
    e.preventDefault();

    leadData = {
        name: document.getElementById('lead-name').value,
        company: document.getElementById('lead-company').value,
        email: document.getElementById('lead-email').value,
        phone: document.getElementById('lead-phone').value,
        date: new Date().toISOString()
    };

    // Simulating LocalStorage
    const finalData = {
        lead: leadData,
        answers: userAnswers,
        scores: calculateScores()
    };

    // Data is kept in memory only (not persisted)
    console.log("Data collected:", finalData);

    generateResults();
}

// --- 8. CALCULATIONS & RESULTS ---

function calculateScores() {
    const scores = {};
    categories.forEach(cat => scores[cat] = 0);

    // Sum
    let totalSum = 0;
    questionsData.forEach((q, idx) => {
        scores[q.category] += userAnswers[idx];
        totalSum += userAnswers[idx];
    });

    // Average
    const questionsPerCategory = 5;
    categories.forEach(cat => {
        scores[cat] = Number((scores[cat] / questionsPerCategory).toFixed(1));
    });

    // General average
    const generalScore = Number((totalSum / questionsData.length).toFixed(1));
    scores['Geral'] = generalScore;

    return scores;
}

function generateResults() {
    showScreen('result');
    const scores = calculateScores();

    renderRadarChart(scores);
    renderScoresList(scores);
    renderTextualAnalysis(scores);
    renderGeneralScore(scores);
}

function renderGeneralScore(scores) {
    const gScore = scores['Geral'];
    const status = getStatusByScore(gScore);

    const valueEl = document.getElementById('general-score-value');
    const badgeEl = document.getElementById('general-status-badge');

    if (valueEl && badgeEl) {
        valueEl.textContent = gScore.toFixed(1);
        badgeEl.textContent = status.text;
        badgeEl.className = `score-badge ${status.labelClass}`;
    }
}

function getStatusByScore(score) {
    if (score <= 4.9) return { id: 'critical', text: 'Crítico', labelClass: 'status-critical', indicatorClass: 'indicator-critical' };
    if (score <= 7.9) return { id: 'developing', text: 'Em Desenvolvimento', labelClass: 'status-developing', indicatorClass: 'indicator-developing' };
    return { id: 'strong', text: 'Forte', labelClass: 'status-strong', indicatorClass: 'indicator-strong' };
}

function renderScoresList(scores) {
    scoresList.innerHTML = '';

    categories.forEach(cat => {
        const score = scores[cat];
        const status = getStatusByScore(score);

        const item = document.createElement('div');
        item.className = 'score-item';
        item.innerHTML = `
            <span class="score-label">${cat}</span>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span class="score-badge ${status.labelClass}">${status.text}</span>
                <span class="score-value">${score}</span>
            </div>
        `;
        scoresList.appendChild(item);
    });
}

function renderTextualAnalysis(scores) {
    analysisList.innerHTML = '';

    const analysisDict = {
        'Mentalidade': {
            critical: "Sua mentalidade pode estar limitando o crescimento do negócio. Há foco excessivo no operacional e pouca clareza estratégica.",
            developing: "Você tem clareza de alguns pontos, mas ainda se deixa absorver por incêndios e sente a pressão nas tomadas de decisão.",
            strong: "A mentalidade está preparada para a escala. Clareza estratégica, controle emocional e foco no crescimento a longo prazo."
        },
        'Vendas': {
            critical: "O processo de vendas é inexistente ou caótico. Falta previsibilidade e confiança na geração de caixa da empresa.",
            developing: "Existe um esforço comercial, mas a previsibilidade oscila e o time precisa de mais processos e treinamento.",
            strong: "Máquina de vendas estruturada. Há previsibilidade de caixa, processo validado e equipe comercial engajada."
        },
        'Marketing': {
            critical: "A empresa é praticamente invisível no mercado digital. Não há clareza na atração de clientes nem constância.",
            developing: "Há iniciativas de marketing, mas falta um posicionamento forte e uma constância que gere autoridade diária.",
            strong: "Marca forte e posicionada. Geração constante de demanda, produção de conteúdo de valor e presença digital consolidada."
        },
        'Jornada do Cliente': {
            critical: "A experiência pós-venda é falha. Não há acompanhamento e o índice de recompra ou fidelização é muito baixo.",
            developing: "O atendimento existe, mas a experiência do usuário pode ser mais estruturada para garantir uma retenção sustentável.",
            strong: "Excelência no atendimento e na experiência. Retenção alta, clientes fidelizados que promovem ativamente sua marca."
        },
        'Liderança': {
            critical: "Equipe desalinhada e centralização excessiva. O empresário é o gargalo da operação e não há gestão de pessoas.",
            developing: "Há líderes em formação ou delegação inicial, mas faltam rituais de gestão consistentes para acompanhar o time.",
            strong: "Liderança forte e processos delegados. Equipe engajada, rodando a empresa com alto nível de autonomia e eficácia."
        }
    };

    categories.forEach(cat => {
        const score = scores[cat];
        const status = getStatusByScore(score);
        const textMessage = analysisDict[cat][status.id];

        const item = document.createElement('div');
        item.className = 'analysis-item';
        item.innerHTML = `
            <div class="analysis-title">
                <span class="indicator ${status.indicatorClass}"></span>
                ${cat}
            </div>
            <div class="analysis-desc">${textMessage}</div>
        `;
        analysisList.appendChild(item);
    });
}

function renderRadarChart(scores) {
    const dataValues = categories.map(cat => scores[cat]);

    if (radarChartInstance) {
        radarChartInstance.destroy();
    }

    radarChartInstance = new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Sua Pontuação',
                data: dataValues,
                backgroundColor: 'rgba(200, 168, 105, 0.2)', // secondary gold opaque
                borderColor: '#C8A869', // var(--color-secondary)
                pointBackgroundColor: '#0A0A0A', // var(--color-bg-main)
                pointBorderColor: '#C8A869',
                pointHoverBackgroundColor: '#C8A869',
                pointHoverBorderColor: '#fff',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: {
                        font: { family: "'Inter', sans-serif", size: 13, weight: '600' },
                        color: '#E5E5E5'
                    },
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        display: false // hides axis numbers
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function restartDiagnosis() {
    leadForm.reset();
    showScreen('welcome');
}

async function handleDownloadPdf() {
    const originalText = btnDownloadPdf.textContent;
    btnDownloadPdf.textContent = 'Gerando PDF...';
    btnDownloadPdf.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pw = doc.internal.pageSize.getWidth();   // ~595
        const ph = doc.internal.pageSize.getHeight();  // ~842
        const mx = 50;   // margin X
        const maxW = pw - mx * 2;
        let y = 0;

        const scores = calculateScores();
        const gold = [197, 168, 109];    // #C5A869
        const darkBg = [10, 10, 10];     // #0A0A0A
        const white = [255, 255, 255];
        const gray = [142, 142, 142];

        // ========== HELPER FUNCTIONS ==========
        function addPage() {
            doc.addPage();
            y = 0;
            drawPageBg();
        }

        function drawPageBg() {
            doc.setFillColor(...darkBg);
            doc.rect(0, 0, pw, ph, 'F');
        }

        function checkPageBreak(needed) {
            if (y + needed > ph - 60) {
                addPage();
                y = 50;
            }
        }

        function drawGoldLine(yPos) {
            doc.setDrawColor(...gold);
            doc.setLineWidth(0.5);
            doc.line(mx, yPos, pw - mx, yPos);
        }

        // ========== PAGE 1: COVER ==========
        drawPageBg();

        // Gold accent bar at the very top
        doc.setFillColor(...gold);
        doc.rect(0, 0, pw, 6, 'F');

        // Branding
        y = 80;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...gold);
        doc.setFontSize(32);
        doc.text('RESULTA MAIS', mx, y);

        y += 24;
        doc.setFontSize(10);
        doc.setTextColor(...gray);
        doc.text('ACELERAÇÃO EMPRESARIAL  •  ESTRATÉGIA  •  SUCESSO', mx, y);

        y += 60;
        drawGoldLine(y);

        // Title
        y += 50;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...white);
        doc.setFontSize(28);
        doc.text('Diagnóstico Empresarial 360°', mx, y);

        y += 30;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        doc.setTextColor(...gray);
        doc.text('Relatório completo de performance e maturidade empresarial.', mx, y);

        // Lead data box
        y += 60;
        doc.setFillColor(20, 20, 20);
        doc.roundedRect(mx, y, maxW, 120, 8, 8, 'F');

        y += 30;
        doc.setFontSize(10);
        doc.setTextColor(...gold);
        doc.setFont('helvetica', 'bold');
        doc.text('DADOS DO PARTICIPANTE', mx + 20, y);

        y += 22;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...white);
        doc.setFontSize(11);
        const leadItems = [
            `Nome: ${leadData?.name || '-'}`,
            `Empresa: ${leadData?.company || '-'}`,
            `Email: ${leadData?.email || '-'}`,
            `Telefone: ${leadData?.phone || '-'}`
        ];
        leadItems.forEach(item => {
            doc.text(item, mx + 20, y);
            y += 18;
        });

        // Date
        y += 30;
        doc.setFontSize(10);
        doc.setTextColor(...gray);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, mx, y);

        // Footer line
        drawGoldLine(ph - 60);
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        doc.text('Relatório gerado por Resulta Mais — Todos os direitos reservados.', mx, ph - 40);

        // ========== PAGE 2: RADAR CHART ==========
        addPage();

        // Gold accent bar
        doc.setFillColor(...gold);
        doc.rect(0, 0, pw, 6, 'F');

        y = 50;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...gold);
        doc.setFontSize(20);
        doc.text('RADAR ESTRATÉGICO', mx, y);

        y += 12;
        drawGoldLine(y);

        // Embed radar chart image
        y += 30;
        if (radarChartInstance) {
            const chartImg = radarChartInstance.toBase64Image('image/png', 1);
            const chartSize = 340;
            const chartX = (pw - chartSize) / 2;
            doc.addImage(chartImg, 'PNG', chartX, y, chartSize, chartSize);
            y += chartSize + 30;
        }

        // General score
        const generalScore = scores['Geral'];
        const generalStatus = getStatusByScore(generalScore);

        doc.setFillColor(20, 20, 20);
        doc.roundedRect(mx, y, maxW, 70, 8, 8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...white);
        doc.setFontSize(14);
        doc.text('Nota Geral', mx + 20, y + 28);

        doc.setFontSize(32);
        doc.setTextColor(...gold);
        doc.text(generalScore.toFixed(1), mx + 20, y + 58);

        // Status badge
        doc.setFontSize(12);
        doc.setTextColor(...gray);
        doc.text(`  ${generalStatus.text}`, mx + 90, y + 55);

        y += 90;

        // Category scores
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...gold);
        doc.setFontSize(16);
        doc.text('PONTUAÇÕES POR ÁREA', mx, y);
        y += 25;

        categories.forEach(cat => {
            checkPageBreak(55);
            const score = scores[cat];
            const status = getStatusByScore(score);
            const pct = (score / 10) * maxW;

            // Category row
            doc.setFillColor(20, 20, 20);
            doc.roundedRect(mx, y, maxW, 45, 6, 6, 'F');

            // Label
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...white);
            doc.setFontSize(11);
            doc.text(cat, mx + 15, y + 18);

            // Score
            doc.setTextColor(...gold);
            doc.setFontSize(18);
            doc.text(score.toFixed(1), pw - mx - 60, y + 22);

            // Progress bar background
            doc.setFillColor(30, 30, 30);
            doc.roundedRect(mx + 15, y + 28, maxW - 100, 8, 4, 4, 'F');

            // Progress bar fill
            doc.setFillColor(...gold);
            const barW = Math.max(4, ((score / 10) * (maxW - 100)));
            doc.roundedRect(mx + 15, y + 28, barW, 8, 4, 4, 'F');

            // Status
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(...gray);
            doc.text(status.text, pw - mx - 30, y + 36, { align: 'right' });

            y += 55;
        });

        // Footer
        drawGoldLine(ph - 60);
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        doc.text('Relatório gerado por Resulta Mais — Todos os direitos reservados.', mx, ph - 40);

        // ========== PAGE 3: ANALYSIS ==========
        addPage();

        // Gold accent bar
        doc.setFillColor(...gold);
        doc.rect(0, 0, pw, 6, 'F');

        y = 50;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...gold);
        doc.setFontSize(20);
        doc.text('ANÁLISE DETALHADA', mx, y);

        y += 12;
        drawGoldLine(y);
        y += 30;

        const analysisDict = {
            'Mentalidade': {
                critical: "Sua mentalidade pode estar limitando o crescimento do negócio. Há foco excessivo no operacional e pouca clareza estratégica.",
                developing: "Você tem clareza de alguns pontos, mas ainda se deixa absorver por incêndios e sente a pressão nas tomadas de decisão.",
                strong: "A mentalidade está preparada para a escala. Clareza estratégica, controle emocional e foco no crescimento a longo prazo."
            },
            'Vendas': {
                critical: "O processo de vendas é inexistente ou caótico. Falta previsibilidade e confiança na geração de caixa da empresa.",
                developing: "Existe um esforço comercial, mas a previsibilidade oscila e o time precisa de mais processos e treinamento.",
                strong: "Máquina de vendas estruturada. Há previsibilidade de caixa, processo validado e equipe comercial engajada."
            },
            'Marketing': {
                critical: "A empresa é praticamente invisível no mercado digital. Não há clareza na atração de clientes nem constância.",
                developing: "Há iniciativas de marketing, mas falta um posicionamento forte e uma constância que gere autoridade diária.",
                strong: "Marca forte e posicionada. Geração constante de demanda, produção de conteúdo de valor e presença digital consolidada."
            },
            'Jornada do Cliente': {
                critical: "A experiência pós-venda é falha. Não há acompanhamento e o índice de recompra ou fidelização é muito baixo.",
                developing: "O atendimento existe, mas a experiência do usuário pode ser mais estruturada para garantir uma retenção sustentável.",
                strong: "Excelência no atendimento e na experiência. Retenção alta, clientes fidelizados que promovem ativamente sua marca."
            },
            'Liderança': {
                critical: "Equipe desalinhada e centralização excessiva. O empresário é o gargalo da operação e não há gestão de pessoas.",
                developing: "Há líderes em formação ou delegação inicial, mas faltam rituais de gestão consistentes para acompanhar o time.",
                strong: "Liderança forte e processos delegados. Equipe engajada, rodando a empresa com alto nível de autonomia e eficácia."
            }
        };

        categories.forEach(cat => {
            checkPageBreak(100);

            const score = scores[cat];
            const status = getStatusByScore(score);
            const analysisText = analysisDict[cat][status.id];

            // Category card
            doc.setFillColor(20, 20, 20);
            const textLines = doc.splitTextToSize(analysisText, maxW - 40);
            const cardH = 55 + (textLines.length * 15);
            doc.roundedRect(mx, y, maxW, cardH, 8, 8, 'F');

            // Status indicator dot
            if (status.id === 'critical') doc.setFillColor(239, 68, 68);
            else if (status.id === 'developing') doc.setFillColor(245, 158, 11);
            else doc.setFillColor(16, 185, 129);
            doc.circle(mx + 18, y + 22, 5, 'F');

            // Category name
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...white);
            doc.setFontSize(14);
            doc.text(cat, mx + 32, y + 26);

            // Score & status
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...gold);
            doc.setFontSize(14);
            doc.text(`${score.toFixed(1)}`, pw - mx - 20, y + 26, { align: 'right' });

            // Analysis text
            y += 42;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...gray);
            doc.setFontSize(10);
            textLines.forEach(line => {
                doc.text(line, mx + 20, y);
                y += 15;
            });

            y += 20;
        });

        // ========== FINAL: Resulta Mais CTA ==========
        checkPageBreak(120);
        y += 10;
        drawGoldLine(y);
        y += 40;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...gold);
        doc.setFontSize(16);
        doc.text('Quer um diagnóstico estratégico completo?', mx, y);

        y += 25;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...gray);
        doc.setFontSize(11);
        const ctaLines = doc.splitTextToSize(
            'A Resulta Mais oferece aceleração empresarial personalizada para levar sua empresa ao próximo nível. Entre em contato conosco para uma consultoria estratégica exclusiva.',
            maxW
        );
        ctaLines.forEach(line => {
            doc.text(line, mx, y);
            y += 16;
        });

        // Footer
        drawGoldLine(ph - 60);
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        doc.text('Relatório gerado por Resulta Mais — Todos os direitos reservados.', mx, ph - 40);

        // ========== SAVE ==========
        const fileName = `Diagnostico_360_${leadData?.company || 'Empresa'}.pdf`;
        doc.save(fileName);

    } catch(err) {
        console.error(err);
        alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
    } finally {
        btnDownloadPdf.textContent = originalText;
        btnDownloadPdf.disabled = false;
    }
}

// Helper function to show subtle email notification
function showEmailNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#10B981'; // Green
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#F59E0B'; // Orange
    } else {
        notification.style.backgroundColor = '#EF4444'; // Red
    }
    
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Bootstrap
document.addEventListener('DOMContentLoaded', init);
