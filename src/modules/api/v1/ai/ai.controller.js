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

export function test() {}
