import { useState, useEffect } from "react";
import send from "./assets/send.png";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";
import axios from 'axios'
function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    document.querySelector('.layout').scrollTop=document.querySelector('.layout').scrollHeight;
  }, [posts])

  const fetchBotResponse= async ()=>{
    const {data} = await axios.post("http://localhost:4000",{input},{headers:{"Content-Type":"application/json",}});
    return data;
  }
  const onSubmit=()=>{
    if(input.trim()==='')
    {
      return;
    }
    addPost(input);
    addPost("Loading...",false,true);
    fetchBotResponse().then((res)=>{
      console.log(res);
      addPost(res.bot.trim(),true,false);
    })
    setInput("");
    
  }

  const typingBotResponse=(post)=>{
    let index =0;
    const interval = setInterval(()=>{
          if(index<post.length)
          {
              
              setPosts(prevState=>{
                const lastItem= prevState.pop();
                if(lastItem.type!='bot')
                {
                  prevState.push({type:'bot', post: post.charAt(index-1)});
                }else{
                    prevState.push({type:'bot', post: lastItem.post+ post.charAt(index-1)})
                }
                
                return [...prevState]
               }
               )
               index++;
          }else{
            clearInterval(interval);
          }
    },30)
  }

  const addPost=(post,isBot,isLoading)=>{
    if(isBot)
    {
      console.log(post);
      typingBotResponse(post)
    }else
    {
      setPosts(prevState=>{
       return [
         ...prevState,
         {type: isLoading?'loading':'user', post}
       ]
      })
      
    }
  }
  const onKeyUp=(event)=>{
    if(event.key==="Enter"|| event.which===13){
      onSubmit();
    }
  }

  const userPosts = posts.map((post, index) => {
    return (
      <div key={index}
        className={`chat-bubble ${
          post.type === "bot" || bot.type === "loading" ? "bot" : ""
        }`}
      >
        <div className="avatar">
          <img
            src={post.type === "bot" || post.type === "loading" ? bot : user}
            alt=""
          />
        </div>
        {post.type === "loading" ? (
          <div className="loader">
            <img src={loadingIcon} alt="" />
          </div>
        ) : (
          <div className="post">{post.post}</div>
        )}
      </div>
    );
  });
  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">{userPosts}</div>
      </section>
      <footer>
        <input
          value={input}
          className="composebar"
          autoFocus
          type="text"
          placeholder="Ask anything you feel like"
          onChange={(event) => {
              setInput(event.target.value)
              console.log(input);
          }
        
        }
        onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="" />
        </div>
      </footer>
    </main>
  );
}

export default App;
