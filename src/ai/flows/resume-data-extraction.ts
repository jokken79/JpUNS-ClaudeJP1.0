// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Extracts data from a resume document.
 *
 * - extractResumeData - A function that handles the resume data extraction process.
 * - ExtractResumeDataInput - The input type for the extractResumeData function.
 * - ExtractResumeDataOutput - The return type for the extractResumeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractResumeDataInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      'A resume document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type ExtractResumeDataInput = z.infer<typeof ExtractResumeDataInputSchema>;

const ExtractResumeDataOutputSchema = z.object({
  fullName: z.string().describe('The full name of the applicant.'),
  furigana: z.string().optional().describe('The furigana of the applicant if available.'),
  birthDate: z.string().optional().describe('The birth date of the applicant.'),
  age: z.number().optional().describe('The age of the applicant.'),
  gender: z.string().optional().describe('The gender of the applicant.'),
  photo: z.string().optional().describe('The photo/face of the person from the document as a data URI (base64 encoded image).'),
  email: z.string().optional().describe('The email address of the applicant.'),
  phone: z.string().optional().describe('The phone number of the applicant.'),
  address: z.string().optional().describe('The address of the applicant.'),
  postalCode: z.string().optional().describe('The postal code of the applicant.'),
  education: z
    .array(
      z.object({
        school: z.string().describe('The name of the school or university.'),
        department: z.string().optional().describe('The department or major of study.'),
        graduationDate: z.string().optional().describe('The graduation date.'),
        degree: z.string().optional().describe('The degree obtained.'),
      })
    )
    .optional()
    .describe('The education history of the applicant.'),
  workExperience:
   z.array(
      z.object({
        company: z.string().describe('The name of the company.'),
        position: z.string().describe('The position held at the company.'),
        startDate: z.string().describe('The start date of the employment.'),
        endDate: z.string().describe('The end date of the employment.'),
        description: z.string().optional().describe('The description of the job responsibilities.'),
      })
    )
    .optional()
    .describe('The work experience history of the applicant.'),
  skills: z.array(z.string()).optional().describe('A list of skills possessed by the applicant.'),
  selfPR: z.string().optional().describe('A summary of the applicant provided in the resume.'),
  desiredSalary: z.number().optional().describe('The desired salary of the applicant.'),
  desiredPosition: z.string().optional().describe('The desired position of the applicant.'),
});

export type ExtractResumeDataOutput = z.infer<typeof ExtractResumeDataOutputSchema>;

export async function extractResumeData(
  input: ExtractResumeDataInput
): Promise<ExtractResumeDataOutput> {
  return extractResumeDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractResumeDataPrompt',
  input: {schema: ExtractResumeDataInputSchema},
  output: {schema: ExtractResumeDataOutputSchema},
  model: 'googleai/gemini-2.5-flash-preview-05-20',
  config: {
    temperature: 0.1,
    maxOutputTokens: 4096,
  },
  prompt: `Analyze this Japanese ID document and extract:

Document: {{media url=resumeDataUri}}

Extract and return JSON with:
{
  "fullName": "person's name in kanji",
  "furigana": "name in hiragana/katakana", 
  "birthDate": "YYYY-MM-DD format",
  "gender": "男性 or 女性",
  "address": "full address",
  "phone": "phone number if visible",
  "email": "email if visible", 
  "postalCode": "postal code if visible",
  "photo": "extract person's photo as data:image/jpeg;base64,... format"
}

CRITICAL: Extract the person's photo from the document and convert to base64 data URI format.`,
});

const extractResumeDataFlow = ai.defineFlow(
  {
    name: 'extractResumeDataFlow',
    inputSchema: ExtractResumeDataInputSchema,
    outputSchema: ExtractResumeDataOutputSchema,
  },
  async input => {
    try {
      console.log('Iniciando llamada a Gemini...');
      
      // Crear un timeout personalizado más largo
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Gemini está tardando demasiado')), 120000) // 2 minutos
      );
      
      const promptPromise = prompt(input);
      
      const result = await Promise.race([promptPromise, timeoutPromise]);
      const {output} = result as any;
      
      console.log('Respuesta de Gemini recibida:', output ? 'OK' : 'EMPTY');
      return output || {
        fullName: '',
        furigana: '',
        birthDate: '',
        age: 0,
        gender: '',
        photo: '',
        email: '',
        phone: '',
        address: '',
        postalCode: '',
        education: [],
        workExperience: [],
        skills: [],
        selfPR: '',
        desiredSalary: 0,
        desiredPosition: '',
      };
    } catch (error) {
      console.error('Error en extractResumeDataFlow:', error);
      // Retornar datos vacíos si hay error, para que no falle completamente
      return {
        fullName: '',
        furigana: '',
        birthDate: '',
        age: 0,
        gender: '',
        photo: '',
        email: '',
        phone: '',
        address: '',
        postalCode: '',
        education: [],
        workExperience: [],
        skills: [],
        selfPR: '',
        desiredSalary: 0,
        desiredPosition: '',
      };
    }
  }
);
