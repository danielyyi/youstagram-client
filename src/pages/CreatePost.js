import React, { useContext, useState, useEffect } from "react";
import {CirclePicker} from "react-color";
import { AuthContext } from "../context/auth";
import MockPost from "../components/MockPost";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "../util/hooks";
import {FETCH_POSTS_QUERY, LOAD_POSTS_QUERY} from '../util/graphql'
import FileBase from 'react-file-base64'

const pickerStyles = {
  default: {
    picker: { // See the individual picker source for which keys to use
      width: '200px',
    },
  },
}

function MakePost(props) {
  const { user, logout } = useContext(AuthContext);

  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    caption: '',
    image: '',
    color:'#fff',
  });

  const [color, setColor] = useState('#fff');
  function changeColor(color){
    values.color = color;
    setColor(color);
  }

  function resizeImage(base64Str, maxWidth = 400, maxHeight = 350) {
    return new Promise((resolve) => {
      let img = new Image()
      img.src = base64Str
      img.onload = () => {
        let canvas = document.createElement('canvas')
        const MAX_WIDTH = maxWidth
        const MAX_HEIGHT = maxHeight
        let width = img.width
        let height = img.height
  
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL())
      }
    })
  }

  const [image, setImage] = useState('');
  function changeImage(image){
    setImage(image)
    resizeImage(image, 400, 400).then((result) => values.image = result);
  }

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
   
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: LOAD_POSTS_QUERY,
      });
      if(data){
        proxy.writeQuery({
          query: LOAD_POSTS_QUERY,
          data: {
            getPosts: [result.data.createPost, ...data.getPosts],
          },
        });
        values.caption = "";
      }
      
    },
  });

  function createPostCallback(){
    createPost();
    props.history.push("/");
  }

  
  return (
    <div>
      
      <div style={{textAlign: 'center', fontSize: '3vh', paddingTop: '2vh'}}>Create a post</div>
      <div className="create-form">
      <form onSubmit={onSubmit}>
        <div className="create-post-form-holder">
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <FileBase
            type = "file"
            multiple={false}
            onDone = {({base64}) => changeImage(base64)}
            />
          </div>
          <div className="mock-create-post-holder" >
          <MockPost i={image} color = {color}/>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <input
            wrap="soft"
              type="text"
              onChange={onChange}
              value = {values.caption}
              className = "post-caption"
              style={{color: 'black'}}
              name="caption"
              placeholder="Caption..."
            />
          </div>
        </div>

        
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
            <CirclePicker  styles = {pickerStyles} color = {color} onChange={({hex}) => changeColor(hex)}/>
          </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <Link to="/profile">
          <button className="create-button">Cancel</button>
        </Link>
        <button className="create-button" type="submit">
          Post
        </button>
        </div>
        </div>
      </form>
      </div>
    </div>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost(
    $caption: String!
    $image: String!
    $color: String
    ) {
    createPost(
      caption: $caption
      image: $image
      color: $color
      ) {
      id
      caption
      createdAt
      username
      image
      color
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

export default MakePost;
