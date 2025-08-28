import { supabase } from '@/integrations/supabase/client';

export interface GeneratedImage {
  image: string;
  imageType: 'psychologist' | 'client';
}

export const generateTherapyImage = async (imageType: 'psychologist' | 'client'): Promise<string> => {
  try {
    console.log(`Generating ${imageType} image...`);
    
    const { data, error } = await supabase.functions.invoke('generate-therapy-images', {
      body: { imageType }
    });

    if (error) {
      console.error('Image generation error:', error);
      throw new Error(`Failed to generate ${imageType} image: ${error.message}`);
    }

    if (!data?.image) {
      throw new Error(`No image data received for ${imageType}`);
    }

    console.log(`Successfully generated ${imageType} image`);
    return data.image;
  } catch (error) {
    console.error(`Error generating ${imageType} image:`, error);
    throw error;
  }
};