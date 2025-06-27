// app.js

import { generateProblems } from './problem_generators.js';

// =================================================================
// [설정] 모든 설정을 이 곳에서 관리합니다.
// =================================================================

const API_KEY = 'AIzaSyCF_C3hfkobaBtPiyKieJPEqVBit_w_5Gw'; 
const THEMES = ['school life(학교 생활)', 'food(음식)', 'animals(동물)', 'hobbies(취미)', 'daily routines(일상생활)', 'travel(여행)', 'sports(스포츠)', 'home life(가정 생활)'];
const NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT = 50; 

// [데이터] 인칭대명사 전체 데이터
const pronounData = [
    { question: "I", person: "1인칭", number: "단수", "case": "주격", meaning: "나는" },
    { question: "my", person: "1인칭", number: "단수", "case": "소유격", meaning: "나의" },
    { question: "me", person: "1인칭", number: "단수", "case": "목적격", meaning: "나를/나에게" },
    { question: "mine", person: "1인칭", number: "단수", "case": "소유대명사", meaning: "나의 것" },
    { question: "You", person: "2인칭", number: "단수/복수", "case": ["주격", "목적격"], meaning: ["너는/너희들은", "너를/너에게/너희들을/너희들에게"] },
    { question: "your", person: "2인칭", number: "단수/복수", "case": "소유격", meaning: "너의/너희들의" },
    { question: "yours", person: "2인칭", number: "단수/복수", "case": "소유대명사", meaning: "너의 것/너희들의 것" },
    { question: "He", person: "3인칭", number: "단수", "case": "주격", meaning: "그는" },
    { question: "his", person: "3인칭", number: "단수", "case": ["소유격", "소유대명사"], meaning: ["그의", "그의 것"] },
    { question: "him", person: "3인칭", number: "단수", "case": "목적격", meaning: "그를/그에게" },
    { question: "She", person: "3인칭", number: "단수", "case": "주격", meaning: "그녀는" },
    { question: "her", person: "3인칭", number: "단수", "case": ["소유격", "목적격"], meaning: ["그녀의", "그녀를/그녀에게"] },
    { question: "hers", person: "3인칭", number: "단수", "case": "소유대명사", meaning: "그녀의 것" },
    { question: "It", person: "3인칭", number: "단수", "case": ["주격", "목적격"], meaning: ["그것은", "그것을/그것에게"] },
    { question: "its", person: "3인칭", number: "단수", "case": "소유격", meaning: "그것의" },
    { question: "We", person: "1인칭", number: "복수", "case": "주격", meaning: "우리는" },
    { question: "our", person: "1인칭", number: "복수", "case": "소유격", meaning: "우리의" },
    { question: "us", person: "1인칭", number: "복수", "case": "목적격", meaning: "우리를/우리에게" },
    { question: "ours", person: "1인칭", number: "복수", "case": "소유대명사", meaning: "우리의 것" },
    { question: "They", person: "3인칭", number: "복수", "case": "주격", meaning: "그들은/그것들은" },
    { question: "their", person: "3인칭", number: "복수", "case": "소유격", meaning: "그들의/그것들의" },
    { question: "them", person: "3인칭", number: "복수", "case": "목적격", meaning: "그들을/그들에게/그것들을/그것들에게" },
    { question: "theirs", person: "3인칭", number: "복수", "case": "소유대명사", meaning: "그들의 것/그것들의 것" }
];

