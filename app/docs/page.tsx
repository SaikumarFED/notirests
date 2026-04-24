'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Copy, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

const sections = [
  { id: 'getting-started', title: 'Getting Started' },
  { id: 'authentication', title: 'Authentication' },
  { id: 'endpoints', title: 'Endpoints' },
  { id: 'get-request', title: 'GET Request' },
  { id: 'post-request', title: 'POST Request' },
  { id: 'patch-request', title: 'PATCH Request' },
  { id: 'delete-request', title: 'DELETE Request' },
  { id: 'filtering-sorting', title: 'Filtering & Sorting' },
  { id: 'rate-limits', title: 'Rate Limits' },
  { id: 'schema-changes', title: 'Schema Changes' },
  { id: 'error-codes', title: 'Error Codes' },
];

const CodeBlock = ({ code, language = 'javascript' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#1a1a1a] rounded-2xl overflow-hidden my-6">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <Copy className="w-4 h-4" />
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="text-sm text-gray-100 p-6 overflow-x-auto pt-12">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const InfoBox = ({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' }) => {
  const bgColor = type === 'warning' ? 'bg-red-50 border-red-200' : type === 'success' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200';
  const textColor = type === 'warning' ? 'text-red-800' : type === 'success' ? 'text-green-800' : 'text-blue-800';
  const iconColor = type === 'warning' ? 'text-red-600' : type === 'success' ? 'text-green-600' : 'text-blue-600';
  const Icon = type === 'warning' ? AlertTriangle : type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`border rounded-2xl p-4 my-6 flex gap-3 ${bgColor}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <div className={`text-sm ${textColor}`}>{children}</div>
    </div>
  );
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const renderSection = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">Getting Started</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Welcome to NotiRest. This guide will get you from zero to a working API endpoint in under 5 minutes.
            </p>

            <div className="space-y-8">
              {[
                { step: 1, title: 'Create your account', desc: 'Sign up at notirest.io and verify your email address.' },
                { step: 2, title: 'Connect your Notion database', desc: 'Go to your Notion workspace. Open the database you want to expose as an API. Click the ••• menu in the top right corner. Click Add connections and search for NotiRest. Click Confirm to grant access.' },
                { step: 3, title: 'Create your endpoint', desc: 'In your NotiRest dashboard, go to Endpoints and click New Connection. Paste your Notion Database ID (found in the database URL) and give your endpoint a label.' },
                { step: 4, title: 'Generate an API key', desc: 'Go to API Keys and click Generate Key. Label it (e.g. Production) and save it somewhere safe. You will only see it once.' },
                { step: 5, title: 'Make your first API call', desc: 'That\'s it. You now have a working REST API powered by your Notion database.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-lg">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-12">First API Call</h3>
            <CodeBlock code={`fetch('https://notirest.io/api/your-endpoint', {
  headers: {
    'x-api-key': 'nrest_your_api_key_here'
  }
})
.then(res => res.json())
.then(data => console.log(data))`} />
          </div>
        );

      case 'authentication':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">Authentication</h1>
            <p className="text-xl text-muted-foreground mb-12">
              NotiRest uses API keys to authenticate requests. Include your API key in every request using the x-api-key header.
            </p>

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Correct Way</h3>
            <CodeBlock code={`// Correct way
fetch('https://notirest.io/api/your-endpoint', {
  headers: {
    'x-api-key': 'nrest_your_api_key_here'
  }
})

// Wrong — never do this in frontend code
const key = 'nrest_your_key' // exposed!`} />

            <InfoBox type="warning">
              <strong>Never expose your API key</strong> in frontend JavaScript, GitHub repos, or public code. Treat it like a password.
            </InfoBox>

            <h3 className="text-2xl font-bold text-foreground mb-3 mt-8">Where to find your API key</h3>
            <p className="text-muted-foreground text-lg mb-6">Go to Dashboard → API Keys → Copy your key</p>

            <h3 className="text-2xl font-bold text-foreground mb-3 mt-8">If your key is compromised</h3>
            <p className="text-muted-foreground text-lg">Go to Dashboard → API Keys → Delete the compromised key → Generate a new one immediately</p>
          </div>
        );

      case 'endpoints':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">Endpoints</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Every Notion database you connect gets its own unique endpoint URL.
            </p>

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Endpoint Format</h3>
            <CodeBlock code={`https://notirest.io/api/[your-slug]`} />

            <p className="text-muted-foreground text-lg mb-6">
              Your slug is chosen when you create the connection. For example, if you connect your Products database with slug my-products, your endpoint is:
            </p>
            <CodeBlock code={`https://notirest.io/api/my-products`} />

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Supported HTTP Methods</h3>
            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border border-border rounded-2xl overflow-hidden">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left px-6 py-4 font-bold">Method</th>
                    <th className="text-left px-6 py-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[['GET', 'Fetch all rows'], ['POST', 'Create a new row'], ['PATCH', 'Update an existing row'], ['DELETE', 'Delete a row']].map(([method, action]) => (
                    <tr key={method} className="border-b border-border hover:bg-secondary/50">
                      <td className="px-6 py-4 font-mono text-primary font-semibold">{method}</td>
                      <td className="px-6 py-4">{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground text-lg">All requests must include the x-api-key header.</p>
          </div>
        );

      case 'get-request':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">GET Request</h1>
            <p className="text-xl text-muted-foreground mb-12">Fetch rows from your Notion database</p>

            <h3 className="text-2xl font-bold text-foreground mb-4">Basic Request</h3>
            <CodeBlock code={`fetch('https://notirest.io/api/my-products', {
  headers: {
    'x-api-key': 'nrest_your_key'
  }
})`} />

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Response Format</h3>
            <CodeBlock code={`{
  "results": [
    {
      "id": "abc123",
      "Name": "Product One",
      "Price": 29,
      "Category": "Electronics",
      "InStock": true
    }
  ],
  "count": 2,
  "page": 1,
  "hasMore": false
}`} />

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Query Parameters</h3>
            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border border-border rounded-2xl overflow-hidden">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left px-6 py-4 font-bold">Param</th>
                    <th className="text-left px-6 py-4 font-bold">Type</th>
                    <th className="text-left px-6 py-4 font-bold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[['limit', 'number', 'Results per page (default: 100, max: 500)'], ['page', 'number', 'Page number for pagination (default: 1)'], ['filter', 'string', 'Filter by column value (col:value)'], ['sort', 'string', 'Sort by column (col:asc or col:desc)']].map(([param, type, desc]) => (
                    <tr key={param} className="border-b border-border hover:bg-secondary/50">
                      <td className="px-6 py-4 font-mono text-primary font-semibold">{param}</td>
                      <td className="px-6 py-4">{type}</td>
                      <td className="px-6 py-4">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Examples</h3>
            <CodeBlock code={`// Get first 10 products, sorted by price
fetch('https://notirest.io/api/my-products?limit=10&sort=Price:asc', {
  headers: { 'x-api-key': 'nrest_your_key' }
})

// Filter by category
fetch('https://notirest.io/api/my-products?filter=Category:Electronics', {
  headers: { 'x-api-key': 'nrest_your_key' }
})`} />
          </div>
        );

      case 'post-request':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">POST Request</h1>
            <p className="text-xl text-muted-foreground mb-12">Create a new row in your Notion database</p>

            <p className="text-muted-foreground text-lg mb-6">Send a POST request with a JSON body. Use your Notion column names as keys.</p>

            <CodeBlock code={`fetch('https://notirest.io/api/my-products', {
  method: 'POST',
  headers: {
    'x-api-key': 'nrest_your_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Name: 'New Product',
    Price: 99,
    Category: 'Electronics',
    InStock: true
  })
})`} />

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Response</h3>
            <CodeBlock code={`{\n  "id": "new_page_id_from_notion",\n  "success": true\n}`} />

            <InfoBox type="info">
              Column names are case sensitive. Use the exact column names from your Notion database.
            </InfoBox>
          </div>
        );

      case 'patch-request':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">PATCH Request</h1>
            <p className="text-xl text-muted-foreground mb-12">Update an existing row</p>

            <p className="text-muted-foreground text-lg mb-6">Pass the Notion page ID as a query parameter and send only the fields you want to update.</p>

            <CodeBlock code={`fetch('https://notirest.io/api/my-products?id=abc123', {
  method: 'PATCH',
  headers: {
    'x-api-key': 'nrest_your_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Price: 79,
    InStock: false
  })
})`} />

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Response</h3>
            <CodeBlock code={`{\n  "id": "abc123",\n  "success": true\n}`} />

            <InfoBox type="info">
              Only include the fields you want to update. Other fields will remain unchanged.
            </InfoBox>
          </div>
        );

      case 'delete-request':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">DELETE Request</h1>
            <p className="text-xl text-muted-foreground mb-12">Delete a row from your database</p>

            <CodeBlock code={`fetch('https://notirest.io/api/my-products?id=abc123', {
  method: 'DELETE',
  headers: {
    'x-api-key': 'nrest_your_key'
  }
})`} />

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Response</h3>
            <CodeBlock code={`{\n  "success": true\n}`} />

            <InfoBox type="warning">
              This action is permanent and cannot be undone. The row will be archived in Notion.
            </InfoBox>
          </div>
        );

      case 'filtering-sorting':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">Filtering & Sorting</h1>

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Filtering</h3>
            <p className="text-muted-foreground text-lg mb-4">Use the filter param to filter results by column value.</p>
            <CodeBlock code={`// Single filter
?filter=Category:Electronics

// Filter with spaces (use %20)
?filter=Category:Home%20Decor

// Filter by boolean
?filter=InStock:true`} />

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Sorting</h3>
            <CodeBlock code={`// Sort ascending
?sort=Price:asc

// Sort descending  
?sort=Price:desc

// Sort by name
?sort=Name:asc`} />

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Combining Parameters</h3>
            <CodeBlock code={`// Filter Electronics, sort by price, get first 5 results\n?filter=Category:Electronics&sort=Price:asc&limit=5`} />
          </div>
        );

      case 'rate-limits':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">Rate Limits</h1>

            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border border-border rounded-2xl overflow-hidden">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left px-6 py-4 font-bold">Plan</th>
                    <th className="text-left px-6 py-4 font-bold">Monthly Calls</th>
                    <th className="text-left px-6 py-4 font-bold">Per Minute</th>
                  </tr>
                </thead>
                <tbody>
                  {[['Free', '1,000', '10'], ['Pro', '50,000', '100'], ['Agency', '500,000', '500']].map(([plan, monthly, perMinute]) => (
                    <tr key={plan} className="border-b border-border hover:bg-secondary/50">
                      <td className="px-6 py-4 font-bold">{plan}</td>
                      <td className="px-6 py-4">{monthly}</td>
                      <td className="px-6 py-4">{perMinute}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground text-lg mb-6">
              When you exceed the per-minute limit you get a 429 response. When you exceed your monthly limit you must upgrade your plan.
            </p>

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Rate Limit Headers</h3>
            <CodeBlock code={`X-RateLimit-Limit: 100\nX-RateLimit-Remaining: 87\nX-RateLimit-Reset: 1714060800`} />

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">429 Response</h3>
            <CodeBlock code={`{\n  "error": "Rate limit exceeded",\n  "message": "Monthly API limit reached. Please upgrade your plan.",\n  "code": 429\n}`} />
          </div>
        );

      case 'schema-changes':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">Schema Changes</h1>
            <p className="text-xl text-muted-foreground mb-12">How NotiRest handles Notion database structure changes</p>

            <p className="text-muted-foreground text-lg mb-6">
              If you rename, delete, or add columns in your Notion database, NotiRest detects this automatically.
            </p>

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">What Happens</h3>
            <ol className="space-y-3 text-muted-foreground text-lg list-decimal list-inside mb-6">
              <li>NotiRest detects the schema change</li>
              <li>You receive an email alert immediately</li>
              <li>Your existing endpoint continues working with fallback values</li>
              <li>Missing fields return null instead of breaking your app</li>
            </ol>

            <InfoBox type="success">
              Pro and Agency plans get instant email alerts for schema changes. Free plan does not include alerts.
            </InfoBox>

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Example</h3>
            <CodeBlock code={`// Your Notion column 'ProductName' was renamed to 'Title'

// Before change - worked fine
{ "id": "abc", "ProductName": "Shoes" }

// After change - safe fallback
{ "id": "abc", "ProductName": null, "Title": "Shoes" }

// Your app doesn't break. You just get an email telling you what changed.`} />
          </div>
        );

      case 'error-codes':
        return (
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">Error Codes</h1>

            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border border-border rounded-2xl overflow-hidden">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left px-6 py-4 font-bold">Code</th>
                    <th className="text-left px-6 py-4 font-bold">Meaning</th>
                    <th className="text-left px-6 py-4 font-bold">Fix</th>
                  </tr>
                </thead>
                <tbody>
                  {[['400', 'Bad request', 'Check your request body format'], ['401', 'Unauthorized', 'Check your API key is correct'], ['403', 'Forbidden', 'Your plan doesn\'t support this feature'], ['404', 'Endpoint not found', 'Check your endpoint slug'], ['429', 'Rate limit exceeded', 'Upgrade plan or wait for reset'], ['500', 'Server error', 'Contact support']].map(([code, meaning, fix]) => (
                    <tr key={code} className="border-b border-border hover:bg-secondary/50">
                      <td className="px-6 py-4 font-mono text-primary font-bold">{code}</td>
                      <td className="px-6 py-4">{meaning}</td>
                      <td className="px-6 py-4">{fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Error Response Format</h3>
            <CodeBlock code={`{\n  "error": "Error type",\n  "message": "Human readable description",\n  "code": 401\n}`} />

            <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">Common Fixes</h3>
            <div className="space-y-6">
              <div>
                <p className="font-bold text-foreground text-lg mb-3">API key not working?</p>
                <ul className="space-y-2 text-muted-foreground text-lg list-disc list-inside">
                  <li>Make sure you're using x-api-key header</li>
                  <li>Check for spaces before/after the key</li>
                  <li>Generate a new key if needed</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-foreground text-lg mb-3">Endpoint returning empty results?</p>
                <ul className="space-y-2 text-muted-foreground text-lg list-disc list-inside">
                  <li>Check your Notion database has rows</li>
                  <li>Make sure you shared the DB with NotiRest</li>
                  <li>Verify the database ID is correct</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-20">
        {/* Sidebar */}
        <div className="fixed left-0 top-20 h-[calc(100vh-80px)] w-64 bg-card border-r border-border overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Documentation</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1">
          <div className="max-w-4xl mx-auto px-12 py-16">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
