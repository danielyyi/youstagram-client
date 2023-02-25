import React, { useContext, useState } from "react";
//import pfp from "../pfp.png";
import { AuthContext } from "../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faPlus,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

import {CirclePicker} from "react-color";

import MockPost from "../components/MockPost";

import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "../util/hooks";
import {FETCH_POSTS_QUERY} from '../util/graphql'

import { Link } from "react-router-dom";

function ProfileHeaderbar() {
  const { user, logout } = useContext(AuthContext);
  const [bio, setBio] = useState(user.bio);
  
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    bio: '',
  });

  const [editBio, { error }] = useMutation(EDIT_BIO_MUTATION, {
    variables: values,
  });

  function createPostCallback(){
    editBio();
    setBio(values.bio);
    
    console.log("EDITED")
  }

  
  return (
    <div className="profile-headerbar">
      <div className="profile-header-info">
        <div className="profile-name-bio">
          <div className="profile-name">{user.username}</div>
          <div className="profile-bio">{bio}</div>
        </div>
        
      </div>
      <div className="profile-header-buttons">
        <Link to="/createpost">
          <button className="post-button">Post +</button>
        </Link>
        <div className="header-right">
        <Link to="/edit">
          <button className="edit-profile-button">Edit Profile</button>
          </Link>
          <Link to="/">
          <button className="dots-button" onClick={logout}>Logout</button>
          </Link>
        </div>
      </div>
      
    </div>
    
  );
}
const EDIT_BIO_MUTATION = gql`
  mutation editBio(
    $bio: String!
    ) {
    editBio(
      bio: $bio
      ) {
      bio
    createdAt
    email
    id
    username
    }
  }
`;

export default ProfileHeaderbar;
