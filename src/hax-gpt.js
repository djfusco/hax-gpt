import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/multiple-choice/multiple-choice.js";

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
  }

  render() {
    return html`

    <input type="text" style="width: 1300px; height: 140px;" id="topicTextBox">
    Write a refection statement about this topic.
    <input type="text" style="width: 1300px; height: 140px;" id="topicAnswer">


    <button id="myButton">Get Help</button>
    <input type="text" style="width: 1300px; height: 140px;" id="myTextBox">
    `;
  }

}

customElements.define('hax-gpt', HaxGPT);