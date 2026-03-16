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

    localStorage.setItem('diagnostico_lead', JSON.stringify(finalData));
    console.log("Data saved locally:", finalData);

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
        const scores = calculateScores();
        
        // Build analysis text array to send to backend
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
                strong: "Liderança forte e processos delegados. Equipe engajada, rodando a empresa com alto nível de autonomia e eficacia."
            }
        };

        const analysisCategories = categories.map(cat => {
            const score = scores[cat];
            const status = getStatusByScore(score);
            return {
                category: cat,
                text: analysisDict[cat][status.id]
            };
        });

        // Get base64 chart image
        // To ensure background is not transparent in PDF, chart needs to be drawn on a white canvas or handled by pdffkit
        const chartImage = radarChartInstance.toBase64Image('image/png', 1);

        const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lead: leadData,
                scores: scores,
                analysisCategories: analysisCategories,
                chartImage: chartImage
            })
        });

        if (!response.ok) throw new Error('Erro na geração do PDF');

        // Create a blob and download it
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Diagnostico_${leadData?.company || 'Estrategico'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch(err) {
        console.error(err);
        alert('Ocorreu um erro ao gerar o PDF. Verifique sua conexão.');
    } finally {
        btnDownloadPdf.textContent = originalText;
        btnDownloadPdf.disabled = false;
    }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', init);
