'use client';

import { useState, useEffect } from 'react';
import { sanityClient } from '@/lib/sanity.client';

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simple test query to check connection
        const testQuery = '*[_type == "sanity.imageAsset"][0..1]';
        const result = await sanityClient.fetch(testQuery);
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data from Sanity:', err);
        setError('Failed to connect to Sanity. Please check your configuration.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Sanity Connection Test</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {!loading && !error && (
        <div>
          <p className="mb-4">Connection to Sanity successful!</p>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Next Steps:</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Create your Sanity project at sanity.io/manage</li>
          <li>Set up your schema in Sanity Studio</li>
          <li>Add environment variables to your .env.local file:</li>
          <ul className="list-disc pl-6 mt-2">
            <li>NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id</li>
            <li>NEXT_PUBLIC_SANITY_DATASET=your_dataset_name</li>
            <li>SANITY_API_TOKEN=your_api_token (for preview/editing)</li>
          </ul>
          <li>Run Sanity Studio locally: npx sanity dev</li>
          <li>Add sample content to test with</li>
        </ol>
      </div>
    </div>
  );
}