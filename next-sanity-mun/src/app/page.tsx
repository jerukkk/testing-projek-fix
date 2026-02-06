import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Model United Nations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Empowering students through diplomatic simulation and international relations education
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/articles"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Latest News
            </Link>
            <Link
              href="/events"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Upcoming Events
            </Link>
            <Link
              href="/members"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Our Team
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Educational Programs</h3>
                <p className="text-gray-600">
                  Comprehensive programs designed to enhance your understanding of international relations and diplomacy.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-green-600">Simulations</h3>
                <p className="text-gray-600">
                  Realistic Model UN conferences that provide hands-on experience in diplomatic negotiations.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-purple-600">Networking</h3>
                <p className="text-gray-600">
                  Connect with fellow students and professionals passionate about global affairs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Our Organization</h2>
            <p className="text-lg text-gray-600 mb-6">
              Our Model United Nations organization brings together students from around the world to simulate
              the debates and decision-making processes of the actual United Nations. Through these simulations,
              participants develop critical thinking, public speaking, and negotiation skills while learning about
              international relations and global issues.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link
                href="/about"
                className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
              >
                Learn More About Us
              </Link>
              <Link
                href="/contact"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 bg-blue-50 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join Our Community?</h2>
            <p className="text-gray-600 mb-6">
              Become part of a global network of students passionate about diplomacy and international relations.
            </p>
            <Link
              href="/membership"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
            >
              Become a Member
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