const PROBLEM_TOPICS = {
    "verb_conjugation_3ps": {
        name: "L1_3인칭 단수 변환(단독)",
        instruction: "다음 동사를 3인칭 단수 현재형으로 바꾸시오.",
        isVerbList: true, 
        prompt: `
            You are an English teacher creating a quiz about the third-person singular present tense verb rule for Korean students.
            Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} different English verbs in their base form. For each verb, provide its third-person singular present tense form.
            **CRITICAL RULES FOR VERB SELECTION:**
            1.  **Mix of Spelling Rules:** You MUST include a good mix of verbs that follow different conjugation rules: verbs that add '-s', verbs that add '-es', verbs that change 'y' to '-ies', and the irregular verb 'have'.
            2.  **Variety:** Do not repeat verbs. Provide a diverse list of common verbs suitable for learners.
            The output must be a valid JSON array of objects. Each object must have two keys: "question" (the base form) and "answer" (the 3rd person form).
            Example: [{"question": "study", "answer": "studies"}, {"question": "go", "answer": "goes"}]
        `
    },
    "general_verb_past": {
        name: "L2_일반동사 과거형 변환(단독)",
        instruction: "다음 동사를 과거형으로 바꾸시오.",
        isVerbList: true, 
        prompt: `
            You are an English teacher creating a high-quality quiz for students learning past tense verbs.
            Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} simple verbs in their base form. For each verb, provide its simple past tense equivalent.
            **CRITICAL RULES FOR VERB SELECTION:**
            1. **Vary Verbs:** You MUST include a good mix of regular verbs (e.g., play -> played, study -> studied, stop -> stopped) and common irregular verbs (e.g., go -> went, eat -> ate, see -> saw).
            2. **Avoid Repetition:** Do not repeat verbs.
            The output must be a valid JSON array of objects. Each object must have two keys: "question" (the base form of the verb) and "answer" (the past tense form).
            Example: [{"question": "listen", "answer": "listened"}, {"question": "write", "answer": "wrote"}]
        `
    },
    "verb_ing_form": {
    name: "L1_동사 -ing형 변환(단독)",
    instruction: "다음 동사를 -ing 형으로 알맞게 바꾸시오.",
    isVerbList: true, 
    prompt: `
        You are an English teacher creating a quiz about present participles (the -ing form of verbs) for Korean students.
        Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} different English verbs in their base form. For each verb, provide its present participle (-ing) form.

        **CRITICAL RULES FOR VERB SELECTION:**
        1.  **Mix of Spelling Rules:** You MUST include a good mix of verbs that follow different spelling rules for adding -ing:
            - Verbs that just add '-ing' (e.g., go -> going, eat -> eating).
            - Verbs ending in a silent '-e' that is dropped (e.g., make -> making, write -> writing).
            - Verbs where the final consonant is doubled (e.g., run -> running, sit -> sitting, stop -> stopping).
            - Verbs ending in '-ie' that change to '-y' (e.g., lie -> lying, die -> dying).
        2.  **Variety:** Do not repeat verbs. Provide a diverse list of common verbs suitable for learners.

        The output must be a valid JSON array of objects. Each object must have two keys:
        1.  "question": The base form of the verb (e.g., "run").
        2.  "answer": The present participle (-ing) form (e.g., "running").
    `
},
    "personal_pronoun": {
        name: "L1_인칭대명사 개념",
        instruction: "다음 단어의 인칭, 수, 격, 해석을 모두 쓰시오.",
        isLocalData: true, 
        data: pronounData 
    },
    "pronoun_conversion": {
        name: "L1_인칭대명사 변환",
        instruction: "밑줄 친 부분을 알맞은 인칭대명사로 바꾸어 문장 전체를 다시 쓰시오.",
        isConversion: true,
        prompt: `
            You are an English teacher creating a pronoun conversion quiz for Korean students.
            Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} sentences. In each sentence, mark a noun phrase with square brackets [ ] that needs to be replaced with a personal pronoun.

            **CRITICAL RULES FOR PROBLEM DIVERSITY & ACCURACY:**
            1.  **Pronoun Rule:** The pronoun MUST correctly match the number (singular/plural) and gender/type (person/thing) of the HEAD NOUN in the bracketed phrase. 
                - Example for [My younger brother's toys]: The head noun is 'toys' (plural), so the pronoun is "They".
                - Example for [The girl's books]: The head noun is 'books' (plural), so the pronoun is "They".
                - Example for [The girl]: The head noun is 'girl' (singular, female), so the pronoun is "She" or "her".
            2.  **Marking Rule:** You MUST enclose the ENTIRE noun phrase to be converted in square brackets.
            3.  **Theme:** The sentences MUST be related to the theme of '\${randomTheme}'.
            4.  **Mix of Cases & Numbers:** Include a good mix of problems testing different pronoun cases (Subject, Object) and numbers (singular, plural, compound phrases like [Kate and I]).
            
            The output must be a valid JSON array of objects. Each object must have THREE keys:
            1. "question": The original sentence with the FULL noun phrase in square brackets.
            2. "pronoun": The single pronoun that REPLACES the bracketed phrase (e.g., "He", "it", "them", "They").
            3. "answer": The complete sentence with the noun phrase replaced by the correct pronoun.

            Example format:
            [
                {"question": "[My brother] likes pizza.", "pronoun": "He", "answer": "He likes pizza."},
                {"question": "The teacher is talking to [the students].", "pronoun": "them", "answer": "The teacher is talking to them."},
                {"question": "I like [the girl's dolls].", "pronoun": "them", "answer": "I like them."}
            ]
        `
    },
    "be_verb_negation": {
        name: "L1_Be동사 현재형 부정문",
        instruction: "다음 문장을 부정문으로 바꾸시오.",
        prompt: `
            You are an English teacher creating a high-quality quiz about be-verbs for Korean students.
            Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} sentences in the present tense that ONLY use a be-verb (am, is, are). For each sentence, provide its negative form.
            **Theme:** The sentences MUST be related to the theme of '\${randomTheme}'.
            The output must be a valid JSON array of objects. Each object must have keys: "question", "answer_full", "answer_short".
            Example: [{"question": "The lion is strong.", "answer_full": "The lion is not strong.", "answer_short": "The lion isn't strong."}]
        `
    },
    "be_verb_question": {
        name: "L1_Be동사 현재형 의문문",
        instruction: "다음 문장을 의문문으로 바꾸시오.",
        prompt: `
            You are an English teacher creating a high-quality quiz about be-verbs for Korean students.
            Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} sentences in the present tense that ONLY use a be-verb (am, is, are). For each sentence, provide its corresponding interrogative (yes/no question) form.
            **Theme:** The sentences MUST be related to the theme of '\${randomTheme}'.
            The output must be a valid JSON array of objects. Each object must have keys: "question", "answer".
            Example: [{"question": "The lion is in the zoo.", "answer": "Is the lion in the zoo?"}]
        `
    },
    "be_verb_past_negation": {
        name: "L2_Be동사 과거형 부정문",
        instruction: "다음 문장을 부정문으로 바꾸시오.",
        prompt: `
        You are an English teacher creating a high-quality quiz about the past tense of be-verbs for Korean students.
        Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} sentences in the simple past tense that ONLY use a be-verb (was, were). For each sentence, provide its negative form.
        **CRITICAL RULES FOR SENTENCE DIVERSITY:**
        1.  **Theme:** The sentences MUST be related to the theme of '\${randomTheme}'.
        2.  **Vary Subjects:** Use a wide variety of subjects that correctly pair with was and were.
        The output must be a valid JSON array of objects. Each object must have three keys: "question", "answer_full", "answer_short".
        Example: [{"question": "He was a teacher.", "answer_full": "He was not a teacher.", "answer_short": "He wasn't a teacher."}]
    `
    },
    "be_verb_past_question": {
        name: "L2_Be동사 과거형 의문문",
        instruction: "다음 문장을 의문문으로 바꾸시오.",
        prompt: `You are an English teacher creating a high-quality quiz about the past tense of be-verbs for Korean students.
        Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} sentences in the simple past tense that ONLY use a be-verb (was, were). For each sentence, provide its corresponding interrogative (yes/no question) form.
        **Theme:** The sentences MUST be related to the theme of '\${randomTheme}'.
        The output must be a valid JSON array of objects. Each object must have two keys: "question", "answer".
        Example: [{"question": "They were at the library.", "answer": "Were they at the library?"}]
    `
    },    
    "general_verb_negation": {
        name: "L1_일반동사 현재형 부정문",
        instruction: "다음 문장을 부정문으로 바꾸시오.",
        prompt: `
            You are an English teacher creating a high-quality quiz about general verbs (일반동사) for Korean students.
            Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} sentences in the present tense that ONLY use a general (action) verb, and NOT a be-verb. For each sentence, provide its negative form.
            **Theme:** The sentences MUST be related to the theme of '\${randomTheme}'.
            The output must be a valid JSON array of objects. Each object must have three keys: "question", "answer_full", "answer_short".
            Example: [{"question": "I play the guitar.", "answer_full": "I do not play the guitar.", "answer_short": "I don't play the guitar."}]
        `
    },
    "general_verb_question": {
        name: "L1_일반동사 현재형 의문문",
        instruction: "다음 문장을 의문문으로 바꾸시오.",
        prompt: `
        You are an English teacher creating a high-quality quiz about general verbs (일반동사) for Korean students.
        Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} sentences in the present tense that ONLY use a general (action) verb, and NOT a be-verb. For each sentence, provide its corresponding interrogative (yes/no question) form.
        **Theme:** The sentences MUST be related to the theme of '\${randomTheme}'.
        The output must be a valid JSON array of objects. Each object must have two keys: "question", "answer".
        Example: [{"question": "She reads a book before bed.", "answer": "Does she read a book before bed?"}]
        `
    },
    "general_verb_past_negation": {
        name: "L2_일반동사 과거형 부정문",
        instruction: "다음 문장을 부정문으로 바꾸시오.",
        prompt: `You are an English teacher creating a high-quality quiz about the past tense of general verbs for Korean students.
        Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} sentences in the simple past tense that ONLY use a general (action) verb. For each sentence, provide its negative form using "did not".
        **Theme:** The sentences MUST be related to the theme of '\${randomTheme}'.
        The output must be a valid JSON array of objects. Each object must have three keys: "question", "answer_full", "answer_short".
        Example: [{"question": "They saw a movie yesterday.", "answer_full": "They did not see a movie yesterday.", "answer_short": "They didn't see a movie yesterday."}]
        `
    },
    "general_verb_past_question": {
        name: "L2_일반동사 과거형 의문문",
        instruction: "다음 문장을 의문문으로 바꾸시오.",
        prompt: `You are an English teacher creating a high-quality quiz about the past tense of general verbs for Korean students.
        Generate exactly ${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT} sentences in the simple past tense that ONLY use a general (action) verb. For each sentence, provide its corresponding interrogative (yes/no question) form starting with "Did".
        **Theme:** The sentences MUST be related to the theme of '\${randomTheme}'.
        The output must be a valid JSON array of objects. Each object must have two keys: "question", "answer".
        Example: [{"question": "He took many pictures.", "answer": "Did he take many pictures?"}]
        `
    }
};

