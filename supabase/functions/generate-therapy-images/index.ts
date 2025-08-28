import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageType } = await req.json()
    
    if (!imageType || !['psychologist', 'client'].includes(imageType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid imageType. Must be "psychologist" or "client"' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    let prompt = ''
    if (imageType === 'psychologist') {
      prompt = 'Colored pencil drawing style, professional male psychologist sitting in therapy session, writing in notebook, listening pose, warm muted earth tones, soft shading, gentle lighting, peaceful expression, professional attire, therapy office setting, hand-drawn artistic style, sketch-like quality, subtle colors'
    } else {
      prompt = 'Colored pencil drawing style, professional woman sitting in therapy session, hands gesturing while speaking, expressive pose, warm muted earth tones, soft shading, gentle lighting, engaged expression, comfortable clothing, therapy setting, hand-drawn artistic style, sketch-like quality, subtle colors'
    }

    console.log(`Generating ${imageType} image with prompt:`, prompt)

    const image = await hf.textToImage({
      inputs: prompt,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    console.log(`Successfully generated ${imageType} image`)

    return new Response(
      JSON.stringify({ 
        image: `data:image/png;base64,${base64}`,
        imageType 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})