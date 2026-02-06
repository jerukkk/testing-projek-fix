import Link from 'next/link';

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Become a Member</h1>
        
        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Join Our Community</h2>
          <p className="text-gray-700 mb-6">
            As a member of our Model United Nations organization, you'll gain access to exclusive resources, 
            networking opportunities, and priority registration for our events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/contact" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 text-center"
            >
              Apply Now
            </Link>
            <Link 
              href="/about" 
              className="flex-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition duration-300 text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">Student Membership</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Access to educational resources</li>
              <li>Priority event registration</li>
              <li>Networking opportunities</li>
              <li>Discounted conference fees</li>
            </ul>
            <p className="mt-4 font-medium text-gray-800">$25/year</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Educator Membership</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Teaching resources and guides</li>
              <li>Professional development</li>
              <li>Conference organizing support</li>
              <li>Student mentorship programs</li>
            </ul>
            <p className="mt-4 font-medium text-gray-800">$50/year</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-purple-600">Professional Membership</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Exclusive networking events</li>
              <li>Career development resources</li>
              <li>Mentoring opportunities</li>
              <li>Industry insights and reports</li>
            </ul>
            <p className="mt-4 font-medium text-gray-800">$75/year</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Benefits of Membership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Educational Resources</h3>
              <p className="text-gray-600">
                Access to our extensive library of Model UN guides, position papers, and research materials.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Networking Opportunities</h3>
              <p className="text-gray-600">
                Connect with fellow students, educators, and professionals in the field of international relations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Event Discounts</h3>
              <p className="text-gray-600">
                Receive discounts on conference fees and exclusive member-only events.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Career Development</h3>
              <p className="text-gray-600">
                Access to career resources, internship opportunities, and professional guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}