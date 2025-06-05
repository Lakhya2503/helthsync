import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Calendar, Clock, User, AlertCircle, Filter, Plus, PawPrint, ChevronDown } from 'lucide-react';
import auth from '../../supabase/auth';
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
  const user = useSelector((state) => state.auth.user);
  const [patients, setPatients] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [patientType, setPatientType] = useState('all');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        
        // Fetch human patients
        let humanQuery = auth.supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false });

        // Fetch pet patients
        let petQuery = auth.supabase
          .from('pets')
          .select('*')
          .order('created_at', { ascending: false });

        // Apply filters
        if (filter === 'recent') {
          humanQuery = humanQuery.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
          petQuery = petQuery.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
        } else if (filter === 'critical') {
          humanQuery = humanQuery.or('disease_type.eq.Cardiovascular,disease_type.eq.Diabetes,disease_type.eq.Hypertension');
          petQuery = petQuery.or('condition.eq.Emergency,condition.eq.Surgery,condition.eq.Critical');
        }

        const [
          { data: humanData, error: humanError },
          { data: petData, error: petError }
        ] = await Promise.all([humanQuery, petQuery]);

        if (humanError || petError) throw humanError || petError;

        setPatients(humanData || []);
        setPets(petData || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch patients');
        console.error('Patient fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user, filter]);

  const filteredData = [...patients, ...pets].filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const isHuman = item.hasOwnProperty('disease_type');
    
    return (
      (patientType === 'all' || 
       (patientType === 'human' && isHuman) || 
       (patientType === 'pet' && !isHuman)) &&
      (item.name.toLowerCase().includes(searchLower) ||
      (item.unique_id && item.unique_id.toLowerCase().includes(searchLower)) ||
      (isHuman ? 
        (item.disease_type && item.disease_type.toLowerCase().includes(searchLower)) :
        (item.condition && item.condition.toLowerCase().includes(searchLower))) ||
      (item.phone && item.phone.includes(searchTerm)) ||
      (item.email && item.email.toLowerCase().includes(searchLower)))
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid date';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'chronic': return 'bg-yellow-100 text-yellow-800';
      case 'recovered': return 'bg-blue-100 text-blue-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddPatient = () => {
    navigate('/dashboard/patients/new');
    setShowAddMenu(false);
  };

  const handleAddPet = () => {
    navigate('/dashboard/pets/new');
    setShowAddMenu(false);
  };

  const handlePatientClick = (id, isPet = false) => {
    navigate(isPet ? `/dashboard/pets/${id}` : `/dashboard/patients/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007E85]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg flex items-start text-red-600">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
        <div>
          <h3 className="font-medium">Error loading patients</h3>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Patient Records</h2>
          <p className="text-sm text-gray-500">
            Showing {filteredData.length} of {patients.length + pets.length} records
          </p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85] bg-white text-sm"
              value={patientType}
              onChange={(e) => setPatientType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="human">Human Patients</option>
              <option value="pet">Pet Patients</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85] bg-white text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Patients</option>
              <option value="recent">Recent (Last 7 Days)</option>
              <option value="critical">Critical Conditions</option>
            </select>
            
            <div className="relative">
              <button 
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm w-full sm:w-auto"
                onClick={() => setShowAddMenu(!showAddMenu)}
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Add</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              
              {showAddMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={handleAddPatient}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Human Patient
                    </button>
                    <button
                      onClick={handleAddPet}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Pet Patient
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patient List */}
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="hidden md:table min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => {
                const isPet = !item.hasOwnProperty('disease_type');
                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handlePatientClick(item.id, isPet)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.unique_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${
                          isPet ? 'bg-amber-500' : 'bg-[#007E85]'
                        }`}>
                          {isPet ? <PawPrint className="h-5 w-5" /> : getInitials(item.name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            {isPet ? 
                              `${item.species || 'Unknown'}, ${item.breed || ''}` : 
                              `${item.gender || 'Unknown'}${item.age ? `, ${item.age} yrs` : ''}`
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                        isPet ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isPet ? 'Pet' : 'Human'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {isPet ? item.condition : item.disease_type || 'Not specified'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {isPet ? item.symptoms : item.symptoms || 'No symptoms recorded'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isPet ? (
                        <div>
                          <div>{item.owner_name || 'No owner'}</div>
                          <div className="text-gray-400 truncate max-w-xs">{item.owner_phone || 'No phone'}</div>
                        </div>
                      ) : (
                        <div>
                          <div>{item.phone || 'No phone'}</div>
                          <div className="text-gray-400 truncate max-w-xs">{item.email || 'No email'}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(item.last_visit)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredData.map((item) => {
              const isPet = !item.hasOwnProperty('disease_type');
              return (
                <div 
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handlePatientClick(item.id, isPet)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white font-medium ${
                      isPet ? 'bg-amber-500' : 'bg-[#007E85]'
                    }`}>
                      {isPet ? <PawPrint className="h-5 w-5" /> : getInitials(item.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {isPet ? 
                              `${item.species || 'Unknown'}, ${item.breed || ''}` : 
                              `${item.gender || 'Unknown'}${item.age ? `, ${item.age} yrs` : ''}`
                            }
                          </p>
                        </div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                          isPet ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isPet ? 'Pet' : 'Human'}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <div className="text-sm font-medium text-gray-900">
                          {isPet ? item.condition : item.disease_type || 'Not specified'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {isPet ? item.symptoms : item.symptoms || 'No symptoms recorded'}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status || 'Unknown'}
                        </span>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {formatDate(item.last_visit)}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        {isPet ? (
                          <div>
                            <div>Owner: {item.owner_name || 'No owner'}</div>
                            <div className="text-gray-400">{item.owner_phone || 'No phone'}</div>
                          </div>
                        ) : (
                          <div>
                            <div>Phone: {item.phone || 'No phone'}</div>
                            <div className="text-gray-400">{item.email || 'No email'}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No patients found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try adjusting your search or filter' : 'No patient records available'}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
            <button
              onClick={handleAddPatient}
              className="px-4 py-2 bg-[#007E85] text-white rounded-lg hover:bg-[#005f66] flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Human Patient</span>
            </button>
            <button
              onClick={handleAddPet}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center justify-center gap-2"
            >
              <PawPrint className="h-4 w-4" />
              <span>Add Pet Patient</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;