// =================================================================
//  DOM 요소 가져오기
// =================================================================
const topicCheckboxesContainer = document.getElementById('topic-checkboxes');
const generateQuizBtn = document.getElementById('generateQuizBtn');
const printQuestionsBtn = document.getElementById('printQuestionsBtn');
const printAnswersBtn = document.getElementById('printAnswersBtn');
const quizArea = document.getElementById('quiz-area');
const answerArea = document.getElementById('answer-area');

// =================================================================
//  함수 및 이벤트 리스너
// =================================================================
// 덮어쓰기 할 새로운 코드입니다. 전체를 복사해서 붙여넣으세요.

document.addEventListener('DOMContentLoaded', () => {
    // ▼▼▼ 여기에 새로운 코드를 추가합니다 ▼▼▼

    // 1. 암호를 설정하는 함수입니다.
    function checkPassword() {
        // 여기 "its_quiz_1234" 부분을 원하시는 암호로 자유롭게 바꾸세요!
        // 예를 들어 "itsenglish77" 와 같이 바꿀 수 있습니다.
        const password = "its05"; 
        
        const userInput = prompt("암호를 입력하세요:", "");

        // 사용자가 암호를 입력하지 않거나, 암호가 틀렸을 경우
        if (userInput !== password) {
            alert("암호가 올바르지 않습니다. 접근이 거부되었습니다.");
            // 퀴즈 생성기 전체를 화면에서 숨겨버립니다.
            document.querySelector('.container').style.display = 'none';
            return false; // 실패했다고 알림
        }
        
        // 암호가 맞으면 통과!
        return true; // 성공했다고 알림
    }

    // 2. 페이지가 열리자마자 위에서 만든 암호 확인 함수를 실행합니다.
    // 만약 암호가 틀렸다면(false라면), 여기서 모든 동작을 멈춥니다.
    if (!checkPassword()) {
        return; 
    }

    // ▲▲▲ 여기까지가 추가된 코드입니다 ▲▲▲
    // 암호를 맞게 입력한 사람에게만 아래의 원래 코드가 실행됩니다.

    // 이 부분은 원래 있던 코드입니다. 그대로 두세요.
    if (API_KEY.includes('YOUR_GEMINI_API_KEY')) {
        alert('app.js 파일에 자신의 Gemini API 키를 입력해주세요!');
        generateQuizBtn.disabled = true;
    }
    
    Object.keys(PROBLEM_TOPICS).forEach(key => {
        const topic = PROBLEM_TOPICS[key];
        const checkboxHTML = `
            <label>
                <input type="checkbox" name="topic" value="${key}">
                ${topic.name}
            </label>
        `;
        topicCheckboxesContainer.innerHTML += checkboxHTML;
    });
});

