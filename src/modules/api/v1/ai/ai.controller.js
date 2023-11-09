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
  const {
    curp,
    rfc,
    name,
    last_name: lastName,
    mothers_last_name: secLastName,
    specialty: specialist,
    consulting_room: medicalOffice,
    date,
  } = req.body;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'Eres el encargado de la recepción de un consultorio medico muy amigable',
      },
      {
        role: 'user',
        content: `
        Con los siguientes datos elabora un mensaje de confirmación de cita medica
        para una persona:
        1. CURP: ${curp}
        2. RFC: ${rfc}
        3. Nombre: ${name}
        4. Apellido Paterno: ${lastName}
        5. Apellido Materno: ${secLastName}
        6. Epecialista: ${specialist}
        7. Consultorio: ${medicalOffice}
        Con respecto a la fecha el cliente ha seleccionado un rango,
        tu deberas elegir una fecha y deberas elegir tambien la hora en la que sera atendido,
        La hora debera estar entre las 07 y las 20 horas dentro del rango proporcionado por el usuario
        el cual fue: ${date} del 2023, por ejemplo las 8 am, tu corrige el nombre de la especialidad, por ejemplo
        si te dice dentista la especialidad es odontologia.
        `,
      },
    ],
    model: 'gpt-3.5-turbo-1106', // gpt-3.5-turbo-1106 gpt-3.5-turbo
    // response_format: { type: 'json_object' },
  });
  log.info(completion.choices[0].message.content);
  res.status(httpStatus.OK).json(completion.choices[0].message);
}

export function test() {}
