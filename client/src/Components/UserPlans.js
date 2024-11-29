import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UserPlans() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', description: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    fetch(`http://localhost:3001/users/${id}/plans`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Plans fetched successfully') {
          setPlans(data.data); // Store the fetched plans in state
        }
      })
      .catch((error) => {
        console.error('Error fetching plans:', error);
      });
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewPlan({ name: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePlan = () => {
    // Prepare the payload for the API request
    const payload = {
      plan_name: newPlan.name,
      user_id: Number(id),
      plan_description: newPlan.description,
    };
  
    // Make a POST request to the API to create the plan
    fetch('http://localhost:3001/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Plan created successfully') {
          const newPlanData = {
            plan_id: data.data.plan_id, // Use the ID returned by the API
            plan_name: newPlan.name,
            plan_description: newPlan.description,
          };
  
          // Update the state with the new plan
          setPlans((prevPlans) => [...prevPlans, newPlanData]);
          closeModal(); // Close the modal
          console.log('New Plan Created:', newPlanData);
        } else {
          console.error('Error creating plan:', data);
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  };  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Travel Plans</h2>
      <div className="grid gap-4">
        {plans.map((plan) => (
          <div
            key={plan.plan_id}
            className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/plans/${plan.plan_id}`)}
          >
            <h3 className="text-xl font-semibold">{plan.plan_name}</h3>
            <p className="text-gray-600">{plan.plan_description}</p>
          </div>
        ))}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={openModal}
        >
          Create New Plan
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {/* Modal Content */}
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-1 right-3 text-gray-1000 hover:text-gray-800 text-2xl font-bold p-2"
              onClick={closeModal}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Create a New Plan</h3>
            <form className="space-y-4">
              <div>
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="name"
                >
                  Plan Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={newPlan.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter plan name"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newPlan.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter plan description"
                />
              </div>
              <button
                type="button"
                onClick={handleCreatePlan}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create Plan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
