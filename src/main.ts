import { intro, outro, select } from '@clack/prompts';




// Please see the comment in the .eslintrc.json file about the suppressed rule!
// Below is an example of how to use ESLint errors suppression. You can read more
// at https://eslint.org/docs/latest/user-guide/configuring/rules#disabling-rules

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

import { selectCommand } from './commands/index.js';

intro(`create-my-app`);
const launch = async (): Promise<void> => {

  selectCommand()
  
};

launch();
