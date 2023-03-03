import React, { useContext } from "react";
import gql from "graphql-tag";
import SingleUserHeaderbar from "../components/SingleUserHeaderbar";
import { useQuery } from "@apollo/client";
import {FETCH_POSTS_QUERY} from '../util/graphql'
import Post from "../components/Post";
import Navbar from "../components/Navbar";
function SingleUser(props) {
  const username = props.match.params.username;
  const limit = 3;
  const {loading, data, refetch} = useQuery(GET_USER_POSTS, {
    variables: {
      username,
      limit
    }
  });
  var posts = {};
  if(!loading){
    posts = data.getPostsByUser;
  }
  
  return (
    <div>
      <SingleUserHeaderbar username={username}/>
      <div className="fake-other-profile-headerbar"></div>
      <div className="current-posts">
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
      <div style={{ height: 120 }}></div>
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
export default SingleUser;
