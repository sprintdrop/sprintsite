// ============================================================
// ЧАСТЬ 1: ДАННЫЕ ПО УМОЛЧАНИЮ
// ============================================================
const DEFAULT_DATA = {
    users: [],
    questions: [],
    siteTexts: {
        siteTitle: 'EXELD',
        heroTitle: 'EXELD',
        heroSub: 'Full-Stack Developer',
        heroDesc: 'Разработка под заказ • Telegram-боты • Сайты • Mini Apps • OSINT-утилиты',
        aboutText: `<p style="margin-bottom:12px;">Я — независимый разработчик, специализирующийся на создании цифровых продуктов под ключ. Работаю с Telegram-ботами, сайтами, мини-приложениями и OSINT-инструментами. Начинал как самоучка, быстро вник в коммерческую разработку и уже закрыл 4 успешных проекта.</p><p style="margin-bottom:12px;">Мой подход — никакой воды, только конкретика. Говорю честно, если что-то не могу сделать, и всегда довожу начатое до конца. Работаю на результат, чтобы клиент получал именно то, что заказал, без сюрпризов и переделок.</p>`,
        bioText: `<p style="margin-bottom:16px;">Мой путь в разработку начался 2 недели назад, когда я решил перейти от теории к реальным проектам. За это короткое время я успел закрыть 4 проекта под ключ — от обсуждения технического задания до сдачи готового продукта.</p><p style="margin-bottom:16px;">Специализируюсь на четырех направлениях: Telegram-боты любого уровня сложности, сайты всех видов (от лендингов до веб-сервисов), мини-приложения внутри Telegram и OSINT-утилиты для терминала.</p><p style="margin-bottom:16px;">Несмотря на небольшой коммерческий опыт, я быстро учусь, разбираюсь в новых технологиях и всегда на связи с заказчиком. Каждый проект проходит полный цикл: анализ задачи, разработка, тестирование и передача с инструкцией по использованию.</p><p style="margin-bottom:16px;">В планах — расти дальше, брать более сложные заказы и выстраивать долгосрочные отношения с клиентами.</p>`
    },
    services: [
        { category: '🤖 Telegram-боты', items: [
            { name: 'Лёгкий', desc: 'Базовые команды, простые сценарии, хранение данных в JSON, без БД.', price: '550-2500 ₽' },
            { name: 'Средний', desc: 'Инлайн-клавиатуры, FSM, SQLite/Google Sheets, рассылки, админ-команды.', price: '3500-8000 ₽' },
            { name: 'Сложный', desc: 'Платежи, внешние API, многомодульность, админ-панель, очереди задач.', price: '10000-23000 ₽' }
        ]},
        { category: '🌐 Сайты', items: [
            { name: 'Лёгкий', desc: 'Одностраничник на HTML/CSS, без адаптива, простая форма.', price: '2000-4000 ₽' },
            { name: 'Средний', desc: 'Адаптивный лендинг, 3–5 страниц, форма заявки с отправкой в Telegram.', price: '6000-10000 ₽' },
            { name: 'Сложный', desc: 'Кастомный дизайн, анимации, CRM-связка, метрики, админ-панель.', price: '12000-20000 ₽' }
        ]},
        { category: '📱 Mini Apps (Telegram)', items: [
            { name: 'Лёгкое', desc: 'Одна страница, базовая логика, без БД.', price: '3000 ₽' },
            { name: 'Среднее', desc: 'Несколько экранов, сохранение данных, интеграция с Telegram WebApp API.', price: '7000 ₽' },
            { name: 'Сложное', desc: 'Сложная логика, анимации, работа с внешними API, авторизация.', price: '14000 ₽' }
        ]}
    ]
}
// ============================================================
// ЧАСТЬ 2: ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И ЗАГРУЗКА ДАННЫХ
// ============================================================
let appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
let users = [];
let questions = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

async function loadData() {
    try {
        const response = await fetch('data.json?t=' + Date.now());
        if (response.ok) {
            const data = await response.json();
            appData = data;
        }
    } catch (e) {
        console.log('Загружены данные по умолчанию');
    }
    applyData();
}

function applyData() {
    users = appData.users || [];
    questions = appData.questions || [];
    if (!appData.services) appData.services = DEFAULT_DATA.services;
    if (!appData.siteTexts) appData.siteTexts = DEFAULT_DATA.siteTexts;
    applyTexts();
    renderServices();
    updateCabinetUI();
    setTimeout(() => {
        if (!currentUser) showPage('register');
        else showPage('home');
    }, 100);
}

