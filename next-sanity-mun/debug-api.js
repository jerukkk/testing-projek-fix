const sanityClient = require('@sanity/client');

// Read environment variables from .env.local file manually
const fs = require('fs');
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

// Client with CDN disabled
const clientWithoutCDN = sanityClient.createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: envVars.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-19',
  token: envVars.SANITY_API_TOKEN,
  useCdn: false, // Disable CDN
});

// Client with CDN enabled (like in your app)
const clientWithCDN = sanityClient.createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: envVars.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-19',
  token: envVars.SANITY_API_TOKEN,
  useCdn: true, // Enable CDN (like in your app)
});

async function compareClients() {
  console.log('Testing Sanity API connections...\n');
  
  console.log('Project ID:', envVars.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log('Dataset:', envVars.NEXT_PUBLIC_SANITY_DATASET);
  console.log('Token present:', !!envVars.SANITY_API_TOKEN);
  console.log('');

  try {
    console.log('1. Testing with CDN disabled...');
    const articlesWithoutCDN = await clientWithoutCDN.fetch('*[_type == "article"]');
    console.log(`   Found ${articlesWithoutCDN.length} articles without CDN`);

    console.log('\n2. Testing with CDN enabled...');
    const articlesWithCDN = await clientWithCDN.fetch('*[_type == "article"]');
    console.log(`   Found ${articlesWithCDN.length} articles with CDN`);

    console.log('\n3. Comparing results...');
    if (articlesWithoutCDN.length !== articlesWithCDN.length) {
      console.log('   ⚠️  Different results between CDN and non-CDN clients!');
      console.log(`   Without CDN: ${articlesWithoutCDN.length} articles`);
      console.log(`   With CDN: ${articlesWithCDN.length} articles`);
    } else {
      console.log('   ✅ Same results from both clients');
    }

    console.log('\n4. Sample article titles (without CDN):');
    articlesWithoutCDN.slice(0, 3).forEach((article, index) => {
      console.log(`   ${index + 1}. "${article.title}"`);
    });

    console.log('\n5. Sample article titles (with CDN):');
    articlesWithCDN.slice(0, 3).forEach((article, index) => {
      console.log(`   ${index + 1}. "${article.title}"`);
    });

    console.log('\n✅ Comparison completed!');
  } catch (error) {
    console.error('\n❌ Error comparing clients:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

compareClients();