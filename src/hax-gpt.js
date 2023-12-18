import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/multiple-choice/multiple-choice.js";

import { distance, closest } from 'fastest-levenshtein';


export class HaxGPT extends LitElement {
  static get properties() {
    return {
      version: { type: String }
    }
  }

  static get styles() {
    return css`
      :host {
        font-size: 2em;
      }
    `;
  }

  constructor() {
    super();
    this.version = null;
  }

  async _callGPT(e) {
    //console.log(e.detail);
    let base = ''; 
    if (
      window.location.origin.startsWith("http://127.0.0.1") ||
      window.location.origin.startsWith("http://localhost")
    ) {
      base = window.location.origin
        .replace(/127.0.0.1:8(.*)/, "localhost:3000")
        .replace(/localhost:8(.*)/, "localhost:3000");
    }
    const topic = this.shadowRoot.querySelector('#topicTextBox').value;
    return await fetch(`${base}/api/chatcall?search=${topic}`).then((r) => r.ok ? r.json() : []).then((data) => {
      return data;
    });
  }

  _getRandomTopic() {
    fetch('https://api.publicapis.org/random')
      .then(response => response.json())
      .then(data => {
        const randomTopic = data.entries[0].Description; // Extracting a random topic
        this.shadowRoot.querySelector('#topicTextBox').value = randomTopic;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }


  async _levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
  
    const matrix = [];
  
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
      for (let j = 0; j <= len2; j++) {
        if (i === 0) {
          matrix[i][j] = j;
        } else if (j === 0) {
          matrix[i][j] = i;
        } else {
          const cost = str1.charAt(i - 1) === str2.charAt(j - 1) ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + cost,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
  
    const distance = matrix[len1][len2];
    const maxLength = Math.max(len1, len2);
    const similarityPercentage = ((maxLength - distance) / maxLength) * 100;
  
    return similarityPercentage.toFixed(2);
  }


  firstUpdated() {
    this._getRandomTopic(); 
    const button = this.shadowRoot.querySelector('#myButton');
    if (button) {
      button.addEventListener('click', async () => {
        const results = await this._callGPT();
        const box = this.shadowRoot.querySelector('#myTextBox');
        if (box) {
         box.value = results; 
        }
      });
    }

    const answerBox = this.shadowRoot.querySelector('#topicAnswer');
    if (answerBox) {
      answerBox.addEventListener('input', async () => {
        const returnedAnswer = this.shadowRoot.querySelector('#myTextBox').value;
        const topicAnswer = this.shadowRoot.querySelector('#topicAnswer').value;

        const isDistance = distance(returnedAnswer, topicAnswer);
        const distanceBox = this.shadowRoot.querySelector('#levDistance');
        if (distanceBox) {
          distanceBox.value = isDistance; 
        }

        const resultsDiff = await this._levenshteinDistance(returnedAnswer,topicAnswer);
        ///console.log(`Similarity between texts: ${resultsDiff}%`);
        const levPercent = this.shadowRoot.querySelector('#levPercent');
        if (levPercent) {
          levPercent.value = resultsDiff; 
        }

      });
    }

  }

  render() {
    return html`

    <input type="text" style="width: 1300px; height: 140px;" id="topicTextBox">
    <br>
    <br>
    <br>
    Write a refection statement about this topic.
    <br>
    <br>
    <textarea id="topicAnswer" rows="20" cols="100" wrap="hard"></textarea>
    <br>
    <br>
    <br>
    <button id="myButton">Get Help</button>
    <br>
    <textarea id="myTextBox" rows="20" cols="100" wrap="hard"></textarea>
    <br>
    Levenshtein Distance (0 is a direct copy)
    <textarea id="levDistance" rows="1" cols="10"></textarea>

    Levenshtein Percentage
    <textarea id="levPercent" rows="1" cols="10"></textarea>

    `;
  }

}

customElements.define('hax-gpt', HaxGPT);