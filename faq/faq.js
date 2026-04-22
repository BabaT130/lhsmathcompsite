var faqList = document.getElementById('faq-list');
var FAQ_ANIMATION_MS = 320;

function createFaqIcon() {
    var icon = document.createElement('span');
    icon.className = 'faq-icon';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');

    var vertical = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    vertical.setAttribute('d', 'M8 2.5V13.5');
    svg.appendChild(vertical);

    var horizontal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    horizontal.setAttribute('d', 'M2.5 8H13.5');
    svg.appendChild(horizontal);

    icon.appendChild(svg);
    return icon;
}

function createFaqItem(entry) {
    var item = document.createElement('details');
    item.className = 'faq-item';

    var summary = document.createElement('summary');

    var question = document.createElement('span');
    question.className = 'faq-question';
    question.textContent = entry.question || '';
    summary.appendChild(question);
    summary.appendChild(createFaqIcon());

    var answer = document.createElement('div');
    answer.className = 'faq-answer';

    var answerInner = document.createElement('div');
    answerInner.className = 'faq-answer-inner';

    if (entry.answerHtml) {
        var htmlBody = document.createElement('p');
        htmlBody.innerHTML = entry.answerHtml;
        answerInner.appendChild(htmlBody);
    } else {
        var body = document.createElement('p');
        body.textContent = entry.answer || '';
        answerInner.appendChild(body);
    }
    answer.appendChild(answerInner);

    item.appendChild(summary);
    item.appendChild(answer);
    return item;
}

function finishFaqAnimation(item, answer, keepOpen) {
    answer.style.height = keepOpen ? 'auto' : '0px';
    item.dataset.animating = '';
    if (!keepOpen) {
        item.open = false;
    }
}

function openFaqItem(item) {
    if (!item || item.dataset.animating === 'true' || item.classList.contains('is-open')) {
        return;
    }

    var answer = item.querySelector('.faq-answer');
    if (!answer) {
        item.open = true;
        item.classList.add('is-open');
        return;
    }

    item.dataset.animating = 'true';
    item.open = true;
    item.classList.add('is-open');
    answer.style.height = '0px';

    requestAnimationFrame(function () {
        answer.style.height = answer.scrollHeight + 'px';
    });

    window.setTimeout(function () {
        finishFaqAnimation(item, answer, true);
    }, FAQ_ANIMATION_MS);
}

function closeFaqItem(item) {
    if (!item || item.dataset.animating === 'true' || !item.classList.contains('is-open')) {
        return;
    }

    var answer = item.querySelector('.faq-answer');
    if (!answer) {
        item.classList.remove('is-open');
        item.open = false;
        return;
    }

    item.dataset.animating = 'true';
    answer.style.height = answer.scrollHeight + 'px';

    requestAnimationFrame(function () {
        item.classList.remove('is-open');
        answer.style.height = '0px';
    });

    window.setTimeout(function () {
        finishFaqAnimation(item, answer, false);
    }, FAQ_ANIMATION_MS);
}

function initializeFaqAccordion() {
    if (!faqList) {
        return;
    }

    faqList.addEventListener('click', function (event) {
        var summary = event.target.closest('summary');
        if (!summary || !faqList.contains(summary)) {
            return;
        }

        event.preventDefault();
        var item = summary.parentElement;
        if (!item || !item.classList.contains('faq-item')) {
            return;
        }

        if (item.classList.contains('is-open')) {
            closeFaqItem(item);
            return;
        }

        openFaqItem(item);
    });
}

function renderFaq(entries) {
    if (!faqList) {
        return;
    }

    faqList.innerHTML = '';
    var fragment = document.createDocumentFragment();
    entries.forEach(function (entry) {
        fragment.appendChild(createFaqItem(entry));
    });
    faqList.appendChild(fragment);
}

function showLoadError() {
    if (!faqList) {
        return;
    }

    faqList.innerHTML = '';
    var message = document.createElement('p');
    message.className = 'faq-loading';
    message.textContent = 'Unable to load FAQ entries.';
    faqList.appendChild(message);
}

async function loadFaqData() {
    try {
        var response = await fetch('./faq_data.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Failed to load FAQ entries.');
        }

        var data = await response.json();
        var entries = Array.isArray(data.entries) ? data.entries : [];
        renderFaq(entries);
    } catch (error) {
        console.error(error);
        showLoadError();
    }
}

initializeFaqAccordion();
loadFaqData();
