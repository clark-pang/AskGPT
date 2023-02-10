const button = document.querySelector('button');
const loader = document.querySelector('.loader');
const slider = document.querySelector('.slider');
button.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let result;
  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => getSelection().toString(),
    });
  } catch (e) {
    return;
  }
  console.log(result);
  const tokenNum = Number(slider.value);
  console.log(tokenNum);
  const prompt = `Explain this code in less than ${tokenNum} words: ` + result;

  // async function callChatGPT(prompt) {
    //   const response = await fetchChatGPTResponse(prompt);
    //   return response;
    //

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



// curl https://api.openai.com/v1/completions \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer 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" \
// -d '{"model": "text-davinci-003", "prompt": "Say this is a test", "temperature": 0, "max_tokens": 7}'
async function fetchChatGPTResponse(prompt, tokenNum) {
  // start loading spinner
  loader.classList.toggle('hidden');

  //https://api.openai.com/v1/engines/davinci/jobs
  //https://api.openai.com/v1/models/text-davinci-003
  let response;
  try {
    response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0,
        max_tokens: tokenNum
      })
    });
  } catch (e) {
    console.log('error: ', e);
    return e;
  }
  console.log('response is: ', response);
  const json = await response.json();
  console.log('json: ', json);
  //end loading spinner
  loader.classList.toggle('hidden');
  return json.choices[0].text;
}




