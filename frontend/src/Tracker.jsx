import React, { useState, useEffect } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function Tracker() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const navigate = useNavigate();

  // Fetch jobs
  useEffect(() => {
    fetch("http://127.0.0.1:8001/jobs/")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  // Delete job
  const handelDeleteJob = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    const res = await fetch(`http://127.0.0.1:8001/jobs/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setJobs(jobs.filter((job) => job.id !== id));
    } else {
      alert("Failed to delete the job");
    }
  };

  // Count Rejections
    const rejectedCount = jobs.filter(job => job.status === "Rejected").length;

 // Job Application Success Rate
    const successRate = jobs.length > 0 ? Math.round(((jobs.length - rejectedCount) / jobs.length) * 100) : 0;

  // Add job
  const handleAddJob = async (e) => {
    e.preventDefault();

    if (!company || !position || !status) {
      alert("Please fill in all fields");
      return;
    }

    const newJob = { company, position, status };

    const res = await fetch("http://127.0.0.1:8001/jobs/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });

    if (res.ok) {
      const savedJob = await res.json();
      setJobs([...jobs, savedJob]);
      setCompany("");
      setPosition("");
      setStatus("Applied");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
           {/* Sidebar */}
           <aside className="w-64 bg-white shadow-lg p-6">
             <h2 className="text-2xl font-bold text-blue-600">Job Tracker</h2>
             <nav className="mt-20">
               <ul className="space-y-30">
                 <li>
                   <button
                     className="block w-full text-left p-2 transiton-all duration-300 font-semibold cursor-pointer flex items-center text-blue-500"
                     onClick={() => navigate('/')}
                   >
                    <span className='mr-2 text-blue-500'><MdSpaceDashboard size={18}/></span> Dashboard
                   </button>
                 </li>
                 <li>
                   <button
                     className="block w-full text-left p-2 transition-all duration-300 hover:scale-105 hover:font-semibold cursor-pointer flex items-center text-stone-500 "
                     onClick={() => navigate('/jobs')}
                   >
                    <span className='mr-2 text-stone-400'><FaSearch size={16} /></span> Job Search
                   </button>
                 </li>
               </ul>
             </nav>
           </aside>
     
      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center"><span className="mr-2 text-blue-500"><MdSpaceDashboard size={28}/></span>Dashboard</h1>
          <p className="text-gray-500">Track your job applications</p>
        </header>

        {/* Add Job Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add a Job</h2>
          <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border p-2 w-full border-stone-300 rounded-lg focus:outline-none focus:ring-none focus:border-stone-500"
            />
            <input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border p-2 w-full border-stone-300 rounded-lg focus:outline-none focus:ring-none focus:border-stone-500"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded p-2 w-full border-stone-300 focus:outline-none focus:ring-none focus:border-stone-500"
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded p-2 hover:bg-blue-900 transition-all duration-300 cursor-pointer"
            >
              Add Job
            </button>
          </form>
        </div>
        {/* Job Stats */}
        <div className="flex flex-row justify-center mb-4 gap-30">
                <div className="bg-white w-[300px] h-[200px] rounded-sm ">
                 <h1 className="text-stone-400 mt-5 p-2 font-semibold">Total Applications:</h1>
                    <h1 className="text-black text-[60px] p-2 font-bold flex justify-center">{jobs.length}</h1>
                </div>
                <div className="bg-white w-[300px] h-[200px] rounded-sm">
                  <h1 className="text-stone-400 mt-5 p-2 font-semibold">Rejections:</h1>
                  <h1 className="text-black text-[60px] p-2 font-bold flex justify-center">{rejectedCount}</h1>
                </div>
                <div className="bg-white w-[300px] h-[200px] rounded-sm">
                  <h1 className="text-stone-400 mt-5 p-2 font-semibold">Success Rate:</h1>
                  <h1 className="text-black text-[60px] p-2 font-bold flex justify-center">{successRate}%</h1>
                </div>

        </div>
        {/* Jobs Table */}
        <div className=" p-6 mt-10">
          <h2 className="text-[30px] font-semibold mb-4">Current Applications</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white text-black">
                <th className=" p-2 text-left border-stone-300">Company</th>
                <th className=" p-2 text-left border-stone-300">Position</th>
                <th className=" p-2 text-left border-stone-300">Status</th>
              </tr>
            </thead>
             
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="transition-all duration-300 hover:bg-blue-100">
                    <td className=" p-2 ">{job.company}</td>
                    <td className=" p-2 ">{job.position}</td>
                    <td className=" p-2 flex justify-between items-center">
                      <select
                        value={job.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const res = await fetch(`http://127.0.0.1:8001/jobs/${job.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              company: job.company,
                              position: job.position,
                              status: newStatus,
                            }),
                          });
                          if (res.ok) {
                            const updatedJob = await res.json();
                            setJobs(jobs.map((j) => (j.id === job.id ? updatedJob : j)));
                          } else {
                            alert("Failed to update status");
                          }
                        }}
                        className="border-none rounded p-1 cursor-pointer"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <button
                        onClick={() => handelDeleteJob(job.id)}
                        className="text-stone-400 hover:text-blue-500 transition-all duration-300 hover:scale-110"
                      >
                        <FaRegTrashCan />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No jobs yet. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </main>
      
    </div>
  );
}

export default Tracker;