async function saveData() {
    appData.users = users;
    appData.questions = questions;
    localStorage.setItem('appData_backup', JSON.stringify(appData));
}

function applyTexts() {
    const t = appData.siteTexts || {};
    document.getElementById('siteTitle').textContent = t.siteTitle || 'EXELD';
    document.getElementById('heroTitle').textContent = t.heroTitle || 'EXELD';
    document.getElementById('heroSub').textContent = t.heroSub || 'Full-Stack Developer';
    document.getElementById('heroDesc').textContent = t.heroDesc || 'Разработка под заказ • Telegram-боты • Сайты • Mini Apps • OSINT-утилиты';
    document.getElementById('aboutText').innerHTML = t.aboutText || DEFAULT_DATA.siteTexts.aboutText;
    document.getElementById('bioText').innerHTML = t.bioText || DEFAULT_DATA.siteTexts.bioText;
}

function renderServices() {
    const container = document.getElementById('servicesList');
    if (!container) return;
    const services = appData.services || [];
    let html = '';
    services.forEach(cat => {
        html += '<div style="margin-top:24px;position:relative;">';
        html += '<div style="display:inline-block;background:var(--glass-bg);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:6px 20px;border-radius:20px;border:1px solid var(--glass-border);margin-bottom:8px;font-size:16px;font-weight:700;color:var(--text);letter-spacing:-0.2px;box-shadow:0 4px 20px rgba(0,0,0,0.2);">' + cat.category + '</div>';
        html += '<div style="background:var(--glass-bg);border-radius:var(--radius);border:1px solid var(--glass-border);padding:14px 18px;margin-top:4px;">';
        cat.items.forEach((item, index) => {
            html += '<div style="padding:10px 0;' + (index < cat.items.length - 1 ? 'border-bottom:1px solid var(--glass-border);' : '') + '">';
            html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">';
            html += '<div><span style="font-size:15px;font-weight:500;color:var(--text);background:var(--glass-bg);padding:2px 10px;border-radius:12px;border:1px solid var(--glass-border);">' + item.name + '</span>';
            if (item.desc) {
                html += '<div style="font-size:13px;color:var(--text-secondary);margin-top:4px;padding-left:4px;">' + item.desc + '</div>';
            }
            html += '</div>';
            html += '<div style="font-weight:700;color:var(--accent);font-size:15px;white-space:nowrap;background:var(--glass-bg);padding:4px 14px;border-radius:20px;border:1px solid var(--glass-border);">' + item.price + '</div>';
            html += '</div>';
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';
    });
    container.innerHTML = html;
}
// ============================================================
// ЧАСТЬ 3: АДМИН-ПАНЕЛЬ
// ============================================================
const ADMIN_PASSWORD = 'admin123';

function openAdmin() {
    document.getElementById('adminOverlay').classList.add('show');
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminContent').style.display = 'none';
    document.getElementById('adminError').textContent = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPassword').focus();
}

function closeAdmin() {
    document.getElementById('adminOverlay').classList.remove('show');
}

function adminLogin() {
    const pass = document.getElementById('adminPassword').value;
    if (pass === ADMIN_PASSWORD) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        loadAdminTexts();
        renderAdminServices();
        renderAdminSupport();
        renderAdminUsers();
    } else {
        document.getElementById('adminError').textContent = 'Неверный пароль!';
    }
}

function switchAdminTab(tab, btn) {
    document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.admin-tabs button').forEach(el => el.classList.remove('active'));
    const tabId = 'admin' + tab.charAt(0).toUpperCase() + tab.slice(1);
    document.getElementById(tabId).classList.add('active');
    if (btn) btn.classList.add('active');
    if (tab === 'texts') loadAdminTexts();
    if (tab === 'services') renderAdminServices();
    if (tab === 'support') renderAdminSupport();
    if (tab === 'users') renderAdminUsers();
}

// ---- ВКЛАДКА "ТЕКСТЫ" ----
function loadAdminTexts() {
    const t = appData.siteTexts || {};
    document.getElementById('editSiteTitle').value = t.siteTitle || 'EXELD';
    document.getElementById('editHeroTitle').value = t.heroTitle || 'EXELD';
    document.getElementById('editHeroSub').value = t.heroSub || 'Full-Stack Developer';
    document.getElementById('editHeroDesc').value = t.heroDesc || 'Разработка под заказ • Telegram-боты • Сайты • Mini Apps • OSINT-утилиты';
    document.getElementById('editAboutText').value = t.aboutText || DEFAULT_DATA.siteTexts.aboutText;
    document.getElementById('editBioText').value = t.bioText || DEFAULT_DATA.siteTexts.bioText;
}

function saveTexts() {
    appData.siteTexts = {
        siteTitle: document.getElementById('editSiteTitle').value.trim(),
        heroTitle: document.getElementById('editHeroTitle').value.trim(),
        heroSub: document.getElementById('editHeroSub').value.trim(),
        heroDesc: document.getElementById('editHeroDesc').value.trim(),
        aboutText: document.getElementById('editAboutText').value,
        bioText: document.getElementById('editBioText').value
    };
    applyTexts();
    saveData();
    alert('✅ Тексты сохранены!');
}

function exportData() {
    const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert('📤 Файл data.json скачан! Загрузи его в репозиторий.');
}

// ---- ВКЛАДКА "ПРАЙС" ----
function renderAdminServices() {
    const container = document.getElementById('adminServicesList');
    if (!container) return;
    const services = appData.services || [];
    let html = '';
    services.forEach((cat, ci) => {
        html += '<div class="admin-service-item" data-cat="' + ci + '">';
        html += '<input class="admin-edit-field" id="catName_' + ci + '" value="' + cat.category + '" placeholder="Название категории">';
        cat.items.forEach((item, ii) => {
            html += '<div style="display:flex;gap:8px;margin-bottom:6px;">';
            html += '<input style="flex:1;padding:6px 10px;border-radius:var(--radius);border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text);font-size:13px;" id="itemName_' + ci + '_' + ii + '" value="' + item.name + '" placeholder="Название">';
            html += '<input style="flex:2;padding:6px 10px;border-radius:var(--radius);border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text);font-size:13px;" id="itemDesc_' + ci + '_' + ii + '" value="' + item.desc + '" placeholder="Описание">';
            html += '<input style="flex:1;padding:6px 10px;border-radius:var(--radius);border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text);font-size:13px;" id="itemPrice_' + ci + '_' + ii + '" value="' + item.price + '" placeholder="Цена">';
            html += '<button class="del-btn" onclick="removeServiceItem(' + ci + ',' + ii + ')">✕</button>';
            html += '</div>';
        });
        html += '<button class="admin-save-btn" style="background:#4caf50;padding:4px 12px;font-size:12px;" onclick="addServiceItem(' + ci + ')">➕ Добавить</button>';
        html += '<button class="del-btn" onclick="removeServiceCategory(' + ci + ')" style="margin-left:8px;">🗑 Удалить</button>';
        html += '</div>';
    });
    container.innerHTML = html;
}

function addServiceCategory() {
    appData.services.push({ category: 'Новая категория', items: [{ name: 'Новая услуга', desc: 'Описание', price: '0 ₽' }] });
    renderAdminServices();
}

function removeServiceCategory(index) {
    if (confirm('Удалить категорию?')) { appData.services.splice(index, 1); renderAdminServices(); }
}

function addServiceItem(catIndex) {
    appData.services[catIndex].items.push({ name: 'Новая услуга', desc: 'Описание', price: '0 ₽' });
    renderAdminServices();
}

function removeServiceItem(catIndex, itemIndex) {
    if (confirm('Удалить услугу?')) { appData.services[catIndex].items.splice(itemIndex, 1); renderAdminServices(); }
}

function saveServices() {
    const services = [];
    const cats = document.querySelectorAll('.admin-service-item');
    cats.forEach((catEl, ci) => {
        const category = document.getElementById('catName_' + ci).value.trim();
        const items = [];
        const itemEls = catEl.querySelectorAll('[id^="itemName_' + ci + '_"]');
        itemEls.forEach((el, ii) => {
            const name = document.getElementById('itemName_' + ci + '_' + ii).value.trim();
            const desc = document.getElementById('itemDesc_' + ci + '_' + ii).value.trim();
            const price = document.getElementById('itemPrice_' + ci + '_' + ii).value.trim();
            if (name) items.push({ name: name, desc: desc, price: price });
        });
        if (category) services.push({ category: category, items: items });
    });
    appData.services = services;
    renderServices();
    saveData();
    alert('✅ Прайс сохранён!');
}

// ---- ВКЛАДКИ "ВОПРОСЫ" И "ПОЛЬЗОВАТЕЛИ" ----
function renderAdminSupport() {
    const container = document.getElementById('adminSupportList');
    if (!container) return;
    if (!questions.length) { container.innerHTML = '<p style="color:var(--text-secondary);">Нет вопросов.</p>'; return; }
    let html = '';
    questions.forEach(q => {
        html += '<div style="padding:12px;background:var(--glass-bg);border-radius:var(--radius);margin-bottom:8px;border:1px solid var(--glass-border);">';
        html += '<div style="font-weight:500;">❓ ' + q.question + '</div>';
        html += '<div style="font-size:12px;color:var(--text-secondary);">👤 ' + (q.userName || 'Гость') + ' | ' + q.timestamp + '</div>';
        if (q.answer) {
            html += '<div style="color:#4caf50;margin-top:6px;">✅ ' + q.answer + '</div>';
        } else {
            html += '<div style="display:flex;gap:8px;margin-top:6px;">';
            html += '<input class="admin-edit-field" id="answerQ_' + q.id + '" placeholder="Введите ответ..." style="margin:0;">';
            html += '<button class="admin-save-btn" onclick="answerQuestion(' + q.id + ')" style="margin:0;">Ответить</button>';
            html += '</div>';
        }
        html += '</div>';
    });
    container.innerHTML = html;
}

function answerQuestion(id) {
    const input = document.getElementById('answerQ_' + id);
    const answer = input.value.trim();
    if (!answer) { alert('Введите ответ'); return; }
    const q = questions.find(q => q.id === id);
    if (q) { q.answer = answer; saveData(); renderAdminSupport(); }
}

function renderAdminUsers() {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    if (!users.length) { container.innerHTML = '<p style="color:var(--text-secondary);">Нет пользователей.</p>'; return; }
    let html = '';
    users.forEach(u => {
        const userQuestions = questions.filter(q => q.userName === u.name);
        html += '<div style="padding:12px;background:var(--glass-bg);border-radius:var(--radius);margin-bottom:8px;border:1px solid var(--glass-border);">';
        html += '<div><strong>' + u.name + '</strong></div>';
        html += '<div style="font-size:12px;color:var(--text-secondary);">Вопросов: ' + userQuestions.length + '</div>';
        html += '</div>';
    });
    container.innerHTML = html;
}
// ============================================================
// ЧАСТЬ 4: ЗВЁЗДЫ, ТЕМА И НАВИГАЦИЯ
// ============================================================
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');
let stars = [];
let starColor = '#ffffff';

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initStars() {
    stars = [];
    for (let i = 0; i < 120; i++) {
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.8 + 0.4, speed: Math.random() * 0.4 + 0.1, angle: Math.random() * Math.PI * 2 });
    }
}
initStars();

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = starColor;
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.x += Math.sin(s.angle) * s.speed * 0.2;
        s.y += Math.cos(s.angle) * s.speed * 0.2;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
    });
    requestAnimationFrame(drawStars);
}
drawStars();

