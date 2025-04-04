import React, { useEffect, useState } from 'react'
import api from '../Api/Api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const fetchTeams = async () => {
    try {
      const response = await api.get("/teams");
      console.log("Full response:", response); // Debug the full response
      // Try either of these:
      setTeams(response.data.teams || response.data.owned_teams || []);
    }
    catch (error) {
      console.error("Error fetching teams:", error.response?.data || error.message);
    }
  }
  useEffect(() => {
    fetchTeams();
  }, []);


      return (
        <div>
<h2>Teams</h2>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>{team.id}</td>
                  <td>{team.name}</td>
                  <td>{team.members.join(", ")}</td>
                  <td>
                    {/* Add action buttons here */}
                    <button className="btn btn-primary">Edit</button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

export default Teams
