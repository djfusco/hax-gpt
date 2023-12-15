export default async function handler(req, res) {
    const search = req.query.search || '';
    const url = 'https://api.openai.com/v1/chat/completions';
    const data =
    {                       
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": search}],
        "temperature": 0.7
    };
    
    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer KEY!!!',
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        res.setHeader('Cache-Control', 'max-age=0, s-maxage=1800');
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
        res.json(result.choices[0].message.content);
        console.log(result.choices[0].message.content);
        })
      .catch(error => {
        console.error('Error:', error);
      }); 
}