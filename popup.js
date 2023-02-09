


const button = document.querySelector('button');
const loader = document.querySelector('.loader');
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
  const prompt = 'Can you explain this code for me? ' + result;

  // async function callChatGPT(prompt) {
  //   const response = await fetchChatGPTResponse(prompt);
  //   return response;
  //
  const preface = document.createElement('p');
  try {
    const response = await fetchChatGPTResponse(prompt);
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
async function fetchChatGPTResponse(prompt) {
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
        temperature: .1,
        max_tokens: 1000
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


// async function fetchChatGPTResponse(prompt) {
//   const response = await fetch(`https://api.openai.com/v1/engines/text-davinci-002/jobs`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${APIKey}`
//     },
//     body: JSON.stringify({
//       prompt: prompt,
//       max_tokens: 100,
//       temperature: 0.5,
//     })
//   });
//   const json = await response.json();
//   return json.choices[0].text;
// }








// async function getCurrentTab() {
//   let queryOptions = { active: true, lastFocusedWindow: true };
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   let [tab] = await chrome.tabs.query(queryOptions);
//   console.log(tab);
// }
// console.log("Success");

// ChatGPT example
// chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//   var currentTab = tabs[0];
//   var tabId = currentTab.id;

//   chrome.tabs.executeScript(tabId, {
//     code: 'document.body.innerHTML'
//   }, function(result) {
//     console.log(result[0]);
//   });
// });

// function getSelectedText() {
//   let selectedText = '';

// //   // window.getSelection
// //   if (window.getSelection) {
// //       selectedText = window.getSelection();
// //   }

//     // document.getSelection
//     // if (document.getSelection) {
//     //     selectedText = document.getSelection();
//     // }
//     console.log('selectedText is: ', document.getSelection());
//   // document.selection
// //   else if (document.selection) {
// //       selectedText = document.selection.createRange().text;
// //   } else return;
// //   // To write the selected text into the textarea
// //   document.testform.selectedtext.value = selectedText;
// }
// getSelectedText();

// // chrome.browserAction.onClicked.addListener(function (tab) { alert('icon clicked') });


// // chrome.action.onClicked.addListener(async (tab) => {

// // });

// const APIKey = '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';

