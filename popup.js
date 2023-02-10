// script is deferred in html

// QUERIES
const button = document.querySelector('button');
const loader = document.querySelector('.loader');
const slider = document.querySelector('.slider');
const select = document.querySelector('.language-select');

button.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let result;
  // get selected text from active tab
  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => getSelection().toString(),
    });
  } catch (e) {
    return;
  }
  const tokenNum = Number(slider.value);

  //if value of select = no
  //  prompt assigned to explain this code in less than tokennum words
  //if value of select = anything else
  //  prompt assigned to can you translate this code for me in ${selectLanguage}
  let prompt = '';
  const language = select.value;
  if (language === 'no') {
    prompt = `Explain this code in less than ${tokenNum} words: ` + result;
  } else {
    prompt = `Can you translate this code into ${language} for me in less than ${tokenNum} words: ` + result;
  }

  const preface = document.createElement('p');
  if (result.trim() === '') {
    preface.classList.add('error');
    preface.innerHTML = 'Ya need to highlight some code &#129313;';
    document.body.append(preface);
    return;
  }
  try {
    const response = await fetchChatGPTResponse(prompt, tokenNum);
    preface.classList.add('preface');
    preface.innerText = 'GPT says... ';
    document.body.append(preface);
    document.body.append(response);
  } catch (e) {
    preface.classList.add('error');
    preface.innerHTML = 'Server Error: Too many requests &#129402;';
    document.body.append(preface);
  }
});

async function fetchChatGPTResponse(prompt, tokenNum) {
  // start loading spinner
  loader.classList.toggle('hidden');
  let response;
  try {
    response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}` // declare your own API_KEY, either in env file or this one
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0,
        max_tokens: tokenNum
      })
    });
  } catch (e) {
    return e;
  }

  const json = await response.json();
  //end loading spinner
  loader.classList.toggle('hidden');
  return json.choices[0].text;
}




