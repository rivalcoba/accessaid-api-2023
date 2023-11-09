import httpStatus from 'http-status';
import OpenAI from 'openai';
import { OpenAI as OpenAIlc } from 'langchain/llms/openai';
import path from 'path';
import appRoot from 'app-root-path';
// Import Langchain
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { RetrievalQAChain, loadQARefineChain } from 'langchain/chains';
import { readFileSync } from 'node:fs';
// Import local app services
import constans from '../../../../config/constants';
import log from '../../../../config/winston';

// Models: https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo

const model = new OpenAIlc({
  openAIApiKey: constans.OPENAI_API_KEY,
  temperature: 0.9,
  modelName: 'gpt-3.5-turbo-1106', // gpt-3.5-turbo-1106, gpt-4 gpt-4-0613
});

const openai = new OpenAI({
  organization: 'org-4Cmf2LvEbFLEHoq9Fl8qIcox',
  apiKey: constans.OPENAI_API_KEY,
});

// POST /api/v1/ai
export function aiRoot(req, res) {
  res.status(httpStatus.OK).json(req.body);
}

// POST /api/v1/ai/test
export async function aiTest(req, res) {
  const {
    curp,
    rfc,
    name,
    last_name: lastName,
    mothers_last_name: secLastName,
    specialty: specialist,
    consulting_room: medicalOffice,
    date,
    hour: time,
  } = req.body;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'Eres la encargada de la recepción de un consultorio medico que lleva por nombre Accessaid, eres muy amigable',
      },
      {
        role: 'user',
        content: `
        Con los siguientes datos proporcionados por un cliente
        elabora un mensaje de confirmación de cita medica, el cliente es
        una persona discapacitada:
        1. CURP: ${curp}
        2. RFC: ${rfc}
        3. Nombre: ${name}
        4. Apellido Paterno: ${lastName}
        5. Apellido Materno: ${secLastName}
        6. Epecialista: ${specialist}
        7. Consultorio: ${medicalOffice}
        8. Rango de la Fecha:${date}
        9. Rango de la hora: ${time}
        Contempla los siguientes aspectos para el mensaje:
        Con respecto a la fecha de la consulta el cliente te ofrecera
        un rango de días y un rango de horas, tu deber
        es elegir una fecha y hora dentro del rango proporcionado por 
        el cliente, por ejemplo: El dia lunes 13 a las 8 am.
        Con respecto a la especialidad asegura de seleccionar el nombre adecuado
        de la especialidad, por ejemplo si el cliente en el especialista dice dentista 
        la especialidad es odontologia, si no reconoces la especialidad mandalo a
        medicina familiar.
        `,
      },
    ],
    model: 'gpt-3.5-turbo-1106', // gpt-3.5-turbo-1106 gpt-3.5-turbo
    // response_format: { type: 'json_object' },
  });
  log.info(completion.choices[0].message.content);
  res.status(httpStatus.OK).json(completion.choices[0].message);
}

// POST /api/v1/ai/train
export async function train(req, res) {
  try {
    // STEP 1: Load the data
    const filePath = path.join(appRoot.path, 'assets', 'training-data.txt');
    const trainingText = readFileSync(filePath, { encoding: 'utf8' });

    // Step 2: Split the data into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    // STEP 3: Create documents
    const docs = await textSplitter.createDocuments([trainingText]);

    // STEP 4: Generate embeddings from documents
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings({ openAIApiKey: constans.OPENAI_API_KEY })
    );

    // STEP 5: Save the vector store
    vectorStore.save('hnswlib');

    log.info('Modelo entrenado con exito');

    return res.status(httpStatus.OK).json({
      message: vectorStore,
    });
  } catch (error) {
    // Handle any errors that may occur
    log.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' });
  }
}

// POST /api/v1/ai/get-answer
export async function getAnswer(req, res) {
  const {
    curp,
    rfc,
    name,
    last_name: lastName,
    mothers_last_name: secLastName,
    specialty: specialist,
    consulting_room: medicalOffice,
    date,
    hour: time,
    symptoms,
  } = req.body;
  const question = `
  Eres la encargada de la recepción de un consultorio medico que lleva 
  por nombre "Clinica medica Mediquer", tu caracter es amigable.
  Elabora un mensaje de confirmación de cita medica, con los siguientes datos proporcionados 
  por un cliente, cabe destacar que el cliente es una persona discapacitada:
  - El cliente dio el siguiente CURP: ${curp}
  - El cliente dio el siguiente RFC: ${rfc}
  - El cliente dio el siguiente Nombre: ${name} ${lastName} ${secLastName}
  - El cliente presenta los siguientes sintomas: ${symptoms}
  - El cliente solicita ir al consultorio: ${medicalOffice}
  - El siguiente desea un cita dentro de esta fecha: ${date}
  - El siguiente desea un cita dentro de este horario: ${time}
  Contempla los siguientes aspectos para el mensaje de confirmación:
  1. Con respecto a la fecha de la consulta el cliente te ofrecera
  un rango de días y un rango de horas, tu deber
  es programar una cita dentro del rango de fechas y horas proporcionadas por 
  el cliente y que este dentro de los Horarios de atención, elige una fecha y hora exacta. 
  2. Si el consultorio no esta dentro de los disponibles selecciona el "15".
  3. Elige una especialidad en función de la sintomatologia que presenta y explica
  por que lo envias con ese especialista.
  4. Dentro de la confirmación menciona el nombre del médico a cargo 
  de la especialidad asignada al paciente.
  5. Contempla que el mensaje sera leido por un sintetizador de voz.
  `;
  try {
    const vectorStore = await HNSWLib.load(
      'hnswlib',
      new OpenAIEmbeddings({ openAIApiKey: constans.OPENAI_API_KEY })
    );
    const chain = new RetrievalQAChain({
      combineDocumentsChain: loadQARefineChain(model),
      retriever: vectorStore.asRetriever(),
    });

    log.info(question);

    const result = await chain.call({
      query: question,
    });

    return res.status(200).json({
      data: 'response ok',
      content: result.output_text,
    });
  } catch (error) {
    log.error(error);
    return res.status(200).send({
      message: 'Something went wrong',
      error,
    });
  }
}
