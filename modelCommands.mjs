import openai from "openai";
import inquirer from "inquirer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import openaiPackage from "@tectalic/openai";
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);

openai.apiKey = process.env.OPENAI_API_KEY;
import {chatCompletion} from './commands/index.mjs';
async function promptModel(prompt, modelId) {
  // const prompt = `${prompt}`;

  console.log("Prompting model...", prompt, modelId);
  const completion = await openaiClient.completions.create({
    // engine: "gpt-3.5-turbo",:ft-fabrikapp-2023-04-01-02-55-17
    model: modelId ?? "text-davinci-003",
    prompt: prompt,
    max_tokens: 200,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  console.log("Updated model with new content:", completion);
  console.log(completion.data.choices[0].text.trim());
}
async function updateModel(modelId, role, content) {
  const prompt = `${role}: ${content}`;
  // console.log('Updating model...', openai, openaiClient);
  // return;
  const completion = await openaiClient.Completion.create({
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

async function main() {
  const modelIdAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "modelId",
      message: "Enter the model ID:",
    },
  ]);

  const roleAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "role",
      message: "Select role:",
      choices: ["system", "user", "assistant"],
    },
  ]);

  const contentAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "content",
      message: "Input content:",
    },
  ]);

  updateModel(modelIdAnswer.modelId, roleAnswer.role, contentAnswer.content);
}

// async function createModel2() {
//   try {
//     const questions = [
//       {
//         type: "input",
//         name: "train_file_id",
//         message: "Enter the ID of the training file:",
//       },
//       {
//         type: "input",
//         name: "base_model",
//         message: "Enter the base model name (ada, babbage, curie, or davinci):",
//       },
//     ];

//     const answers = await inquirer.prompt(questions);

//     const fineTuneCreateParams: FineTuneCreateParams = {
//       training_file: answers.train_file_id,
//       base_model: answers.base_model,
//     };

//     const fineTune = await FineTune.create(fineTuneCreateParams);

//     console.log(`Fine-tuning job created with ID: ${fineTune.id}`);
//   } catch (error) {
//     console.error("Error creating fine-tuned model:", error.message);
//   }
// }

// ...

async function createModel() {
  try {
    const questions = [
      {
        type: "input",
        name: "train_file_id",
        message: "Enter the ID of the training file:",
        default: "John Doe",
      },
      {
        type: "input",
        name: "base_model",
        message: "Enter the base model name (ada, babbage, curie, or davinci):",
      },
    ];

    const answers = await inquirer.prompt(questions);

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    };

    const data = {
      training_file: answers.train_file_id,
      base_model: answers.base_model,
    };

    const response = await axios.post(
      "https://api.openai.com/v1/fine-tunes",
      data,
      config
    );

    console.log(`Fine-tuning job created with ID: ${response.data.id}`);
  } catch (error) {
    console.error("Error creating fine-tuned model:", error.message);
  }
}

// ...

async function fetchModels() {
  try {
    // console.log("models", await openaiClient.models.list());
    const models = await openaiClient.models.list();
    console.log("Models belonging to the account:");
    console.log(`models.length: ${models.data.data.length}`);
    models.data.data.forEach((model) => {
      const createdAt = new Date(model.created * 1000).toLocaleString();
      console.log(`${model.id}: ${model.object} (${createdAt})`);
    });
  } catch (error) {
    console.error("Error fetching models:", error.message);
  }
}
async function fetchFiles() {
  try {
    // console.log("models", await openaiClient.models.list());
    const models = await openaiClient.files.list();
    console.log("Files belonging to the account:");
    console.log(`Files.length: ${models.data.data.length}`);
    models.data.data.forEach((model) => {
      const createdAt = new Date(model.created * 1000).toLocaleString();
      console.log(`${model.id}: ${model.object} (${createdAt})`, model);
    });
  } catch (error) {
    console.error("Error fetching models:", error.message);
  }
}
async function fetchFineTunes() {
  try {
    // console.log("models", await openaiClient.models.list());
    const models = await openaiClient.fineTunes.list();
    console.log("fineTunes belonging to the account:");
    console.log(`fineTunes.length: ${models.data.data.length}`);
    models.data.data.forEach((model) => {
      const createdAt = new Date(model.updated_at * 1000).toLocaleString();
      console.log(
        `${model.id} (${model.model}): ${model.status} (${createdAt}) :${model.fine_tuned_model} `
      );
    });
  } catch (error) {
    console.error("Error fetching models:", error.message);
  }
}

async function uploadTrainingFile(filePath) {
  try {
    // console.log("models", await openaiClient.models.list());
    console.log("FuploadTrainingFile Start");
    const models = await openaiClient.files.create({
      purpose: "fine-tune",
      file: filePath,
    });
    console.log("FuploadTrainingFile", models);
    // console.log(`Files.length: ${models.data.data.length}`);
    // models.data.data.forEach((model) => {
    //     const createdAt = new Date(model.created * 1000).toLocaleString();
    //   console.log(`${model.id}: ${model.object} (${createdAt})`, model);
    // });
    return models.data.id;
  } catch (error) {
    console.log(error.response.data);
    console.error("Error fetching models:", error.message);
  }
}

async function uploadTrainingFileX(filePath) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const config = {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    };

    // console.log(config);
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    form.append("purpose", "fine-tuning");

    config.headers[
      "Content-Type"
    ] = `multipart/form-data; boundary=${form.getBoundary()}`;

    const response = await axios.post(
      "https://api.openai.com/v1/files",
      form,
      config
    );
    const fileID = response.data.id;
    // ./models/1.json
    // console.log(response);

    console.log(`Training file uploaded with ID: ${fileID}`);
    return fileID;
  } catch (error) {
    // console.log(error);
    console.error("Error uploading training file:", error.message);
    return null;
  }
}

// ...

async function createModelFromFile() {
  try {
    const questions = [
      {
        type: "input",
        name: "train_file_path",
        message: "Enter the path to the training file:",
        default: "./models/2.jsonl",
      },
      {
        type: "input",
        name: "base_model",
        message: "Enter the base model name (ada, babbage, curie, or davinci):",
        default: "ada",
      },
    ];

    const answers = await inquirer.prompt(questions);

    const fileID = await uploadTrainingFile(answers.train_file_path);
    console.log("fileID", fileID);
    if (!fileID) {
      console.error("Failed to upload training file.");
      return;
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    };

    const data = {
      training_file: fileID,
      model: answers.base_model,
    };

    const response = await openaiClient.fineTunes.create(data);

    console.log(`Fine-tuning job created with ID: ${response.data.id}`);
  } catch (error) {
    console.log(error);
    console.error("Error creating fine-tuned model:", error.message);
  }
}

// ...

export {
  updateModel,
  createModel,
  fetchModels,
  promptModel,
  createModelFromFile,
  fetchFiles,
  fetchFineTunes,
  chatCompletion
};
