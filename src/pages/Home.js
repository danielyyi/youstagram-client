import React, {useState} from "react";
import Navbar from "../components/Navbar";
import Headerbar from "../components/Headerbar";
import Post from "../components/Post";
import { LOAD_POSTS_QUERY } from "../util/graphql";

import { useQuery, useLazyQuery, ApolloClient, InMemoryCache, makeVar} from "@apollo/client";

import gql from "graphql-tag";
import {FETCH_POSTS_QUERY} from '../util/graphql'
//YOU NEED TO CHANGE CREATE POST TO LOAD POST QUERY
function Home() {
  const client = new ApolloClient({
    cache: new InMemoryCache()
  });

  var posts = [];
    const limit = 3;
    const {loading, data, refetch} = useQuery(LOAD_POSTS_QUERY, {
      variables:{
        limit
      },
      fetchPolicy: 'network-only', // Used for first execution
      nextFetchPolicy: 'cache-first',
    });

  
//---------
   
    console.log(data)
    if(!loading && data && data.loadPosts){
      data.loadPosts.forEach(element => {
        posts.push(element);
      });
      console.log(posts)
      console.log("pressed");
    }
    //----
  return (
    <div>
      <Headerbar />
      <div className="fake-headerbar"></div>
      <div className="current-posts" >
      {loading ? (
        <div className="loader-holder"><div className="loader"></div></div>
      ) : (
        posts &&
        posts.map((post) => (
          <div className="post-holder" key={post.id} >
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
/*
const LOAD_POSTS_QUERY = gql`
query LoadPosts($limit: Int!) {
  loadPosts(limit: $limit) {
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
}`
*/

export default Home;
