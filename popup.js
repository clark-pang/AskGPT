//import { ChatGPTAPI } from 'chatgpt'

const APIKey = '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'

const button = document.querySelector('button');
button.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let result;
  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => getSelection().toString(),
    });
  } catch (e) {
    return; // ignoring an unsupported page like chrome://extensions
  }
  console.log(result);
  const prompt = 'Can you explain this code for me? ' + result;

  // async function callChatGPT(prompt) {
  //   const response = await fetchChatGPTResponse(prompt);
  //   return response;
  //
  const response = await fetchChatGPTResponse(prompt);
  const preface = document.createElement('p');
  preface.classList.add('preface');
  preface.innerText = 'Chat GPT says: ';
  document.body.append(preface);
  document.body.append(response);
});



// curl https://api.openai.com/v1/completions \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer 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" \
// -d '{"model": "text-davinci-003", "prompt": "Say this is a test", "temperature": 0, "max_tokens": 7}'
async function fetchChatGPTResponse(prompt) {

  //https://api.openai.com/v1/engines/davinci/jobs
  //https://api.openai.com/v1/models/text-davinci-003
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${'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'}`
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: .1,
      max_tokens: 1000
    })
  });
  const json = await response.json();
  console.log('json: ', json);
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

