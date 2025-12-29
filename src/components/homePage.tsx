import React from 'react'
import axios from "axios";
const HomePage  = () => {
const [diary,setDiary]= React.useState<string>('')
function formatDateIntl(date:Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false 
  }).format(date).replace(',', '');
}
const handleSubmit = (event: React.FormEvent)=>{
    event.preventDefault()
    axios.post('http://localhost:5000/diary',
        {content:{
        date: formatDateIntl(new Date()),
        diary:diary}})
        .then((res)=>{
        console.log(res.data)
    }).catch((err)=>{
        console.log(err)
    })
}
    return <div><h1>Welcome to the Home Page</h1>

    <form onSubmit={handleSubmit}>
        
         <textarea rows={10} cols={50} placeholder="Type something here..." onChange={(e)=>{setDiary(e.target.value)}}></textarea>
         <button type='submit'>Submit</button>
    </form>
       

    </div>
}

export default HomePage