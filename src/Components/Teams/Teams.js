import React, { useEffect, useState } from 'react';
import api from '../Api/Api';
import Select from 'react-select';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    is_public: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [error, setError] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    email: '',
    role: 'member'
  });
  const [memberError, setMemberError] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/user");
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Failed to fetch current user", error);
    }
  };

  // Fetch teams from API
  const fetchTeams = async () => {
    try {
      const response = await api.get("/teams");
      // If user is a member, filter teams they participate in
      if (currentUser?.role === 'member') {
        const userTeams = response.data.teams.filter(team => 
          team.members?.some(member => member.id === currentUser.id)
        );
        setTeams(userTeams);
      } else {
        setTeams(response.data.teams);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch team details for a specific team ID
  const fetchTeamDetails = async (teamId) => {
    try {
      const response = await api.get(`/teams/${teamId}`);
      setSelectedTeam(response.data.team);
      setError(null);
      setShowAddMember(false);
      setEditingMember(null);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('You are not authorized to view this team');
      } else {
        setError('Failed to load team details');
      }
      setSelectedTeam(null);
    }
  };

  // Fetch non-members of the selected team for adding new members
  const fetchNonMembers = async (search = '') => {
    if (!selectedTeam) return;
    
    setIsLoadingUsers(true);
    try {
      const response = await api.get(`/teams/${selectedTeam.id}/non-members`, {
        params: { search }
      });
      const options = response.data.data.map(user => ({
        value: user.email,
        label: `${user.name} (${user.email})`,
        user
      }));
      setUserOptions(options);
    } catch (error) {
      console.error('Error loading non-members:', error);
      setUserOptions([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Fetch teams when currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchTeams();
    }
  }, [currentUser]);

  // Effect to fetch non-members when adding new members and when selected team changes
  useEffect(() => {
    if (showAddMember && selectedTeam) {
      fetchNonMembers();
    }
  }, [showAddMember, selectedTeam]);

  // Check if current user is team owner
  const isTeamOwner = (team) => {
    return team.owner_id === currentUser?.id;
  };

  // Check if current user is team admin
  const isTeamAdmin = (team) => {
    if (!team.members || !currentUser) return false;
    const member = team.members.find(m => m.id === currentUser.id);
    return member?.pivot?.role === 'admin';
  };

  // Check if current user can edit team
  const canEditTeam = (team) => {
    return currentUser?.role !== 'member' && (isTeamOwner(team) || isTeamAdmin(team));
  };

  // Check if current user can delete team
  const canDeleteTeam = (team) => {
    return currentUser?.role !== 'admin' && isTeamOwner(team);
  };

  // Check if current user can add members
  const canAddMembers = (team) => {
    return currentUser?.role !== 'member' && (isTeamOwner(team) || isTeamAdmin(team));
  };

  // Check if current user can edit members
  const canEditMembers = (team) => {
    return currentUser?.role !== 'member' && (isTeamOwner(team) || isTeamAdmin(team));
  };

  // Handle input change for new team form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTeam({
      ...newTeam,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle submission of new team or editing existing team
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await api.put(`/teams/${editingTeamId}`, newTeam);
        setTeams(teams.map(team => team.id === editingTeamId ? response.data.team : team));
      } else {
        const response = await api.post("/teams", newTeam);
        setTeams([...teams, response.data.team]);
      }

      setNewTeam({ name: '', description: '', is_public: false });
      setShowForm(false);
      setIsEditing(false);
      setEditingTeamId(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle deletion of a team
  const handleDeleteTeam = async (id) => {
    try {
      await api.delete(`/teams/${id}`);
      setTeams(teams.filter(team => team.id !== id));
      if (selectedTeam && selectedTeam.id === id) {
        setSelectedTeam(null);
      }
    } catch (error) {
      console.log("Failed to delete team", error);
    }
  };

  // Handle editing of a team
  const handleEditTeam = (team) => {
    setNewTeam({
      name: team.name,
      description: team.description,
      is_public: team.is_public
    });
    setIsEditing(true);
    setEditingTeamId(team.id);
    setShowForm(true);
  };

  // Close team details view
  const closeTeamDetails = () => {
    setSelectedTeam(null);
    setError(null);
    setShowAddMember(false);
    setEditingMember(null);
  };

  // Handle submission of new member addition to a team
  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!newMember.email) {
      setMemberError('Please select a user');
      return;
    }

    try {
      const response = await api.post(`/teams/${selectedTeam.id}/members`, newMember);
      setSelectedTeam(response.data.team);
      setNewMember({ email: '', role: 'member' });
      setMemberError(null);
      setShowAddMember(false);
    } catch (error) {
      if (error.response) {
        setMemberError(error.response.data.message || 'Failed to add member');
      } else {
        setMemberError('Network error occurred');
      }
    }
  };

  // Handle search for users when adding new members
  const handleUserSearch = (inputValue) => {
    fetchNonMembers(inputValue);
  };

  // Handle updating member role within a team
  const handleUpdateMemberRole = async (teamId, userId, newRole) => {
    try {
      await api.put(`/teams/${teamId}/members/${userId}/role`, { role: newRole });
  
      // Update the member role in the local selectedTeam state
      setSelectedTeam(prev => {
        if (!prev) return prev;
        const updatedMembers = prev.members.map(member =>
          member.id === userId
            ? { ...member, pivot: { ...member.pivot, role: newRole } }
            : member
        );
        return { ...prev, members: updatedMembers };
      });
  
      setEditingMember(null);
    } catch (error) {
      console.error('Failed to update member role:', error);
    }
  };

  // Handle removal of a member from a team
  const handleRemoveMember = async (teamId, userId) => {
    try {
      await api.delete(`/teams/${teamId}/members/${userId}`);
      fetchTeamDetails(teamId); // Refresh team details
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  // Start editing member role within a team
  const startEditingMember = (member) => {
    setEditingMember({
      id: member.id,
      currentRole: member.pivot.role
    });
  };

  // Cancel editing member role within a team
  const cancelEditingMember = () => {
    setEditingMember(null);
  };

  return (
    <div className="container">
      <h2>Teams</h2>

      {selectedTeam ? (
        <div className="team-details card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>{selectedTeam.name}</h3>
            <button className="btn btn-sm btn-outline-secondary" onClick={closeTeamDetails}>
              Close
            </button>
          </div>
          <div className="card-body">
            <p><strong>Description:</strong> {selectedTeam.description || 'No description'}</p>
            <p><strong>Owner:</strong> {selectedTeam.owner?.name || 'Unknown'}</p>
            <p><strong>Members:</strong> {selectedTeam.members?.length || 0}</p>
            
            <h4 className="mt-4">Members List</h4>
            <ul className="list-group mb-4">
              {selectedTeam.members?.length > 0 ? (
                selectedTeam.members.map(member => (
                  <li key={member.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      {member.name} ({member.email})
                    </div>
                    <div>
                      <span className="badge badge-secondary mr-2">
                        {member.pivot?.role}
                      </span>
                      {member.id !== selectedTeam.owner_id && canEditMembers(selectedTeam) && (
                        <>
                          {editingMember?.id === member.id ? (
                            <div className="d-flex align-items-center">
                              <select
                                className="form-control form-control-sm mr-2"
                                value={editingMember.currentRole}
                                onChange={(e) => setEditingMember({
                                  ...editingMember,
                                  currentRole: e.target.value
                                })}
                              >
                                <option value="member">Member</option>
                                {currentUser?.role !== 'admin' && <option value="admin">Admin</option>}
                              </select>
                              <button
                                className="btn btn-success btn-sm mr-2"
                                onClick={() => handleUpdateMemberRole(
                                  selectedTeam.id,
                                  member.id,
                                  editingMember.currentRole
                                )}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={cancelEditingMember}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                className="btn btn-sm btn-outline-primary mr-2"
                                onClick={() => startEditingMember(member)}
                                disabled={currentUser?.role === 'admin'}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveMember(selectedTeam.id, member.id)}
                                disabled={currentUser?.role === 'admin'}
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="list-group-item">No members</li>
              )}
            </ul>

            {canAddMembers(selectedTeam) && (
              <button
                className="btn btn-outline-success mb-3"
                onClick={() => setShowAddMember(!showAddMember)}
              >
                {showAddMember ? 'Cancel' : 'Add Member'}
              </button>
            )}

            {showAddMember && (
              <form onSubmit={handleAddMemberSubmit} className="mb-3">
                <div className="form-group">
                  <label>Select user</label>
                  <Select
                    options={userOptions}
                    isLoading={isLoadingUsers}
                    onInputChange={handleUserSearch}
                    onChange={(selectedOption) =>
                      setNewMember({ ...newMember, email: selectedOption?.value || '' })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-control"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  >
                    <option value="member">Member</option>
                    {currentUser?.role !== 'admin' && <option value="admin">Admin</option>}
                  </select>
                </div>
                {memberError && <p className="text-danger">{memberError}</p>}
                <button type="submit" className="btn btn-primary">Add Member</button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <>
          {currentUser?.role !== 'member' && (
            <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Create New Team'}
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-3">
              <div className="form-group">
                <label>Team Name</label>
                <input
                  type="text"
                  name="name"
                  value={newTeam.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newTeam.description}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <button type="submit" className="btn btn-success">
                {isEditing ? 'Update Team' : 'Create Team'}
              </button>
            </form>
          )}

          <div className="row">
            {teams.map(team => (
              <div key={team.id} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{team.name}</h5>
                    <p className="card-text">{team.description}</p>
                    <button
                      className="btn btn-sm btn-outline-primary mr-2"
                      onClick={() => fetchTeamDetails(team.id)}
                    >
                      View
                    </button>
                    {canEditTeam(team) && (
                      <button
                        className="btn btn-sm btn-outline-secondary mr-2"
                        onClick={() => handleEditTeam(team)}
                      >
                        Edit
                      </button>
                    )}
                    {canDeleteTeam(team) && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Teams;