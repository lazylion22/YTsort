const apikey_textbox = document.getElementById('apikey')
const checkbox = document.getElementById("remember")
var apikey;
if (localStorage.getItem("apikey") === null) {
  apikey = ''
}
else{
  apikey = localStorage.getItem('apikey');
  apikey_textbox.value = apikey
}

// one year ago:
const year_ago = new Date(new Date().setFullYear(new Date().getFullYear() - 1)) 
// date to ISO:
// var iso_date = new Date().toISOString()

const inputStart = document.getElementById('dateStart')
const inputEnd = document.getElementById('dateEnd')

inputStart.valueAsDate = year_ago
inputEnd.valueAsDate = new Date()


function submited(e){
  e.preventDefault()
  apikey = apikey_textbox.value
  if (apikey===''){
    apikey_textbox.style.border="3px solid red";
  }
  else{
    if (checkbox.checked){
      localStorage.setItem('apikey', apikey);
    }
    else{
      localStorage.removeItem("apikey"); 

    }
    const dateStart = document.getElementById('dateStart').valueAsDate.toISOString()
    const dateEnd = document.getElementById('dateEnd').valueAsDate.toISOString()
    var link = document.getElementById('link').value
    var channel_id = link.slice(link.lastIndexOf('/')+1)
    const diva = document.getElementById("diva")
    diva.innerHTML = 'Loading'
    fetchjson(channel_id,dateStart,dateEnd).then((jfile) => {
      diva.innerHTML= ''
  
  
      for(const item of jfile.items){
          
        const title = item.snippet.title 
        link = "https://www.youtube.com/watch?v="+item.id.videoId 
        const thumb = item.snippet.thumbnails.default.url
        var publish_date = new Date(item.snippet.publishedAt)
        publish_date = publish_date.toLocaleDateString('en-GB')
        const description = item.snippet.description 
  
        
        diva.innerHTML= diva.innerHTML+`
        <h2>${title}</h2>
        <div>
            <a href=${link} target="_blank">
                <img src=${thumb} alt="${title} ${" thumb"}" >
            </a> 
            <br>
            <b>${publish_date}</b>
            
            <br>
            ${description}
            <br>
            <a href=${link} target="_blank" >${link}</a>.
        </div>
      `;
      }
    });
  }
}
async function fetchjson(channel_id,dateStart,dateEnd) {
  const req = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId='+channel_id+'&publishedAfter='+dateStart+'&publishedBefore='+dateEnd+'&order=viewCount&maxResults=25&type=video&key='+apikey
  console.log(req)
  const response = await fetch(req).catch((error) => {
    console.log(error)
  });
  const jfile = await response.json()


  console.log("finished async")
  return jfile
}
apikey_textbox.oninput = () => {

  //console.log(apikey_textbox.value)
  apikey_textbox.style.border='';
}
