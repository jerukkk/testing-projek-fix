const sanityClient = require('@sanity/client');
const fs = require('fs');

// Read environment variables from .env.local file manually
let envVars = {};
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        envVars[key.trim()] = value.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
      }
    }
  });
}

const client = sanityClient.createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: envVars.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-19',
  token: envVars.SANITY_API_TOKEN,
  useCdn: false,
});

async function testApiConnection() {
  console.log('Testing Sanity API connection...');
  console.log('Project ID:', envVars.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log('Dataset:', envVars.NEXT_PUBLIC_SANITY_DATASET);
  console.log('Token present:', !!envVars.SANITY_API_TOKEN);
  
  try {
    // Test fetching all articles
    console.log('\nFetching all articles...');
    const articles = await client.fetch('*[_type == "article"]');
    console.log(`Found ${articles.length} articles:`);
    articles.forEach((article, index) => {
      console.log(`${index + 1}. Title: "${article.title}", Slug: "${article.slug?.current}"`);
    });
    
    // Test fetching all events
    console.log('\nFetching all events...');
    const events = await client.fetch('*[_type == "event"]');
    console.log(`Found ${events.length} events:`);
    events.forEach((event, index) => {
      console.log(`${index + 1}. Title: "${event.title}", Slug: "${event.slug?.current}"`);
    });
    
    // Test fetching all members
    console.log('\nFetching all members...');
    const members = await client.fetch('*[_type == "member"]');
    console.log(`Found ${members.length} members:`);
    members.forEach((member, index) => {
      console.log(`${index + 1}. Name: "${member.name}", Position: "${member.position}"`);
    });
    
    console.log('\n✅ API connection successful!');
  } catch (error) {
    console.error('\n❌ Error connecting to Sanity API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.statusCode === 401) {
      console.error('This usually means the token is invalid or missing required permissions.');
    }
  }
}

testApiConnection();