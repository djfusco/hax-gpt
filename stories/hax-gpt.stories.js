import { html } from 'lit';
import '../src/hax-gpt.js';

export default {
  title: 'HaxGpt',
  component: 'hax-gpt',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <hax-gpt
      style="--hax-gpt-background-color: ${backgroundColor || 'white'}"
      .header=${header}
    >
    </hax-gpt>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
