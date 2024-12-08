import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

export default function UserPlanDetails() {
  const [plan, setPlan] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPlanDetails = () => {
    fetch(`http://localhost:3001/plans/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Plan Details fetched successfully') {
          console.log(data.data);
          setPlan(data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching plan details:', error);
        
      });
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

  const handleDeleteSegment = async (segment, event) => {
    event.stopPropagation(); // Prevent triggering the segment selection
    
    try {
      const response = await fetch(`http://localhost:3001/plans/${id}/segment/${segment.segment_id}`, {
        method: 'DELETE',
      });
      
      if (response.status === 204) {
        fetchPlanDetails();
        toast.success(`${segment.segment_type.charAt(0).toUpperCase() + segment.segment_type.slice(1)} deleted successfully`);
      } else {
        throw new Error('Failed to delete segment');
      }
    } catch (error) {
      console.error('Error deleting segment:', error);
      toast.error('Failed to delete segment');
    }
  };


  // Show a loading message while waiting for the plan details
  if (!plan) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{plan.plan_name}</h2>
        <button 
          onClick={() => navigate(`/users/${plan.user_id}/plans`)}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Back to Plans
        </button>
      </div>
      <p className="mb-4">{plan.plan_description}</p>

      <button 
        onClick={()=>navigate(`/plans/${id}/segments`)}
        // onClick={onAddSegment}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Segment
      </button>

      <div className="space-y-4">
  {plan.segments.map(segment => (
    <div 
      key={segment.segment_id} 
      className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-lg"
      onClick={() => setSelectedSegment(segment)}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">
            {segment.segment_type === 'airbnb' 
              ? `Airbnb` 
              : `Flight: ${segment.starting_airport} To ${segment.destination_airport}`}
          </p>
          {/* Common Fields */}
          {segment.segment_type === 'airbnb' && (
            <>
              <p className="text-sm text-gray-600">
                Dates: {segment.start_date} - {segment.end_date}
              </p>
              <p className="text-sm text-gray-600">
                Close to Airport: {segment.close_to_airport}
              </p>
              <p className="text-sm text-gray-600">
                Price: ${segment.price}
              </p>
            </>
          )}
          {segment.segment_type === 'flight' && (
            <>
              <p className="text-sm text-gray-600">
                Flight Date: {segment.flight_date}
              </p>
              {/* <p className="text-sm text-gray-600">
                From: {segment.starting_airport} To: {segment.destination_airport}
              </p> */}
              <p className="text-sm text-gray-600">
                Total Fare: ${segment.total_fare}
              </p>
            </>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            onClick={(e) => handleDeleteSegment(segment, e)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* {renderSegmentDetails()} */}
    </div>
  );
}
