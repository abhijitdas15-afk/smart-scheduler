import React, { useState } from 'react'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Navigation items
  const navigation = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Faculty Management', id: 'faculty' },
    { name: 'Subject Management', id: 'subjects' },
    { name: 'Classrooms', id: 'classrooms' },
    { name: 'Schedule', id: 'schedule' },
  ];

  // Render current page content
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg shadow">
                <h3 className="font-medium text-blue-700">Total Faculty</h3>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow">
                <h3 className="font-medium text-green-700">Total Subjects</h3>
                <p className="text-2xl font-bold">42</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg shadow">
                <h3 className="font-medium text-purple-700">Total Classrooms</h3>
                <p className="text-2xl font-bold">18</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg shadow">
                <h3 className="font-medium text-amber-700">Total Classes</h3>
                <p className="text-2xl font-bold">56</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Upcoming Classes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500">No upcoming classes scheduled</p>
              </div>
            </div>
          </div>
        );
      case 'faculty':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Faculty Management</h2>
            <div className="flex justify-end mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add New Faculty
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500">No faculty members added yet</p>
            </div>
          </div>
        );
      case 'subjects':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Subject Management</h2>
            <div className="flex justify-end mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add New Subject
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500">No subjects added yet</p>
            </div>
          </div>
        );
      case 'classrooms':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Classroom Management</h2>
            <div className="flex justify-end mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add New Classroom
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500">No classrooms added yet</p>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Schedule Management</h2>
            <div className="flex justify-end mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Generate Schedule
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500">No schedule generated yet</p>
            </div>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-xl font-bold">Smart Scheduler</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.id}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === item.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <button
                key={item.id}
                className={`block px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
                  currentPage === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {navigation.find(item => item.id === currentPage)?.name || 'Smart Scheduler'}
          </h1>
          <p className="text-gray-600 text-sm">Intelligent class scheduling system for colleges</p>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default App 