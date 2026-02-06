export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">About Our Organization</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our Model United Nations organization is dedicated to fostering diplomacy, international understanding, 
              and leadership among students worldwide. We provide platforms for young people to engage in meaningful 
              discussions about global issues, develop critical thinking skills, and practice negotiation and debate.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our History</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded with the vision of creating a space where students could explore international relations and 
              diplomacy, our organization has grown to become a leading platform for Model UN activities. Over the years, 
              we have hosted numerous conferences, workshops, and educational programs that have impacted thousands of students.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Values</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Promoting international understanding and cooperation</li>
              <li>Developing leadership and communication skills</li>
              <li>Encouraging critical thinking and analytical skills</li>
              <li>Fostering respect for diverse perspectives and cultures</li>
              <li>Advancing education in international relations and diplomacy</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Impact</h2>
            <p className="text-gray-600 leading-relaxed">
              Since our inception, we have engaged thousands of students from various backgrounds, helping them develop 
              essential skills for their academic and professional futures. Our alumni have gone on to pursue careers in 
              diplomacy, international relations, law, journalism, and many other fields where the skills learned through 
              Model UN prove invaluable.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}