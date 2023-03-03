import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Navbar from "../components/Navbar";
import gql from "graphql-tag";
import { FETCH_USERS_QUERY } from "../util/graphql";
import { Link } from "react-router-dom";
function Search() {
  const { loading, data } = useQuery(FETCH_USERS_QUERY);
  var users = [];
  if (!loading) {
    users = data.getUsers;
  }

  return (
    <div>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div>

          <ul>
            {users.map((user) => (
              
              <div key={user.id} ><Link className="user-search-widget" to={`/users/${user.username}`}>{user.username}</Link></div>
              
            ))}
          </ul>
        </div>
      )}
      <Navbar />
    </div>
  );
}
/*
const SEARCH_USER = gql`
  query searchUser($username: String!) {
    searchUser(username: $username) {
      id
      username
      bio
    }
  }
`;*/

export default Search;
