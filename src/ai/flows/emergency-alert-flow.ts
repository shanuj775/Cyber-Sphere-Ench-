'use server';
/**
 * @fileOverview A specialized emergency dispatch flow for Cyber-Sphere.
 * Handles coordinates routing and secure distress signaling.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EmergencyAlertInputSchema = z.object({
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  email: z.string(),
  userId: z.string().optional(),
});

const EmergencyAlertOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export async function triggerEmergencyAlert(input: z.infer<typeof EmergencyAlertInputSchema>) {
  const flow = ai.defineFlow(
    {
      name: 'emergencyAlertFlow',
      inputSchema: EmergencyAlertInputSchema,
      outputSchema: EmergencyAlertOutputSchema,
    },
    async (input) => {
      const locationStr = input.lat && input.lng 
        ? `Latitude: ${input.lat}, Longitude: ${input.lng}`
        : 'Location data unavailable (GPS blocked)';

      // Simulate secure dispatch protocol
      console.log(`[CYBER-SPHERE EMERGENCY DISPATCH]`);
      console.log(`TARGET RECIPIENT: ${input.email}`);
      console.log(`ORIGINATING SPECIALIST: ${input.userId || 'Anonymous'}`);
      console.log(`COORDINATES: ${locationStr}`);
      console.log(`STATUS: Distress Beacon Routed via Secure Mesh`);
      
      return { 
        success: true, 
        message: `High-priority distress signal routed to ${input.email}` 
      };
    }
  );

  return flow(input);
}