generateQuizBtn.addEventListener('click', handleQuizGeneration);
printQuestionsBtn.addEventListener('click', () => printContent(quizArea, '문제지'));
printAnswersBtn.addEventListener('click', () => printContent(answerArea, '정답지'));


/**
 * 로컬 데이터에서 문제를 생성하는 함수
 */
function generateLocalProblems(data, count) {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}


/**
 * 메인 로직: '단어 변형' 유형을 특별 처리합니다.
 */
async function handleQuizGeneration() {
    const selectedTopicKeys = Array.from(document.querySelectorAll('input[name="topic"]:checked'))
                                   .map(checkbox => checkbox.value);

    if (selectedTopicKeys.length === 0) {
        alert('하나 이상의 문제 유형을 선택해주세요.');
        return;
    }

    const hasVerbListType = selectedTopicKeys.some(key => PROBLEM_TOPICS[key].isVerbList);
    const hasSentenceType = selectedTopicKeys.some(key => !PROBLEM_TOPICS[key].isVerbList);

    if (hasVerbListType && hasSentenceType) {
        alert('\'단어 변형(단독)\' 문제는 다른 유형과 섞어서 출제할 수 없습니다.\n\n단어 변형 문제들만 선택하시거나, 다른 문장 유형들을 선택해주세요.');
        return;
    }

    const totalQuestionsInput = prompt("총 몇 문제로 시험지를 만들까요?", 20);
    if (totalQuestionsInput === null) return;
    const totalQuestions = parseInt(totalQuestionsInput) || 20;
    
    const questionsPerTopic = Math.ceil(totalQuestions / selectedTopicKeys.length);
    
    setLoadingState(true);

    try {
        const generationPromises = selectedTopicKeys.map(key => {
            const topic = PROBLEM_TOPICS[key];
            
            if (topic.isLocalData) {
                const problems = generateLocalProblems(topic.data, questionsPerTopic);
                return Promise.resolve(problems.map(p => ({ ...p, topicKey: key })));
            } else {
                const basePrompt = topic.prompt;
                const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
                
                let dynamicPrompt = basePrompt.replace(
                    `\${NUMBER_OF_QUESTIONS_PER_TOPIC_DEFAULT}`, 
                    questionsPerTopic
                );
                dynamicPrompt = dynamicPrompt.replace(/\${randomTheme}/g, randomTheme);
                
                return generateProblems(API_KEY, dynamicPrompt).then(problems => 
                    (problems || []).map(p => ({ ...p, topicKey: key }))
                );
            }
        });

        const results = await Promise.all(generationPromises);
        let allProblems = results.flat();

        if (allProblems.length === 0) {
            alert('문제를 생성하지 못했습니다. API 응답이 비어있을 수 있습니다.');
            return;
        }
        
        shuffleArray(allProblems);
        const finalQuiz = allProblems.slice(0, totalQuestions);
        
        renderQuiz(finalQuiz);
        
    } catch (error) {
        console.error("퀴즈 생성 로직 중 에러 발생:", error);
        alert("퀴즈를 처리하는 중 오류가 발생했습니다. 개발자 도구 콘솔(F12)을 확인해주세요.");
    } finally {
        setLoadingState(false);
    }
}

