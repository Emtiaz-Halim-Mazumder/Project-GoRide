import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-10 text-center">
        <h1 className="text-5xl font-extrabold text-green-600 mb-6">GoRide</h1>
        <p className="text-xl text-gray-600 mb-10">
          A smart carpool matcher for students. Share rides, save costs, and manage your schedule effortlessly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/OfferRide" className="block p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Offer a Ride</h2>
            <p className="text-gray-600">Post a new ride and share your commute with others.</p>
          </Link>
          
          <Link href="/ClassSchedule" className="block p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Class Schedule</h2>
            <p className="text-gray-600">Manage your weekly schedule and toggle auto-ride offers.</p>
          </Link>
        </div>
        
        <div className="mt-12 text-gray-500 text-sm">
          Built with ❤️ for students.
        </div>
      </div>
    </div>
  );
}
