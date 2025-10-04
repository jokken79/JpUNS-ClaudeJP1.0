'use server';

/**
 * @fileOverview Generates a draft of the self-PR section of a resume based on skills and work experience.
 *
 * - generateSelfPR - A function that generates the self-PR.
 * - GenerateSelfPRInput - The input type for the generateSelfPR function.
 * - GenerateSelfPROutput - The return type for the generateSelfPR function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSelfPRInputSchema = z.object({
  skills: z.array(z.string()).describe('List of skills'),
  workExperience: z
    .array(
      z.object({
        company: z.string(),
        position: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string(),
      })
    )
    .describe('List of work experience'),
});
export type GenerateSelfPRInput = z.infer<typeof GenerateSelfPRInputSchema>;

const GenerateSelfPROutputSchema = z.object({
  selfPR: z.string().describe('Generated self-PR section'),
});
export type GenerateSelfPROutput = z.infer<typeof GenerateSelfPROutputSchema>;

export async function generateSelfPR(
  input: GenerateSelfPRInput
): Promise<GenerateSelfPROutput> {
  return generateSelfPRFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSelfPRPrompt',
  input: {schema: GenerateSelfPRInputSchema},
  output: {schema: GenerateSelfPROutputSchema},
  prompt: `You are an experienced HR assistant tasked with drafting a self-PR section for a resume.

  Given the following skills and work experience, generate a compelling self-PR section.

  Skills:
  {{#each skills}}
  - {{this}}
  {{/each}}

  Work Experience:
  {{#each workExperience}}
  - Company: {{company}}, Position: {{position}}, Description: {{description}}
  {{/each}}
  \n  Write a self-PR section that is approximately 150-200 words long, highlighting the candidate's strengths and accomplishments.
  `,
});

const generateSelfPRFlow = ai.defineFlow(
  {
    name: 'generateSelfPRFlow',
    inputSchema: GenerateSelfPRInputSchema,
    outputSchema: GenerateSelfPROutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
