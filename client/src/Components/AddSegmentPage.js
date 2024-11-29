import React,{useState, useEffect} from 'react'
import { useNavigate,useParams } from 'react-router-dom';

export default function AddSegmentPage() {
    const [activeTab, setActiveTab] = useState('airbnb');
    const [items, setItems] = useState([]);
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();
    const {id} = useParams();
  
    // const fetchItems = async () => {
    //   const fetchFunction = activeTab === 'airbnb' 
    //     ? ApiService.getAirbnbs 
    //     : ApiService.getFlights;
    //   const fetchedItems = await fetchFunction(filters);
    //   setItems(fetchedItems);
    // };
  
    useEffect(() => {
    //   fetchItems();
    }, [activeTab, filters]);
  
    const handleFilterChange = (e) => {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value
      });
    };
  
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Segment to Plan</h2>
          <button 
            onClick={()=>navigate(`/plans/${id}`)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Back to Plan
          </button>
        </div>
        
        <div className="mb-4 flex">
          <button 
            className={`px-4 py-2 mr-2 rounded ${activeTab === 'airbnb' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('airbnb')}
          >
            Accommodation
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'flight' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('flight')}
          >
            Flights
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Filters</h3>
            <div className="space-y-2">
              <div>
                <label className="block mb-1">Price Range</label>
                <input 
                  type="number" 
                  name="minPrice" 
                  placeholder="Min Price"
                  className="w-full border rounded px-2 py-1"
                  onChange={handleFilterChange}
                />
                <input 
                  type="number" 
                  name="maxPrice" 
                  placeholder="Max Price"
                  className="w-full border rounded px-2 py-1 mt-2"
                  onChange={handleFilterChange}
                />
              </div>
              {activeTab === 'airbnb' && (
                <div>
                  <label className="block mb-1">Location</label>
                  <input 
                    name="location" 
                    placeholder="Enter location"
                    className="w-full border rounded px-2 py-1"
                    onChange={handleFilterChange}
                  />
                </div>
              )}
              {activeTab === 'flight' && (
                <div>
                  <label className="block mb-1">From</label>
                  <input 
                    name="from" 
                    placeholder="Departure"
                    className="w-full border rounded px-2 py-1 mb-2"
                    onChange={handleFilterChange}
                  />
                  <label className="block mb-1">To</label>
                  <input 
                    name="to" 
                    placeholder="Departure"
                    className="w-full border rounded px-2 py-1"
                    onChange={handleFilterChange}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === 'airbnb' ? 'Accommodations' : 'Flights'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-white border rounded p-4 shadow">
                  <h4 className="font-semibold">{item.name || `${item.airline} Flight`}</h4>
                  <p>Price: ${item.price}</p>
                  <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
                    Add to Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}
