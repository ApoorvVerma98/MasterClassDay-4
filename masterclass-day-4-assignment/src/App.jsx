import React, { useEffect, useContext, useReducer, createContext } from "react";
import styles from "./App.module.css";

// useState is not used, instead useReducer is used to manage the state in the Posts component.
// useContext is used to access the selected user and posts in the Details component.
// useEffect is used to fetch the posts from the API and set it in the state.
// createContext is used to create the UserContext and PostsContext contexts.

const UserContext = createContext(null);
const PostsContext = createContext([]);

const initialState = {
  posts: [],
  selectedUser: null
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.payload };
    case "SET_SELECTED_USER":
      return { ...state, selectedUser: action.payload };
    default:
      throw new Error();
  }
}

function Posts() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { posts, selectedUser } = state;

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await response.json();
      dispatch({ type: "SET_POSTS", payload: data });
    }
    fetchPosts();
  }, []);

  function handleUserClick(user) {
    dispatch({ type: "SET_SELECTED_USER", payload: user });
  }

  const users = [...new Set(posts.map((post) => post.userId))];

  return (
    <div className={styles.container}>
      <UserContext.Provider value={selectedUser}>
        <PostsContext.Provider value={posts}>
          <section>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user} className={styles.row}>
                    <td>{user}</td>
                    <td>{posts.find((post) => post.userId === user).title}</td>
                    <td>
                      <button onClick={() => handleUserClick(user)} className={styles.button}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section>{selectedUser ? <Details /> : <p>Please select a user to view their posts.</p>}</section>
        </PostsContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

function Details() {
  const selectedUser = useContext(UserContext);
  const posts = useContext(PostsContext);

  return (
    <div className={styles.details}>
      <h2>User {selectedUser}</h2>
      <ul>
        {posts.filter((post) => post.userId === selectedUser).map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
