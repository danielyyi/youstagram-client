import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/auth";
import ProfileHeaderbar from "../components/ProfileHeaderbar";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import {FETCH_POSTS_QUERY} from '../util/graphql'
import Post from "../components/Post";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const username = user.username
  const limit = 3;
  const {loading, data, refetch} = useQuery(GET_USER_POSTS, {
    variables: {
      username,
      limit
    },
    fetchPolicy: 'network-only', // Used for first execution
    nextFetchPolicy: 'cache-first',
  });
  var posts = [];
  if(!loading && data && data.getPostsByUser){
      data.getPostsByUser.forEach(element => {
        posts.push(element);
      });
      console.log(posts)
      console.log("pressed");
    }

  return (
    <div className="profile-page">
      <ProfileHeaderbar/>
      <div className="fake-other-profile-headerbar"></div>
      <div className="current-posts">
      <div style={{ height: 50 }}></div>
      {loading ? (
        <div className="loader-holder"><div className="loader"></div></div>
      ) : (
        posts &&
        posts.map((post) => (
          <div className="post-holder" key={post.id}>
            <Post post={post} />
          </div>
        ))
      )}
      <div>
      {!loading ? (
        <div className="post-holder"><button className="create-button" onClick={() => refetch({limit: posts.length+3})}>Load More</button></div>
      ) : (<></>)}
    </div>
      <div style={{ height: 100 }}></div>
      
      </div>
      

      <Navbar />
    </div>
  );
}
const GET_USER_POSTS = gql`
  query GetPostsByUser($username: String!, $limit: Int!) {
    getPostsByUser(username: $username, limit: $limit) {
      caption
      color
      commentCount
      comments {
        body
        createdAt
        id
        username
      }
      createdAt
      id
      image
      username
    }
  }
`;
export default Profile;