/**
 * 렌더링 함수: 문제 유형에 따라 다른 방식으로 화면을 그립니다.
 */
function renderQuiz(problems) {
    const createHeaderHTML = () => `
        <div class="quiz-header">
            <div class="logo-container"><img src="이츠로고.png" alt="로고" style="width:120px;"></div>
            <div class="info-container">
                <span>이름: ____________</span>
                <span>날짜: ____________</span>
            </div>
        </div>`;

    let quizHTML = createHeaderHTML();
    let answerHTML = createHeaderHTML() + `<h2 style="text-align:center; margin-bottom:20px;">문제 정답</h2>`;
    
    if (problems.length === 0) {
        quizArea.innerHTML = "<p>생성된 문제가 없습니다.</p>";
        return;
    }

    const firstProblemTopicKey = problems[0].topicKey;
    const isVerbListStyle = PROBLEM_TOPICS[firstProblemTopicKey].isVerbList;

    if (isVerbListStyle) {
        const groupedProblems = problems.reduce((acc, p) => {
            if (!acc[p.topicKey]) acc[p.topicKey] = [];
            acc[p.topicKey].push(p);
            return acc;
        }, {});
        
        let problemCounter = 1;
        Object.keys(groupedProblems).forEach(topicKey => {
            const group = groupedProblems[topicKey];
            const topicInfo = PROBLEM_TOPICS[topicKey];
            quizHTML += `<div class="quiz-instructions">${topicInfo.instruction}</div>`;
            quizHTML += '<div class="problem-list">';
            let answerListHTML_temp = '';

            group.forEach(p => {
                quizHTML += `
                    <div class="problem-item-container">
                        <div class="question-item">
                            <span class="question-number">${problemCounter}.</span>
                            <span class="question-sentence">(${p.question})</span>
                        </div>
                        <div class="answer-line">&rarr; ____________________</div>
                    </div>
                `;
                answerListHTML_temp += `<div class="answer-item"><b>${problemCounter}.</b> ${p.answer}</div>`;
                problemCounter++;
            });
            
            quizHTML += '</div>';
            answerHTML += answerListHTML_temp;
        });

    } else {
        problems.forEach((p, i) => {
            const currentTopic = PROBLEM_TOPICS[p.topicKey];
            const instruction = currentTopic.instruction;
            const questionText = p.question || '(질문 오류)';
            
            quizHTML += `<div class="quiz-instructions-individual">${i + 1}. ${instruction}</div>`;
            
            let finalAnswer = '';
            
            if (currentTopic.isConversion) {
                // [추가] 인칭대명사 '변환' 문제
                const displayQuestion = questionText.replace(/\[(.*?)\]/g, '<u>$1</u>');
                quizHTML += `
                    <div class="question-item-container-sentence">
                        <span class="question-sentence">${displayQuestion}</span>
                        <div class="answer-line">&rarr; ____________________________________________________</div>
                    </div>
                `;
                // ⭐️ 정답 문장에서 해당 대명사에만 밑줄을 긋도록 수정
                if (p.pronoun && p.answer) {
                    finalAnswer = p.answer.replace(p.pronoun, `<u>${p.pronoun}</u>`);
                } else {
                    finalAnswer = p.answer || '(정답 오류)';
                }

            } else if (currentTopic.isLocalData) {
                // 인칭대명사 '개념' 문제
                quizHTML += `<div class="question-item-container-sentence"><span class="question-sentence">${questionText}</span>`;
                const answerCount = Array.isArray(p.case) ? p.case.length : 1;

                for (let j = 0; j < answerCount; j++) {
                    quizHTML += `<div class="answer-line">&rarr; __인칭, __수, _______격, ________________(해석)</div>`;
                }
                quizHTML += `</div>`;

                if (Array.isArray(p.case)) {
                    finalAnswer = p.case.map((c, j) => {
                        const meaning = Array.isArray(p.meaning) ? p.meaning[j] : p.meaning;
                        return `${p.person}, ${p.number}, ${c}, ${meaning}`;
                    }).join('<br>');
                } else {
                    finalAnswer = `${p.person}, ${p.number}, ${p.case}, ${p.meaning}`;
                }

            } else {
                // 기타 모든 '문장' 문제
                if (p.answer) finalAnswer = p.answer;
                else if (p.answer_full) {
                    finalAnswer = p.answer_full;
                    if (p.answer_short && p.answer_full !== p.answer_short) {
                        finalAnswer += ` / ${p.answer_short}`;
                    }
                }

                quizHTML += `
                    <div class="question-item-container-sentence">
                        <span class="question-sentence">${questionText}</span>
                        <div class="answer-line">&rarr; ____________________________________________________</div>
                    </div>
                `;
            }
            
            answerHTML += `<div class="answer-item"><b>${i + 1}.</b> ${finalAnswer}</div>`;
        });
    }

    quizArea.innerHTML = quizHTML;
    answerArea.innerHTML = answerHTML;
}


function setLoadingState(isLoading) {
    generateQuizBtn.disabled = isLoading;
    generateQuizBtn.textContent = isLoading ? '문제 생성 중...' : '선택한 유형으로 문제 생성';
    if (isLoading) {
      quizArea.innerHTML = '<h2>이츠 영어가 여러 유형의 문제를 만들고 있습니다... ✍️</h2>';
      answerArea.innerHTML = '';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function printContent(element, title) {
    if (element.children.length < 2) {
         alert('먼저 문제를 생성해주세요.');
         return;
    }
    const clonedElement = element.cloneNode(true);
    clonedElement.id = 'print-section';
    clonedElement.style.display = 'block';

    document.body.appendChild(clonedElement);
    window.print();
    document.body.removeChild(clonedElement);
}
