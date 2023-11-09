import httpStatus from 'http-status';
import OpenAI from 'openai';
import log from '../../../../config/winston';

const openai = new OpenAI({
  organization: 'org-4Cmf2LvEbFLEHoq9Fl8qIcox',
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/v1/ai
export function aiRoot(req, res) {
  res.status(httpStatus.OK).json(req.body);
}

// POST /api/v1/ai/test
export async function aiTest(req, res) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `
        Haz una lista de 5 numeros en romano en formato json, 
        la clave es el romano y el valor su equivalente numérico 
        `,
      },
    ],
    model: 'gpt-3.5-turbo-1106', // gpt-3.5-turbo-1106 gpt-3.5-turbo
    response_format: { type: 'json_object' },
  });
  log.info(completion.choices[0].message.content);
  res.status(httpStatus.OK).json(completion.choices[0].message);
}

export function test() {}