function updateStarColor(color) { starColor = color; }

// ---- ТЕМА (СВЕТЛАЯ/ТЁМНАЯ) ----
let currentTheme = 'dark';
const themeToggle = document.getElementById('themeToggle');

function toggleTheme() {
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.textContent = '☀️';
        currentTheme = 'light';
        updateStarColor('#000');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        currentTheme = 'dark';
        updateStarColor('#fff');
    }
}
updateStarColor('#fff');

// ---- НАВИГАЦИЯ МЕЖДУ СТРАНИЦАМИ ----
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(id);
    if (page) page.classList.add('active');
    if (id === 'cabinet') updateCabinetUI();
}
// ============================================================
// ЧАСТЬ 5: ЧАТ И ИИ-ПОМОЩНИК
// ============================================================
function toggleChat() {
    const win = document.getElementById('chatWindow');
    const fab = document.getElementById('chatFab');
    if (!win) return;
    if (win.classList.contains('open')) {
        win.classList.remove('open');
        if (fab) fab.textContent = '💬';
    } else {
        win.classList.add('open');
        if (fab) fab.textContent = '✕';
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 300);
    }
}

function addChatMessage(text, sender, senderName) {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'msg ' + sender;
    if (senderName) {
        const span = document.createElement('span');
        span.className = 'sender-name ' + sender;
        span.textContent = senderName;
        div.appendChild(span);
    }
    div.appendChild(document.createTextNode(text));
    const now = new Date();
    const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const timeSpan = document.createElement('span');
    timeSpan.className = 'time';
    timeSpan.textContent = time;
    div.appendChild(timeSpan);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const typing = document.getElementById('chatTyping');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    addChatMessage(text, 'user', 'Вы');
    input.value = '';
    input.disabled = true;
    typing.classList.add('active');
    saveQuestion(text);
    setTimeout(() => {
        typing.classList.remove('active');
        const answer = getAIAnswer(text);
        addChatMessage(answer, 'bot', '🤖 Exeld');
        input.disabled = false;
        input.focus();
    }, 500 + Math.random() * 800);
}

