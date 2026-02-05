const { createClient } = require('@sanity/client');

// Simulate production environment conditions
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ny2z8d3s';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-19';
const token = process.env.SANITY_API_TOKEN || '';

console.log('Environment simulation:');
console.log('Project ID:', projectId);
console.log('Dataset:', dataset);
console.log('API Version:', apiVersion);
console.log('Token present:', !!token);
console.log('');

// Create client similar to production
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: token || undefined, // Only use token if available
  useCdn: true, // Production uses CDN
  perspective: 'published', // Only published content
});

async function testProductionConditions() {
  console.log('Testing with production-like settings...\n');
  
  try {
    // Test basic connectivity
    console.log('1. Testing basic query...');
    const count = await client.fetch('count(*[_type == "article"])');
    console.log(`   Found ${count} articles in total\n`);

    // Test detailed query like in your app
    console.log('2. Testing detailed query (like in articles page)...');
    const articles = await client.fetch(`
      *[_type == "article"] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        mainImage {
          asset->{
            _id,
            url
          },
          alt
        }
      } | order(publishedAt desc)
    `);
    
    console.log(`   Retrieved ${articles.length} articles with details`);
    
    if (articles.length > 0) {
      console.log('\n   Sample article:');
      console.log(`   - Title: "${articles[0].title}"`);
      console.log(`   - Slug: "${articles[0].slug}"`);
      console.log(`   - Published: ${articles[0].publishedAt}`);
      console.log(`   - Has excerpt: ${!!articles[0].excerpt}`);
      console.log(`   - Has image: ${!!articles[0].mainImage}`);
    }

    // Test specific article query
    if (articles.length > 0) {
      console.log('\n3. Testing individual article query (like in [slug] page)...');
      const article = await client.fetch(`
        *[_type == "article" && slug.current == $slug][0]{
          _id,
          _type,
          title,
          slug,
          publishedAt,
          excerpt,
          body,
          mainImage {
            asset->{
              _id,
              url
            },
            alt
          },
          author->{
            _id,
            name,
            "avatar": image.asset->url
          }
        }
      `, { slug: articles[0].slug });
      
      console.log(`   Individual article query result: ${article ? 'Success' : 'Failed'}`);
      if (article) {
        console.log(`   - Title: "${article.title}"`);
        console.log(`   - Has body content: ${!!article.body}`);
        console.log(`   - Has author: ${!!article.author}`);
      }
    }

    console.log('\n✅ All production-like tests passed!');
  } catch (error) {
    console.error('\n❌ Error in production-like test:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testProductionConditions();