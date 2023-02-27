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
  const {loading, data} = useQuery(FETCH_POSTS_QUERY);
  var posts = {};
  if(!loading){
    posts = [...data.getPosts.filter((post)=>post.username===user.username)];
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
      <div style={{ height: 100 }}></div>
      </div>
      

      <Navbar />
    </div>
  );
}
export default Profile;
