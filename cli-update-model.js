const openai = require("openai");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

openai.apiKey = process.env.OPENAI_API_KEY;

async function updateModel(modelId, role, content) {
  const prompt = `${role}: ${content}`;

  const completion = await openai.ChatCompletion.create({
    engine: modelId,
    prompt: prompt,
    max_tokens: 50,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  console.log("Updated model with new content:");
  console.log(completion.choices[0].text.trim());
}

const argv = yargs(hideBin(process.argv))
  .command(
    "update",
    "Update custom dataset with OpenAI API",
    (yargs) => {
      yargs
        .option("model", {
          alias: "m",
          type: "string",
          description: "ID of the model",
          demandOption: true,
        })
        .option("role", {
          alias: "r",
          type: "string",
          choices: ["system", "user", "assistant"],
          description: "Select role: system, user, or assistant",
          demandOption: true,
        })
        .option("content", {
          alias: "c",
          type: "string",
          description: "Input content",
          demandOption: true,
        });
    },
    (argv) => {
      updateModel(argv.model, argv.role, argv.content);
    }
  )
  .demandCommand(1)
  .help()
  .alias("help", "h").argv;