function saveQuestion(text) {
    questions.push({
        id: Date.now(),
        question: text,
        userName: currentUser ? currentUser.name : 'Гость',
        timestamp: new Date().toLocaleString(),
        answer: ''
    });
    saveData();
    if (typeof renderAdminSupport === 'function') renderAdminSupport();
}

// ---- ИИ-ПОМОЩНИК (БАЗА ОТВЕТОВ) ----
function getAIAnswer(text) {
    const lower = text.toLowerCase();
    
    if (lower.match(/привет|здравствуй|ку|hello|hi|хай|салам/)) {
        return 'Привет! 👋 Я Exeld, Full-Stack разработчик. Рад знакомству! Чем могу помочь? Рассказывай, что нужно разработать — Telegram-бота, сайт, Mini App или OSINT-утилиту?';
    }
    if (lower.match(/цена|сколько|стоимость|прайс|рублей|₽|дорого|дешево|бюджет/)) {
        return '💰 Цены:\n\n🤖 Telegram-боты: Лёгкий 550-2500₽, Средний 3500-8000₽, Сложный 10000-23000₽\n🌐 Сайты: Лёгкий 2000-4000₽, Средний 6000-10000₽, Сложный 12000-20000₽\n📱 Mini Apps: Лёгкий 3000₽, Средний 7000₽, Сложный 14000₽';
    }
    if (lower.match(/срок|время|быстро|долго|выполнение|когда|дней|недель/)) {
        return '⏱️ Сроки:\n• Лёгкие — 2-5 дней\n• Средние — 1-2 недели\n• Сложные — 2-4 недели\n\nТочные сроки обсуждаем индивидуально.';
    }
    if (lower.match(/оплат|крипт|usdt|деньг|платить|карт|перевод/)) {
        return '💳 Оплата в рублях (перевод на карту) или USDT (BEP20/ERC20).\nЦена фиксированная — без скрытых платежей.';
    }
    if (lower.match(/full-stack|фулстек|технолог|язык|фреймворк|стек/)) {
        return '🖥️ Мой стек:\n• Backend: Python, Flask, Django, Aiogram\n• Frontend: React, HTML, CSS, JS\n• Базы: PostgreSQL, SQLite, MongoDB\n• Другое: Docker, Git, REST API, TON';
    }
    if (lower.match(/контакт|связаться|телеграм|telegram|@|связь/)) {
        return '📱 Связь: Telegram @sprintdrop\nEmail: exeld@proton.me\nGitHub: github.com/sprintdrop';
    }
    if (lower.match(/гарант|качеств|надёжн|довери/)) {
        return '🛡️ 100% гарантия на все проекты. Бесплатная поддержка 1 месяц после сдачи. Работаю по договору.';
    }
    if (lower.match(/шутк|смеш|хаха|lol|прикол|анекдот/)) {
        const jokes = [
            '🤣 Программист приходит в магазин.\n— У вас есть хлеб?\n— Нет.\n— А молоко?\n— Нет.\n— Зачем тогда открыли?\n— Хороший вопрос! Запишем в бэклог.',
            '😄 Разработчик ночью: — Приснилось, забыл поставить ;\nЖена: — Успокойся, это сон.\n— А вдруг нет?!',
            '😂 Сколько программистов нужно для лампочки? Ни одного — это аппаратная проблема!'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }
    if (lower.match(/кто ты|ты кто|представься|расскажи о себе|бот/)) {
        return '👋 Я Exeld — Full-Stack разработчик.\nСпециализируюсь на Telegram-ботах, сайтах, Mini Apps и OSINT-утилитах.\nВ коммерческой разработке 2 недели, сдал 4 проекта под ключ.\nЧем могу помочь?';
    }
    if (lower.match(/спасибо|thx|thanks|благодарю/)) {
        return '😊 Пожалуйста! Всегда рад помочь! Если что — обращайся. Удачи! 🍀';
    }
    if (lower.match(/пока|до свидания|bye|goodbye|прощай|увидимся/)) {
        return '👋 До свидания! Хорошего дня! Возвращайся! 🚀';
    }
    if (lower.match(/телеграм бот|телеграм-бот|telegram бот|сделать бота/)) {
        return '🤖 Разрабатываю Telegram-ботов любой сложности.\nЛёгкий (550-2500₽) — базовые команды\nСредний (3500-8000₽) — клавиатуры, базы данных\nСложный (10000-23000₽) — платежи, API, админ-панель';
    }
    if (lower.match(/mini app|мини прилож|webapp/)) {
        return '📱 Разрабатываю Mini Apps для Telegram.\nЛёгкий (3000₽) — базовый функционал\nСредний (7000₽) — с API, TON\nСложный (14000₽) — полноценное приложение';
    }
    if (lower.match(/сайт|лендинг|интернет-магазин|корпоративн/)) {
        return '🌐 Создаю сайты под ключ.\nЛёгкий (2000-4000₽) — сайт-визитка\nСредний (6000-10000₽) — корпоративный с админ-панелью\nСложный (12000-20000₽) — интернет-магазин, CRM';
    }
    if (lower.match(/osint|утилит|терминал|скрипт|парсинг|сбор данных/)) {
        return '🕵️ Создаю OSINT-утилиты для терминала.\nЦены обсуждаем индивидуально в зависимости от сложности.';
    }
    if (lower.match(/как работа|процесс|этап|алгоритм/)) {
        return '📋 Как я работаю:\n1️⃣ Обсуждаем задачу\n2️⃣ Называю фиксированную цену и срок\n3️⃣ Разрабатываю прототип\n4️⃣ Тестирую\n5️⃣ Сдаю проект с инструкцией';
    }
    if (lower.match(/помощ|что можешь|что умеешь|возможност/)) {
        return '🚀 Я могу помочь с разработкой:\n• Telegram-ботов\n• Сайтов\n• Mini Apps\n• OSINT-утилит\n\nПросто расскажите, что нужно!';
    }
    return '🤔 Хороший вопрос! Давайте разберемся.\n\nЕсли вы спрашиваете про разработку — я могу сделать Telegram-бота, сайт, Mini App или OSINT-утилиту. Напишите подробнее, что именно нужно.\n\nКонтакты: @sprintdrop (Telegram) — всегда на связи! 💬';
}
// ============================================================
// ЧАСТЬ 6: КАБИНЕТ (РЕГИСТРАЦИЯ, ВХОД, ВЫХОД)
// ============================================================
function updateCabinetUI() {
    if (currentUser) {
        document.getElementById('cabinetContent').style.display = 'block';
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('cabinetName').textContent = currentUser.name;
    } else {
        document.getElementById('cabinetContent').style.display = 'none';
        document.getElementById('authButtons').style.display = 'flex';
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateCabinetUI();
    showPage('home');
}

function checkUsername() {
    const name = document.getElementById('regName').value.trim();
    const btn = document.getElementById('regNextBtn');
    const status = document.getElementById('usernameStatus');
    if (!name) {
        status.textContent = 'Введите никнейм';
        status.style.color = 'var(--text-secondary)';
        btn.disabled = true;
        return;
    }
    if (users.find(u => u.name === name)) {
        status.textContent = '❌ Этот никнейм уже занят';
        status.style.color = '#ff6b6b';
        btn.disabled = true;
    } else {
        status.textContent = '✅ Никнейм доступен';
        status.style.color = '#4caf50';
        btn.disabled = false;
    }
}

function regStep1Next() {
    document.getElementById('regStep1').classList.remove('active');
    document.getElementById('regStep2').classList.add('active');
}

function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('regPassword').value = pass;
}

function regStep2Next() {
    const name = document.getElementById('regName').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    if (!password) { 
        alert('Введите пароль'); 
        return; 
    }
    users.push({ name: name, password: password });
    currentUser = { name: name };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    saveData();
    updateCabinetUI();
    showPage('home');
}

function loginUser() {
    const name = document.getElementById('loginName').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const user = users.find(u => u.name === name && u.password === password);
    if (user) {
        currentUser = { name: name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateCabinetUI();
        showPage('home');
    } else {
        alert('Неверный логин или пароль');
    }
}
